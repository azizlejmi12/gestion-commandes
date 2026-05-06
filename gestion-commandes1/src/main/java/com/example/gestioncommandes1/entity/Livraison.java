package com.example.gestioncommandes1.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "livraisons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})  // ✅ SUR LA CLASSE
public class Livraison {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.EAGER)  // ✅ EAGER
    @JoinColumn(name = "commande_id", nullable = false, unique = true)
    @NotNull(message = "La commande est obligatoire")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "livraison", "paiement", "lignesCommande"})
    private Commande commande;
    
    @ManyToOne(fetch = FetchType.EAGER)  // ✅ EAGER
    @JoinColumn(name = "transporteur_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "livraisons"})  // ✅ SUR TRANSPORTEUR
    private Transporteur transporteur;
    
    @Column(name = "date_livraison")
    private LocalDateTime dateLivraison;
    
    @Positive(message = "Le coût doit être positif")
    private Double cout;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutLivraison statut;
    
    @PrePersist
    protected void onCreate() {
        if (statut == null) {
            statut = StatutLivraison.EN_PREPARATION;
        }
    }
}