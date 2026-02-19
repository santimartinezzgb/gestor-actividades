package com.backend.gestorActividades;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableMongoAuditing // PERMITIR CAMPOS DE AUDITORÍA EN DOCUMENTOS MONGODB
@EnableScheduling // HABILITAR TAREAS PROGRAMADAS
public class GestorActividadesApplication {
	public static void main(String[] args) {
		SpringApplication.run(GestorActividadesApplication.class, args);
	}
}
