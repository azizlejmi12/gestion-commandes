package com.example.gestioncommandes1.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "paiements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paiement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false, unique = true)
    @NotNull(message = "La commande est obligatoire")
    @JsonIgnoreProperties
    private Commande commande;
    
    @Column(nullable = false)
    private LocalDateTime date;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutPaiement statut;
    
    @NotBlank(message = "Le mode de paiement est obligatoire")
    @Column(nullable = false)
    private String mode;
    
    @PrePersist
    protected void onCreate() {
        date = LocalDateTime.now();
        if (statut == null) {
            statut = StatutPaiement.EN_ATTENTE;
        }
    }
}