package com.example.gestioncommandes1.repository;

import com.example.gestioncommandes1.entity.Paiement;
import com.example.gestioncommandes1.entity.StatutPaiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    
    // Paiement d'une commande
    Optional<Paiement> findByCommandeId(Long commandeId);
    
    // Vérifier si une commande est payée
    boolean existsByCommandeIdAndStatut(Long commandeId, StatutPaiement statut);
}