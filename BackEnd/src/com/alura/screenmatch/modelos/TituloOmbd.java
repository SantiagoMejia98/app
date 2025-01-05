package com.alura.screenmatch.modelos;

import com.google.gson.annotations.SerializedName;

public record TituloOmbd(String title, String year, String runtime, @SerializedName("totalSeasons") String totalSeasons, String director, String actors, String poster, String writer, String type) {
}
