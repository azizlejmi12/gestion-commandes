package com.example.gestioncommandes1.controller;

import com.example.gestioncommandes1.entity.Paiement;
import com.example.gestioncommandes1.service.PaiementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paiements")
@RequiredArgsConstructor
@Tag(name = "Paiements", description = "Gestion des paiements en ligne")
@CrossOrigin(origins = "*")
public class PaiementController {
    
    private final PaiementService paiementService;
    
    // Créer un paiement
    @PostMapping("/commande/{commandeId}")
    @Operation(summary = "Créer un paiement pour une commande")
    public ResponseEntity<Paiement> creerPaiement(
            @PathVariable Long commandeId,
            @RequestParam String mode) {
        Paiement paiement = paiementService.creerPaiement(commandeId, mode);
        return new ResponseEntity<>(paiement, HttpStatus.CREATED);
    }
    
    // Traiter le paiement (simulation)
    @PostMapping("/{id}/traiter")
    @Operation(summary = "Traiter le paiement (simulation)")
    public ResponseEntity<Paiement> traiterPaiement(@PathVariable Long id) {
        return ResponseEntity.ok(paiementService.traiterPaiement(id));
    }
    
    // Rembourser
    @PostMapping("/{id}/rembourser")
    @Operation(summary = "Rembourser un paiement")
    public ResponseEntity<Paiement> rembourser(@PathVariable Long id) {
        return ResponseEntity.ok(paiementService.rembourser(id));
    }
    
    // GET by ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un paiement par ID")
    public ResponseEntity<Paiement> getPaiementById(@PathVariable Long id) {
        return ResponseEntity.ok(paiementService.getPaiementById(id));
    }
    
    // GET by Commande
    @GetMapping("/commande/{commandeId}")
    @Operation(summary = "Obtenir le paiement d'une commande")
    public ResponseEntity<Paiement> getPaiementByCommande(@PathVariable Long commandeId) {
        return ResponseEntity.ok(paiementService.getPaiementByCommande(commandeId));
    }
    
    @GetMapping
    @Operation(summary = "Liste tous les paiements")
    public ResponseEntity<List<Paiement>> getAllPaiements() {
        return ResponseEntity.ok(paiementService.getAllPaiements());
    }
    
}