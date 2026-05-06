package com.example.gestioncommandes1.service;

import com.example.gestioncommandes1.entity.Commande;
import com.example.gestioncommandes1.entity.Paiement;
import com.example.gestioncommandes1.entity.StatutCommande;
import com.example.gestioncommandes1.entity.StatutPaiement;
import com.example.gestioncommandes1.repository.CommandeRepository;
import com.example.gestioncommandes1.repository.PaiementRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PaiementService {
    
    private final PaiementRepository paiementRepository;
    private final CommandeRepository commandeRepository;
    
    // Créer un paiement
    public Paiement creerPaiement(Long commandeId, String mode) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new EntityNotFoundException("Commande non trouvée"));
        
        if (commande.getPaiement() != null) {
            throw new IllegalStateException("Cette commande a déjà un paiement");
        }
        
        Paiement paiement = new Paiement();
        paiement.setCommande(commande);
        paiement.setMode(mode);
        paiement.setStatut(StatutPaiement.EN_ATTENTE);
        
        return paiementRepository.save(paiement);
    }
    
    // Traiter le paiement (simulation)
    public Paiement traiterPaiement(Long paiementId) {
        Paiement paiement = getPaiementById(paiementId);
        
        if (paiement.getStatut() != StatutPaiement.EN_ATTENTE) {
            throw new IllegalStateException("Paiement déjà traité");
        }
        
        // Simulation : 90% de chances de succès
        boolean succes = Math.random() > 0.1;
        
        if (succes) {
            paiement.setStatut(StatutPaiement.PAYE);
            
            // 🔥 IMPORTANT : Met à jour le statut de la commande
            Commande commande = paiement.getCommande();
            commande.setStatut(StatutCommande.EN_COURS_DE_TRAITEMENT);
            commandeRepository.save(commande);
            
        } else {
            paiement.setStatut(StatutPaiement.REFUSE);
        }
        
        return paiementRepository.save(paiement);
    }
    
    // Rembourser
    public Paiement rembourser(Long paiementId) {
        Paiement paiement = getPaiementById(paiementId);
        
        if (paiement.getStatut() != StatutPaiement.PAYE) {
            throw new IllegalStateException("Seuls les paiements payés peuvent être remboursés");
        }
        
        paiement.setStatut(StatutPaiement.REMBOURSE);
        return paiementRepository.save(paiement);
    }
    
    // GET
    @Transactional(readOnly = true)
    public Paiement getPaiementById(Long id) {
        return paiementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paiement non trouvé"));
    }
    
    @Transactional(readOnly = true)
    public Paiement getPaiementByCommande(Long commandeId) {
        return paiementRepository.findByCommandeId(commandeId)
                .orElseThrow(() -> new EntityNotFoundException("Pas de paiement pour cette commande"));
    }
    
    
    @Transactional(readOnly = true)
    public List<Paiement> getAllPaiements() {
        return paiementRepository.findAll();
    }
}