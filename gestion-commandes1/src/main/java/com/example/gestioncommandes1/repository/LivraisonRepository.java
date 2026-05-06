package com.example.gestioncommandes1.repository;

import com.example.gestioncommandes1.entity.Livraison;
import com.example.gestioncommandes1.entity.StatutLivraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivraisonRepository extends JpaRepository<Livraison, Long> {
    
    // Trouver la livraison d'une commande
    Optional<Livraison> findByCommandeId(Long commandeId);
    
    // Livraisons par statut
    List<Livraison> findByStatut(StatutLivraison statut);
    
    // Livraisons d'un transporteur
    List<Livraison> findByTransporteurId(Long transporteurId);
}