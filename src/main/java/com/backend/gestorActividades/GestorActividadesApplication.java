package com.backend.gestorActividades;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing // ALLOW AUDITING FIELDS IN MONGODB DOCUMENTS
public class GestorActividadesApplication {
	public static void main(String[] args) {
		SpringApplication.run(GestorActividadesApplication.class, args);
	}
}
