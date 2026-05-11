package com.example.gestioncommandes1.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.gestioncommandes1.entity.Paiement;
import com.example.gestioncommandes1.service.PaiementService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/paiements")
@CrossOrigin(origins = "*")
@Tag(name = "Paiements", description = "Gestion des paiements")
public class PaiementController {

    @Autowired
    private PaiementService paiementService;

    // CREATE
    @PostMapping("/commande/{commandeId}")
    @Operation(summary = "Créer un paiement pour une commande")
    public Paiement creerPaiement(
            @PathVariable Long commandeId,
            @RequestParam String mode) {
        return paiementService.creerPaiement(commandeId, mode);
    }

    // TRAITER
    @PostMapping("/{id}/traiter")
    @Operation(summary = "Traiter le paiement")
    public ResponseEntity<String> traiterPaiement(@PathVariable Long id) {
        return paiementService.traiterPaiement(id);
    }

    // REMBOURSER
    @PostMapping("/{id}/rembourser")
    @Operation(summary = "Rembourser un paiement")
    public ResponseEntity<String> rembourser(@PathVariable Long id) {
        return paiementService.rembourser(id);
    }

    // GET ALL
    @GetMapping
    @Operation(summary = "Liste tous les paiements")
    public List<Paiement> getAllPaiements() {
        return paiementService.getAllPaiements();
    }

    // GET ONE
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un paiement par ID")
    public Paiement getPaiementById(@PathVariable Long id) {
        return paiementService.getPaiementById(id);
    }

    // GET PAR COMMANDE
    @GetMapping("/commande/{commandeId}")
    @Operation(summary = "Obtenir le paiement d'une commande")
    public Paiement getPaiementByCommande(@PathVariable Long commandeId) {
        return paiementService.getPaiementByCommande(commandeId);
    }
}