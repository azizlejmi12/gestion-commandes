package com.example.gestioncommandes1.service;

import com.example.gestioncommandes1.entity.*;
import com.example.gestioncommandes1.repository.CommandeRepository;
import com.example.gestioncommandes1.repository.LivraisonRepository;
import com.example.gestioncommandes1.repository.TransporteurRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LivraisonService {
    
    private final LivraisonRepository livraisonRepository;
    private final CommandeRepository commandeRepository;
    private final TransporteurRepository transporteurRepository;
    
    /**
     * Créer une livraison pour une commande
     * RÈGLE MÉTIER : Le paiement doit être PAYE avant de créer une livraison
     */
    public Livraison creerLivraison(Long commandeId, Long transporteurId, Double cout) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new EntityNotFoundException("Commande non trouvée"));
        
        // 🔒 VÉRIFICATION 1 : La commande doit être au moins VALIDEE
        if (commande.getStatut() == StatutCommande.EN_ATTENTE) {
            throw new IllegalStateException("La commande doit être validée avant création de livraison");
        }
        
        // 🔒 VÉRIFICATION 2 : Paiement OBLIGATOIRE
        Paiement paiement = commande.getPaiement();
        if (paiement == null) {
            throw new IllegalStateException(
                "La commande n'a pas encore de paiement. " +
                "Veuillez effectuer le paiement avant de créer une livraison."
            );
        }
        
        // 🔒 VÉRIFICATION 3 : Le paiement doit être confirmé (PAYE)
        if (paiement.getStatut() != StatutPaiement.PAYE) {
            throw new IllegalStateException(
                "Le paiement n'est pas confirmé. Statut actuel: " + paiement.getStatut() + 
                ". Veuillez attendre la confirmation du paiement."
            );
        }
        
        // 🔒 VÉRIFICATION 4 : Pas de livraison existante
        if (commande.getLivraison() != null) {
            throw new IllegalStateException("Cette commande a déjà une livraison");
        }
        
        // ✅ Création de la livraison
        Livraison livraison = new Livraison();
        livraison.setCommande(commande);
        livraison.setCout(cout);
        livraison.setStatut(StatutLivraison.EN_PREPARATION);
        
        // Ajout du transporteur si fourni
        if (transporteurId != null) {
            Transporteur transporteur = transporteurRepository.findById(transporteurId)
                    .orElseThrow(() -> new EntityNotFoundException("Transporteur non trouvé"));
            livraison.setTransporteur(transporteur);
        }
        
        // Sauvegarde
        return livraisonRepository.save(livraison);
    }
    
    /**
     * Marquer une livraison comme expédiée
     */
    public Livraison expedier(Long livraisonId) {
        Livraison livraison = getLivraisonById(livraisonId);
        
        if (livraison.getStatut() != StatutLivraison.EN_PREPARATION) {
            throw new IllegalStateException(
                "La livraison doit être en préparation pour être expédiée. " +
                "Statut actuel: " + livraison.getStatut()
            );
        }
        
        livraison.setStatut(StatutLivraison.EXPEDIEE);
        return livraisonRepository.save(livraison);
    }
    
    /**
     * Marquer une livraison comme livrée
     * Met également à jour le statut de la commande
     */
    public Livraison livrer(Long livraisonId) {
        Livraison livraison = getLivraisonById(livraisonId);
        
        if (livraison.getStatut() != StatutLivraison.EXPEDIEE 
            && livraison.getStatut() != StatutLivraison.EN_TRANSIT) {
            throw new IllegalStateException(
                "La livraison doit être expédiée ou en transit avant d'être livrée. " +
                "Statut actuel: " + livraison.getStatut()
            );
        }
        
        // Met à jour la livraison
        livraison.setStatut(StatutLivraison.LIVREE);
        livraison.setDateLivraison(LocalDateTime.now());
        
        // Met à jour la commande associée
        Commande commande = livraison.getCommande();
        commande.setStatut(StatutCommande.LIVREE);
        commandeRepository.save(commande);
        
        return livraisonRepository.save(livraison);
    }
    
    // GET ALL
    @Transactional(readOnly = true)
    public List<Livraison> getAllLivraisons() {
        return livraisonRepository.findAll();
    }
    
    // GET ONE
    @Transactional(readOnly = true)
    public Livraison getLivraisonById(Long id) {
        return livraisonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livraison non trouvée avec id: " + id));
    }
    
    // Suivi par commande
    @Transactional(readOnly = true)
    public Livraison getLivraisonByCommande(Long commandeId) {
        return livraisonRepository.findByCommandeId(commandeId)
                .orElseThrow(() -> new EntityNotFoundException("Pas de livraison pour cette commande"));
    }
}