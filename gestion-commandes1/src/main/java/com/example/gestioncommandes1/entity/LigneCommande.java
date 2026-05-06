package com.example.gestioncommandes1.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lignes_commande")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommande {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    @NotNull(message = "La commande est obligatoire")
    @JsonBackReference
    private Commande commande;
    
    @NotBlank(message = "Le produit est obligatoire")
    @Column(nullable = false)
    private String produit;
    
    @Min(value = 1, message = "La quantité minimum est 1")
    @Column(nullable = false)
    private Integer quantite;
    
    @Positive(message = "Le prix unitaire doit être positif")
    @Column(name = "prix_unitaire", nullable = false)
    private Double prixUnitaire;
    
    public Double getSousTotal() {
        return quantite * prixUnitaire;
    }
}