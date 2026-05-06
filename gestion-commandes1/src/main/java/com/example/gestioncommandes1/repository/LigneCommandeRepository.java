package com.example.gestioncommandes1.repository;

import com.example.gestioncommandes1.entity.LigneCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LigneCommandeRepository extends JpaRepository<LigneCommande, Long> {
    
    // Lignes d'une commande spécifique
    List<LigneCommande> findByCommandeId(Long commandeId);
}