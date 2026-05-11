package com.example.gestioncommandes1.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.gestioncommandes1.entity.LigneCommande;
import com.example.gestioncommandes1.entity.StatutCommande;

import lombok.Data;

@Data
public class CommandeDTO {
    private Long id;
    private Long clientId;
    private String clientNom;
    private LocalDateTime date;
    private StatutCommande statut;
    private Double montantTotal;
    private List<LigneCommande> lignesCommande;
}