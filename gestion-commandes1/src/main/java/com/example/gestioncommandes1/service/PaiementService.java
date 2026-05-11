package com.example.gestioncommandes1.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.gestioncommandes1.entity.Commande;
import com.example.gestioncommandes1.entity.Paiement;
import com.example.gestioncommandes1.entity.StatutCommande;
import com.example.gestioncommandes1.entity.StatutPaiement;
import com.example.gestioncommandes1.repository.CommandeRepository;
import com.example.gestioncommandes1.repository.PaiementRepository;

@Service
public class PaiementService {

    @Autowired
    private PaiementRepository paiREP;

    @Autowired
    private CommandeRepository cmdREP;

    // CREATE
    public Paiement creerPaiement(Long commandeId, String mode) {
        Commande commande = cmdREP.findById(commandeId).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Commande non trouvée")
        );

        Paiement paiement = new Paiement();
        paiement.setCommande(commande);
        paiement.setMode(mode);
        paiement.setStatut(StatutPaiement.EN_ATTENTE);

        return paiREP.save(paiement);
    }

    // TRAITER
    public ResponseEntity<String> traiterPaiement(Long id) {
        paiREP.findById(id).ifPresentOrElse(
            paiement -> {
                boolean succes = Math.random() > 0.1;
                if (succes) {
                    paiement.setStatut(StatutPaiement.PAYE);
                    Commande commande = paiement.getCommande();
                    commande.setStatut(StatutCommande.EN_COURS_DE_TRAITEMENT);
                    cmdREP.save(commande);
                } else {
                    paiement.setStatut(StatutPaiement.REFUSE);
                }
                paiREP.save(paiement);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Paiement non trouvé");
            }
        );
        return ResponseEntity.ok("Paiement traité avec succès");
    }

    // REMBOURSER
    public ResponseEntity<String> rembourser(Long id) {
        paiREP.findById(id).ifPresentOrElse(
            paiement -> {
                paiement.setStatut(StatutPaiement.REMBOURSE);
                paiREP.save(paiement);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Paiement non trouvé");
            }
        );
        return ResponseEntity.ok("Paiement remboursé avec succès");
    }

    // GET ONE
    public Paiement getPaiementById(Long id) {
        return paiREP.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paiement non trouvé")
        );
    }

    // GET PAR COMMANDE
    public Paiement getPaiementByCommande(Long commandeId) {
        return paiREP.findByCommandeId(commandeId).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pas de paiement pour cette commande")
        );
    }

    // GET ALL
    public List<Paiement> getAllPaiements() {
        return paiREP.findAll();
    }
}