package com.example.gestioncommandes1.dto;

import java.time.LocalDateTime;

import com.example.gestioncommandes1.entity.StatutLivraison;

import lombok.Data;

@Data
public class LivraisonDTO {
    private Long id;
    private Long commandeId;
    private Long transporteurId;
    private String transporteurNom;
    private LocalDateTime dateLivraison;
    private Double cout;
    private StatutLivraison statut;
}