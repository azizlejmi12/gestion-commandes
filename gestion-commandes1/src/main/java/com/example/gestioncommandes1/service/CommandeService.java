package com.example.gestioncommandes1.service;

import com.example.gestioncommandes1.entity.*;
import com.example.gestioncommandes1.repository.ClientRepository;
import com.example.gestioncommandes1.repository.CommandeRepository;
import com.example.gestioncommandes1.repository.LigneCommandeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommandeService {
    
    private final CommandeRepository commandeRepository;
    private final ClientRepository clientRepository;
    private final LigneCommandeRepository ligneCommandeRepository;
    
    // Créer une commande avec calcul automatique du montant total
    @Transactional
    public Commande creerCommande(Long clientId, List<LigneCommande> lignes) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client non trouvé"));
        
        Commande commande = new Commande();
        commande.setClient(client);
        commande.setStatut(StatutCommande.EN_ATTENTE);
        
        // Sauvegarder d'abord la commande pour avoir son ID
        Commande savedCommande = commandeRepository.save(commande);
        
        // ✅ NOUVEAU : Initialiser la liste des lignes
        List<LigneCommande> lignesCommande = new ArrayList<>();  // ✅ Bon !
        double montantTotal = 0;
        for (LigneCommande ligne : lignes) {
            ligne.setCommande(savedCommande);
            LigneCommande savedLigne = ligneCommandeRepository.save(ligne);
            
            // ✅ AJOUTE CECI : Ajouter la ligne sauvegardée à la liste
            lignesCommande.add(savedLigne);
            
            montantTotal += ligne.getSousTotal();
        }
        
        // ✅ AJOUTE CECI : Associer les lignes à la commande
        savedCommande.setLignesCommande(lignesCommande);
        savedCommande.setMontantTotal(montantTotal);
        
        return commandeRepository.save(savedCommande);
    }
    
 // Modifier une commande (seulement si EN_ATTENTE)
    public Commande updateCommande(Long id, Commande commandeDetails) {
        Commande commande = getCommandeById(id);
        
        if (commande.getStatut() != StatutCommande.EN_ATTENTE) {
            throw new IllegalStateException("Seules les commandes en attente peuvent être modifiées");
        }
        
        // Modifier les lignes (supprimer anciennes, ajouter nouvelles)
        commande.getLignesCommande().clear();
        
        double montantTotal = 0;
        for (LigneCommande ligne : commandeDetails.getLignesCommande()) {
            ligne.setCommande(commande);
            commande.getLignesCommande().add(ligne);
            montantTotal += ligne.getSousTotal();
        }
        
        commande.setMontantTotal(montantTotal);
        return commandeRepository.save(commande);
    }
    // Valider une commande (changer statut)
    public Commande validerCommande(Long commandeId) {
        Commande commande = getCommandeById(commandeId);
        
        if (commande.getStatut() != StatutCommande.EN_ATTENTE) {
            throw new IllegalStateException("Seules les commandes en attente peuvent être validées");
        }
        
        commande.setStatut(StatutCommande.VALIDEE);
        return commandeRepository.save(commande);
    }
    
    // GET ALL
    @Transactional(readOnly = true)
    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }
    
    // GET ONE
    @Transactional(readOnly = true)
    public Commande getCommandeById(Long id) {
        return commandeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Commande non trouvée avec id: " + id));
    }
    
    // Historique par client
    @Transactional(readOnly = true)
    public List<Commande> getHistoriqueClient(Long clientId) {
        return commandeRepository.findByClientIdOrderByDateDesc(clientId);
    }
    
    // DELETE
    public void deleteCommande(Long id) {
        Commande commande = getCommandeById(id);
        
        if (commande.getStatut() != StatutCommande.EN_ATTENTE) {
            throw new IllegalStateException("Seules les commandes en attente peuvent être supprimées");
        }
        
        commandeRepository.delete(commande);
    }
}