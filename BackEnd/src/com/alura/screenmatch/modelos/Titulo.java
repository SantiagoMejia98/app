package com.alura.screenmatch.modelos;

public class Titulo implements Comparable<Titulo>{
    private String nombre;
    private String lanzamiento;
    private String duracion;
    private String director;
    private String actores;
    private String poster;
    private String tipo;

    public Titulo(TituloOmbd miTituloOmbd) {
        this.nombre = miTituloOmbd.title();
        this.lanzamiento = miTituloOmbd.year();
        if(miTituloOmbd.type().equalsIgnoreCase("series")){
            if(miTituloOmbd.totalSeasons().equalsIgnoreCase("1")){
                this.duracion = miTituloOmbd.totalSeasons() + " temporada";
            }else{
                this.duracion = miTituloOmbd.totalSeasons() + " temporadas";
            }
            this.director = miTituloOmbd.writer();
            this.tipo = "serie";
        }else{
            this.duracion = miTituloOmbd.runtime();
            this.director = miTituloOmbd.director();
            this.tipo = "pelicula";
        }
        this.actores = miTituloOmbd.actors();
        this.poster = miTituloOmbd.poster();
    }

    public String getLanzamiento() {
        return lanzamiento;
    }

    public String getActores() {
        return actores;
    }

    public String getPoster() {
        return poster;
    }

    public String getTipo() {
        return tipo;
    }

    public String getDirector() {
        return director;
    }

    public String getDuracion() {
        return duracion;
    }

    public String getNombre() {
        return nombre;
    }

    public String getFechaDeLanzamiento() {
        return lanzamiento;
    }

    public String getDuracionEnMinutos() {
        return duracion;
    }



    public void muestraFichaTecnica(){
        System.out.println("Nombre de la película: " + nombre);
        System.out.println("Año de lanzamiento: " + lanzamiento);
    }

    @Override
    public int compareTo(Titulo otroTitulo) {
        return this.getNombre().compareTo(otroTitulo.getNombre());
    }

    @Override
    public String toString() {
        return "Movie{" +
                "nombre='" + nombre + '\'' +
                ", lanzamiento='" + lanzamiento + '\'' +
                ", duracion='" + duracion + '\'' +
                ", director='" + director + '\'' +
                ", actores='" + actores + '\'' +
                ", poster='" + poster + '\'' +
                ", tipo='" + tipo + '\'' +
                '}';
    }

    public void setNombre(String replace) {
            this.nombre = replace;
    }
}
