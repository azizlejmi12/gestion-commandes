package com.example.gestioncommandes1.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.gestioncommandes1.entity.Commande;
import com.example.gestioncommandes1.entity.Livraison;
import com.example.gestioncommandes1.entity.StatutCommande;
import com.example.gestioncommandes1.entity.StatutLivraison;
import com.example.gestioncommandes1.entity.Transporteur;
import com.example.gestioncommandes1.repository.CommandeRepository;
import com.example.gestioncommandes1.repository.LivraisonRepository;
import com.example.gestioncommandes1.repository.TransporteurRepository;

@Service
public class LivraisonService {

    @Autowired
    private LivraisonRepository livREP;

    @Autowired
    private CommandeRepository cmdREP;

    @Autowired
    private TransporteurRepository transREP;

    // CREATE
    public Livraison creerLivraison(Long commandeId, Long transporteurId, Double cout) {
        Commande commande = cmdREP.findById(commandeId).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Commande non trouvée")
        );

        Livraison livraison = new Livraison();
        livraison.setCommande(commande);
        livraison.setCout(cout);
        livraison.setStatut(StatutLivraison.EN_PREPARATION);

        if (transporteurId != null) {
            Transporteur transporteur = transREP.findById(transporteurId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transporteur non trouvé")
            );
            livraison.setTransporteur(transporteur);
        }

        return livREP.save(livraison);
    }

    // EXPEDIER
    public ResponseEntity<String> expedier(Long id) {
        livREP.findById(id).ifPresentOrElse(
            livraison -> {
                livraison.setStatut(StatutLivraison.EXPEDIEE);
                livREP.save(livraison);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Livraison non trouvée");
            }
        );
        return ResponseEntity.ok("Livraison expédiée avec succès");
    }

    // LIVRER
    public ResponseEntity<String> livrer(Long id) {
        livREP.findById(id).ifPresentOrElse(
            livraison -> {
                livraison.setStatut(StatutLivraison.LIVREE);
                livraison.setDateLivraison(LocalDateTime.now());
                Commande commande = livraison.getCommande();
                commande.setStatut(StatutCommande.LIVREE);
                cmdREP.save(commande);
                livREP.save(livraison);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Livraison non trouvée");
            }
        );
        return ResponseEntity.ok("Livraison livrée avec succès");
    }

    // GET ALL
    public List<Livraison> getAllLivraisons() {
        return livREP.findAll();
    }

    // GET ONE
    public Livraison getLivraisonById(Long id) {
        return livREP.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livraison non trouvée")
        );
    }

    // GET PAR COMMANDE
    public Livraison getLivraisonByCommande(Long commandeId) {
        return livREP.findByCommandeId(commandeId).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pas de livraison pour cette commande")
        );
    }
}