package com.alura.screenmatch.principal;

import com.alura.screenmatch.Request.Busqueda;
import com.alura.screenmatch.modelos.Titulo;
import com.alura.screenmatch.modelos.TituloOmbd;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Scanner;

public class PrincipalConBusqueda {

    private final static String filePath = "app/Backend/titulos.json";
    private final static Gson gson = new GsonBuilder()
            .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
            .setPrettyPrinting().create();
    private final static Scanner lectura = new Scanner(System.in);
    private final static Busqueda busqueda = new Busqueda();

    public static void main(String[] args) throws IOException, InterruptedException {



        List<Titulo> titulos;

        Type listaPeliculasType = new TypeToken<List<Titulo>>(){}.getType();

        titulos = gson.fromJson(new FileReader(filePath), listaPeliculasType);

        int opcion = 0;

        String menu = """
                *********************************
                1- Buscar titulos
                2- Eliminar titulos
                3- Salir
                *********************************
                """;

        while (opcion != 3) {
            System.out.println(menu);
            opcion = lectura.nextInt();

            switch (opcion) {
                case 1:
                    consultarTitulos(titulos);
                    break;
                case 2:
                    borrarTitulo(titulos);
                    break;
                case 3:
                    System.out.println("Saliendo......");
                    System.out.println(titulos.size());
                default:
                    System.out.println("Opcion no valida");
                    break;
            }
        }

        FileWriter escritura = new FileWriter(filePath);
        escritura.write(gson.toJson(titulos));
        escritura.close();
        System.out.println("Finalizó la ejecucion del programa");
    }

    private static void consultarTitulos(List<Titulo> titulos) {
        while (true) {
            lectura.nextLine();
            System.out.println("Escriba el nombre del titulo: ");
            String titulo = lectura.nextLine();

            if (titulo.equalsIgnoreCase("salir")) {
                break;
            }

            TituloOmbd miTituloOmbd = busqueda.buscarTitulo(titulo, gson);
            System.out.println(miTituloOmbd);

            if(miTituloOmbd.title() != null){
                System.out.println("Es la pelicula correcta? 1- Si, 2- No");
                int a = lectura.nextInt();
                if(a == 1){
                    agregarTitulo(titulos, miTituloOmbd);
                }
            }
        }
    }

    private static void agregarTitulo(List<Titulo> titulos, TituloOmbd miTituloOmbd){
        Titulo miTitulo = new Titulo(miTituloOmbd);
        System.out.println("Titulo ya convertido: " + miTitulo);

        if(verificarExistencia(titulos, miTitulo)){
            System.out.println("El titulo ya existe");
        }else{
            titulos.add(miTitulo);
        }
    }

    private static boolean verificarExistencia(List<Titulo> titulos, Titulo miTitulo){
        for (Titulo titulo : titulos){
            if (titulo.getNombre().equals(miTitulo.getNombre()) &&
                    titulo.getFechaDeLanzamiento().equals(miTitulo.getFechaDeLanzamiento()) &&
                    titulo.getDirector().equals(miTitulo.getDirector()) ){
                return true;
            }
        }
        return false;
    }

    private static void borrarTitulo(List<Titulo> titulos){
        while(true){
            lectura.nextLine();
            System.out.println("Ingrese el titulo que desea eliminar");
            var nombre = lectura.nextLine();

            if (nombre.equalsIgnoreCase("salir")) {
                break;
            }
            for (Titulo titulo : titulos){
                if (titulo.getNombre().toLowerCase().contains(nombre.toLowerCase())){
                    System.out.println(titulo);
                    System.out.println("desea eliminar este titulo? 1- Si, 2- No");
                    int a = lectura.nextInt();
                    if(a == 1){
                        titulos.remove(titulo);
                        System.out.println("Titulo eliminado");
                        break;
                    }
                }
            }
        }
    }
}
