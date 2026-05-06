package com.example.gestioncommandes1.controller;

import com.example.gestioncommandes1.entity.Commande;
import com.example.gestioncommandes1.entity.LigneCommande;
import com.example.gestioncommandes1.service.CommandeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commandes")
@RequiredArgsConstructor
@Tag(name = "Commandes", description = "Gestion des commandes")
@CrossOrigin(origins = "*")
public class CommandeController {
    
    private final CommandeService commandeService;
    
    // Créer une commande avec ses lignes
    @PostMapping("/client/{clientId}")
    @Operation(summary = "Créer une commande pour un client")
    public ResponseEntity<Commande> creerCommande(
            @PathVariable Long clientId,
            @RequestBody List<LigneCommande> lignes) {
        Commande commande = commandeService.creerCommande(clientId, lignes);
        return new ResponseEntity<>(commande, HttpStatus.CREATED);
    }
    
    // Valider une commande
    @PutMapping("/{id}/valider")
    @Operation(summary = "Valider une commande")
    public ResponseEntity<Commande> validerCommande(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.validerCommande(id));
    }
    
    // GET ALL
    @GetMapping
    @Operation(summary = "Liste toutes les commandes")
    public ResponseEntity<List<Commande>> getAllCommandes() {
        return ResponseEntity.ok(commandeService.getAllCommandes());
    }
    
    // GET ONE
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une commande par ID")
    public ResponseEntity<Commande> getCommandeById(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.getCommandeById(id));
    }
    
    // Historique client
    @GetMapping("/client/{clientId}/historique")
    @Operation(summary = "Historique des commandes d'un client")
    public ResponseEntity<List<Commande>> getHistoriqueClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(commandeService.getHistoriqueClient(clientId));
    }
 // UPDATE
    @PutMapping("/{id}")
    @Operation(summary = "Modifier une commande")
    public ResponseEntity<Commande> updateCommande(
            @PathVariable Long id,
            @RequestBody Commande commande) {
        return ResponseEntity.ok(commandeService.updateCommande(id, commande));
    }
   
 // DELETE
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une commande")
    public ResponseEntity<Void> deleteCommande(@PathVariable Long id) {
        commandeService.deleteCommande(id);
        return ResponseEntity.noContent().build();
    }
}