package com.alura.screenmatch.Request;

import com.alura.screenmatch.excepcion.ErrorEnConversionDeDuracionException;
import com.alura.screenmatch.modelos.TituloOmbd;
import com.google.gson.Gson;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;

public class Busqueda {

    private static final String direccion = "https://www.omdbapi.com/?t=";
    private static final String apiKey = "&apikey=e6d34325";

    public TituloOmbd buscarTitulo(String titulo, Gson gson){
        try{
            HttpClient client = HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(URI.create(direccion + titulo.replace(" ", "+") + apiKey))
                    .build();

            HttpResponse<String> response = client
                    .send(request, HttpResponse.BodyHandlers.ofString());

            String json = response.body();

            TituloOmbd miTituloOmbd = gson.fromJson(json, TituloOmbd.class);
            return miTituloOmbd;

        }catch (NumberFormatException e){
            System.out.println("Ocurrio un error: " + e.getMessage());
        }catch (IllegalArgumentException e){
            System.out.println("Error en la URI, verifique la direccion.");
        }catch (ErrorEnConversionDeDuracionException e){
            System.out.println(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return null;
    }





}
