package com.example.gestioncommandes1.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.gestioncommandes1.dto.CommandeDTO;
import com.example.gestioncommandes1.entity.Commande;
import com.example.gestioncommandes1.entity.LigneCommande;
import com.example.gestioncommandes1.mapper.CommandeMapper;
import com.example.gestioncommandes1.service.CommandeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/commandes")
@CrossOrigin(origins = "*")
@Tag(name = "Commandes", description = "Gestion des commandes")
public class CommandeController {

    @Autowired
    private CommandeService commandeService;

    @Autowired
    private CommandeMapper commandeMapper;

    // CREATE
    @PostMapping("/client/{clientId}")
    @Operation(summary = "Créer une commande pour un client")
    public CommandeDTO creerCommande(@PathVariable Long clientId, @RequestBody List<LigneCommande> lignes) {
        return commandeMapper.toDto(commandeService.creerCommande(clientId, lignes));
    }

    // VALIDER
    @PutMapping("/{id}/valider")
    @Operation(summary = "Valider une commande")
    public ResponseEntity<String> validerCommande(@PathVariable Long id) {
        return commandeService.validerCommande(id);
    }

    // GET ALL
    @GetMapping
    @Operation(summary = "Liste toutes les commandes")
    public List<CommandeDTO> getAllCommandes() {
        return commandeMapper.toListDto(commandeService.getAllCommandes());
    }

    // GET ONE
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une commande par ID")
    public CommandeDTO getCommandeById(@PathVariable Long id) {
        return commandeMapper.toDto(commandeService.getCommandeById(id));
    }

    // HISTORIQUE CLIENT
    @GetMapping("/client/{clientId}/historique")
    @Operation(summary = "Historique des commandes d'un client")
    public List<CommandeDTO> getHistoriqueClient(@PathVariable Long clientId) {
        return commandeMapper.toListDto(commandeService.getHistoriqueClient(clientId));
    }

    // UPDATE
    @PutMapping("/{id}")
    @Operation(summary = "Modifier une commande")
    public ResponseEntity<String> updateCommande(@PathVariable Long id, @RequestBody Commande commande) {
        return commandeService.updateCommande(id, commande);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une commande")
    public void deleteCommande(@PathVariable Long id) {
        commandeService.deleteCommande(id);
    }
}