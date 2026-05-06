package com.example.gestioncommandes1.repository;

import com.example.gestioncommandes1.entity.Commande;
import com.example.gestioncommandes1.entity.StatutCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    
    // Trouver les commandes d'un client
    List<Commande> findByClientId(Long clientId);
    
    // Trouver par statut
    List<Commande> findByStatut(StatutCommande statut);
    
    // Historique : commandes par client ordonnées par date décroissante
    List<Commande> findByClientIdOrderByDateDesc(Long clientId);
}