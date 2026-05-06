package com.example.gestioncommandes1.controller;

import com.example.gestioncommandes1.entity.Livraison;
import com.example.gestioncommandes1.service.LivraisonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/livraisons")
@RequiredArgsConstructor
@Tag(name = "Livraisons", description = "Suivi des livraisons")
@CrossOrigin(origins = "*")
public class LivraisonController {
    
    private final LivraisonService livraisonService;
    
    // Créer une livraison
    @PostMapping("/commande/{commandeId}")
    @Operation(summary = "Créer une livraison pour une commande")
    public ResponseEntity<Livraison> creerLivraison(
            @PathVariable Long commandeId,
            @RequestParam(required = false) Long transporteurId,
            @RequestParam Double cout) {
        Livraison livraison = livraisonService.creerLivraison(commandeId, transporteurId, cout);
        return new ResponseEntity<>(livraison, HttpStatus.CREATED);
    }
    
    // Marquer comme expédiée
    @PutMapping("/{id}/expedier")
    @Operation(summary = "Marquer la livraison comme expédiée")
    public ResponseEntity<Livraison> expedier(@PathVariable Long id) {
        return ResponseEntity.ok(livraisonService.expedier(id));
    }
    
    // Marquer comme livrée
    @PutMapping("/{id}/livrer")
    @Operation(summary = "Marquer la livraison comme livrée")
    public ResponseEntity<Livraison> livrer(@PathVariable Long id) {
        return ResponseEntity.ok(livraisonService.livrer(id));
    }
    
    // GET ALL
    @GetMapping
    @Operation(summary = "Liste toutes les livraisons")
    public ResponseEntity<List<Livraison>> getAllLivraisons() {
        return ResponseEntity.ok(livraisonService.getAllLivraisons());
    }
    
    // GET ONE
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une livraison par ID")
    public ResponseEntity<Livraison> getLivraisonById(@PathVariable Long id) {
        return ResponseEntity.ok(livraisonService.getLivraisonById(id));
    }
    
    // Suivi par commande
    @GetMapping("/commande/{commandeId}")
    @Operation(summary = "Suivre la livraison d'une commande")
    public ResponseEntity<Livraison> getLivraisonByCommande(@PathVariable Long commandeId) {
        return ResponseEntity.ok(livraisonService.getLivraisonByCommande(commandeId));
    }
}