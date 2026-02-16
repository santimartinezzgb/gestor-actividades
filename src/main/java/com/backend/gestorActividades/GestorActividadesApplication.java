package com.backend.gestorActividades;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing // PERMITIR CAMPOS DE AUDITORÍA EN DOCUMENTOS MONGODB
public class GestorActividadesApplication {
	public static void main(String[] args) {
		SpringApplication.run(GestorActividadesApplication.class, args);
	}
}
