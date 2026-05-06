package com.example.gestioncommandes1.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "commandes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class Commande {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    @NotNull(message = "Le client est obligatoire")
    private Client client;
    
    @Column(nullable = false)
    private LocalDateTime date;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutCommande statut;
    
    @Positive(message = "Le montant doit être positif")
    @Column(name = "montant_total")
    private Double montantTotal;
    
    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true,fetch=FetchType.EAGER)
    @JsonManagedReference
    private List<LigneCommande> lignesCommande = new ArrayList<>();
    
    @OneToOne(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore  // ✅ CORRECT : Sur la même ligne que la déclaration
    private Livraison livraison;
    
    @OneToOne(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore  // ✅ CORRECT : Sur la même ligne que la déclaration
    private Paiement paiement;
    
    // ✅ @PrePersist doit être SEUL sur sa méthode
    @PrePersist
    protected void onCreate() {
        date = LocalDateTime.now();
        if (statut == null) {
            statut = StatutCommande.EN_ATTENTE;
        }
    }
}