import getdatos from "./getDatos.js";

// Mapea los elementos DOM que desea actualizar
const elementos = {
    peliculas: document.querySelector('[data-name="peliculas"]'),
    series: document.querySelector('[data-name="series"]'),
    pelicula: document.querySelector('[data-name="pelicula"]'),
    serie: document.querySelector('[data-name="serie"]')
};

const busquedaInput = document.getElementById('busqueda-input');
const botonInicio = document.getElementById('inicio');

// Función para crear la lista de películas o series
function crearListaPeliculas(elemento, datos) {
    // Verifica si hay un elemento <ul> dentro de la sección
    const ulExistente = elemento.querySelector('ul');

    // Si un elemento <ul> ya existe dentro de la sección, bórralo
    if (ulExistente) {
        elemento.removeChild(ulExistente);
    }

    const ul = document.createElement('ul');
    ul.className = 'lista';
    
    // Recorrer los datos para crear cada elemento <li> y añadirlo al <ul>
    datos.forEach(pelicula => {
        const li = document.createElement('li');
        li.className = 'card';
        
        li.innerHTML = `
            <div class="pelicula-container">
                <h2 class="titulo"><strong>${pelicula.Nombre}</strong></h2>
                <img src="${pelicula.Poster}" alt="${pelicula.Nombre}">
                <div class="informacion">
                    <p class="fecha"><strong>Año:</strong> ${pelicula.Lanzamiento}</p>
                    <p class="duracion"><strong>Duración:</strong> ${pelicula.Duracion}</p>
                    <p class="director"><strong>Director:</strong> ${pelicula.Director}</p>
                    <p class="actores"><strong>Actores:</strong> ${pelicula.Actores}</p>
                </div>
            </div>
        `;

        // Agregar event listener a cada card
        li.addEventListener('click', () => {
            let indice = encontrarIndicePorNombre(aleatorio[0].Nombre);
            mostrarTodosLosElementos(todasLasPeliculas, todasLasSeries);
            scrollToCard(indice);
            aleatorio = [];
        });
        
        ul.appendChild(li);
    });

    elemento.appendChild(ul);
}

// Funcion genérica para tratamiento de errores
function tratarConErrores(mensajeError) {
    console.error(mensajeError);
}

// Función para seleccionar elementos aleatorios
function seleccionarElementosAleatorios(array, numElementos) {
    const resultados = [];
    const arrayCopia = [...array];

    for (let i = 0; i < numElementos; i++) {
        const indiceAleatorio = Math.floor(Math.random() * arrayCopia.length);
        resultados.push(arrayCopia.splice(indiceAleatorio, 1)[0]);
    }

    return resultados;
}

let todasLasPeliculas = [];
let todasLasSeries = [];
let resultadosPeliculas = [];
let resultadosSeries = [];

function generaSeries() {
    const datosAlmacenados = localStorage.getItem('titulos');
    
    if (datosAlmacenados) {
        try {
            const datos = JSON.parse(datosAlmacenados);
            todasLasPeliculas = datos.filter(item => item.Tipo === 'pelicula');
            todasLasSeries = datos.filter(item => item.Tipo === 'serie');

            crearListaPeliculas(elementos.peliculas, todasLasPeliculas);
            crearListaPeliculas(elementos.series, todasLasSeries);
        } catch (error) {
            tratarConErrores("Error al analizar datos almacenados.");
            localStorage.removeItem('titulos'); // Eliminar datos corruptos
            cargarDatosDesdeBackend(); // Intentar cargar desde el backend
        }
    } else {
        cargarDatosDesdeBackend(); // Si no hay datos en localStorage, cargar desde el backend
    }
}

function cargarDatosDesdeBackend() {
    const url = 'https://raw.githubusercontent.com/SantiagoMejia98/app/main/BackEnd/titulos.json'; // URL del JSON en GitHub

    getdatos(url)
        .then(data => {
            if (data && Array.isArray(data)) {
                localStorage.setItem('titulos', JSON.stringify(data));
                todasLasPeliculas = data.filter(item => item.Tipo === 'pelicula');
                todasLasSeries = data.filter(item => item.Tipo === 'serie');

                crearListaPeliculas(elementos.peliculas, todasLasPeliculas);
                crearListaPeliculas(elementos.series, todasLasSeries);
            } else {
                tratarConErrores("El archivo JSON no contiene una lista válida.");
            }
        })
        .catch(error => {
            tratarConErrores("Ocurrió un error al cargar los datos desde el backend.");
        });
}


