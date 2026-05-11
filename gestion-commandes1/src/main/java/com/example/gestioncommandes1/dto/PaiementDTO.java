package com.example.gestioncommandes1.dto;

import java.time.LocalDateTime;

import com.example.gestioncommandes1.entity.StatutPaiement;

import lombok.Data;

@Data
public class PaiementDTO {
    private Long id;
    private Long commandeId;
    private LocalDateTime date;
    private StatutPaiement statut;
    private String mode;
}