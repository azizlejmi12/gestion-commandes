package com.example.gestioncommandes1.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.gestioncommandes1.entity.Client;
import com.example.gestioncommandes1.entity.Commande;
import com.example.gestioncommandes1.entity.LigneCommande;
import com.example.gestioncommandes1.entity.StatutCommande;
import com.example.gestioncommandes1.repository.ClientRepository;
import com.example.gestioncommandes1.repository.CommandeRepository;
import com.example.gestioncommandes1.repository.LigneCommandeRepository;

@Service
public class CommandeService {

    @Autowired
    private CommandeRepository cmdREP;

    @Autowired
    private ClientRepository cREP;

    @Autowired
    private LigneCommandeRepository ligneREP;

    // CREATE
    public Commande creerCommande(Long clientId, List<LigneCommande> lignes) {
        Client client = cREP.findById(clientId).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client non trouvé")
        );

        Commande commande = new Commande();
        commande.setClient(client);
        commande.setStatut(StatutCommande.EN_ATTENTE);

        Commande savedCommande = cmdREP.save(commande);

        List<LigneCommande> lignesCommande = new ArrayList<>();
        double montantTotal = 0;

        for (LigneCommande ligne : lignes) {
            ligne.setCommande(savedCommande);
            LigneCommande savedLigne = ligneREP.save(ligne);
            lignesCommande.add(savedLigne);
            montantTotal += ligne.getSousTotal();
        }

        savedCommande.setLignesCommande(lignesCommande);
        savedCommande.setMontantTotal(montantTotal);

        return cmdREP.save(savedCommande);
    }

    // VALIDER
    public ResponseEntity<String> validerCommande(Long id) {
        cmdREP.findById(id).ifPresentOrElse(
            commande -> {
                commande.setStatut(StatutCommande.VALIDEE);
                cmdREP.save(commande);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Commande non trouvée");
            }
        );
        return ResponseEntity.ok("Commande validée avec succès");
    }

    // UPDATE
    public ResponseEntity<String> updateCommande(Long id, Commande commandeDetails) {
        cmdREP.findById(id).ifPresentOrElse(
            commande -> {
                commande.getLignesCommande().clear();
                double montantTotal = 0;
                for (LigneCommande ligne : commandeDetails.getLignesCommande()) {
                    ligne.setCommande(commande);
                    commande.getLignesCommande().add(ligne);
                    montantTotal += ligne.getSousTotal();
                }
                commande.setMontantTotal(montantTotal);
                cmdREP.save(commande);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Commande non trouvée");
            }
        );
        return ResponseEntity.ok("Commande mise à jour avec succès");
    }

    // GET ALL
    public List<Commande> getAllCommandes() {
        return cmdREP.findAll();
    }

    // GET ONE
    public Commande getCommandeById(Long id) {
        return cmdREP.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Commande non trouvée")
        );
    }

    // HISTORIQUE PAR CLIENT
    public List<Commande> getHistoriqueClient(Long clientId) {
        return cmdREP.findByClientIdOrderByDateDesc(clientId);
    }

    // DELETE
    public void deleteCommande(Long id) {
        cmdREP.deleteById(id);
    }
}