generaSeries();

// Función para mostrar un solo elemento y ocultar los demás
function mostrarSoloElemento(elementoAMostrar) {
    Object.values(elementos).forEach(elemento => {
        if (elemento === elementoAMostrar) {
            elemento.classList.remove('hidden');
        } else {
            elemento.classList.add('hidden');
        }
    });
}

const cards = document.querySelectorAll('.card');
let indiceEncontrado = -1;

function encontrarIndicePorNombre(nombre) {
    let indiceEncontrado = -1;
    cards.forEach((card, index) => {
        const tituloElemento = card.querySelector('.titulo strong').innerText;
        if (tituloElemento === nombre) {
            indiceEncontrado = index;
        }
    });

    return indiceEncontrado;
}

let aleatorio = [];
// Añade event listeners a los botones
document.querySelector('.peliculas').addEventListener('click', () => mostrarSoloElemento(elementos.peliculas));
document.querySelector('.series').addEventListener('click', () => mostrarSoloElemento(elementos.series));
document.querySelector('.pelicula').addEventListener('click', () => {
    aleatorio = seleccionarElementosAleatorios(todasLasPeliculas, 1);
    crearListaPeliculas(elementos.pelicula, aleatorio);
    mostrarSoloElemento(elementos.pelicula);
    let indice = encontrarIndicePorNombre(aleatorio[0].Nombre);
});
document.querySelector('.serie').addEventListener('click', () => {
    aleatorio = seleccionarElementosAleatorios(todasLasSeries, 1);
    crearListaPeliculas(elementos.serie, aleatorio);
    mostrarSoloElemento(elementos.serie);
    let indice = encontrarIndicePorNombre(aleatorio[0].Nombre);
});

function scrollToCard(indice) {
    const listaDeCards = document.querySelectorAll('.card');
    if (indice >= 0 && indice < listaDeCards.length) {
        listaDeCards[indice].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        console.error('Índice fuera de rango');
    }
}

// Función de búsqueda
function realizarBusqueda() {
    const textoBusqueda = busquedaInput.value.toLowerCase();
    resultadosPeliculas = todasLasPeliculas.filter(pelicula => pelicula.Nombre.toLowerCase().includes(textoBusqueda));
    resultadosSeries = todasLasSeries.filter(serie => serie.Nombre.toLowerCase().includes(textoBusqueda));
}

// Añadir event listener al campo de entrada para detectar la tecla Enter
busquedaInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        realizarBusqueda(); 
        mostrarTodosLosElementos(resultadosPeliculas, resultadosSeries);
        cardsBusqueda();
    }
});

function cardsBusqueda(){
    const listaDeCards = document.querySelectorAll('.card');

    listaDeCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            let nombre = card.querySelector('.titulo strong').innerText
            let indice = encontrarIndicePorNombre(nombre);
            mostrarTodosLosElementos(todasLasPeliculas, todasLasSeries);
            scrollToCard(indice);
        });        
    });
}

function mostrarTodosLosElementos(peliculas, series) {
    busquedaInput.value = ''; // Limpiar el campo de búsqueda
    crearListaPeliculas(elementos.peliculas, peliculas);
    crearListaPeliculas(elementos.series, series);

    elementos.peliculas.classList.add('hidden');
    elementos.series.classList.add('hidden');

    // Mostrar solo la sección de películas o series si hay resultados
    if (peliculas.length > 0) {
        elementos.peliculas.classList.remove('hidden'); // Mostrar la sección de películas
    }
    if (series.length > 0) {
        elementos.series.classList.remove('hidden'); // Mostrar la sección de series
    }

    elementos.pelicula.classList.add('hidden');
    elementos.serie.classList.add('hidden');
}

// Añadir event listener al botón de inicio para mostrar todas las películas y series
botonInicio.addEventListener('click', () => {
    mostrarTodosLosElementos(todasLasPeliculas, todasLasSeries);
    localStorage.clear();
    generaSeries();
});
