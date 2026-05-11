package com.example.gestioncommandes1.dto;

import lombok.Data;

@Data
public class ClientDTO {
    private Long id;
    private String nom;
    private String email;
    private String adresse;
}