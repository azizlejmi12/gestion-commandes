package com.example.gestioncommandes1.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.gestioncommandes1.dto.LivraisonDTO;
import com.example.gestioncommandes1.mapper.LivraisonMapper;
import com.example.gestioncommandes1.service.LivraisonService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/livraisons")
@CrossOrigin(origins = "*")
@Tag(name = "Livraisons", description = "Suivi des livraisons")
public class LivraisonController {

    @Autowired
    private LivraisonService livraisonService;

    @Autowired
    private LivraisonMapper livraisonMapper;

    // CREATE
    @PostMapping("/commande/{commandeId}")
    @Operation(summary = "Créer une livraison pour une commande")
    public LivraisonDTO creerLivraison(
            @PathVariable Long commandeId,
            @RequestParam(required = false) Long transporteurId,
            @RequestParam Double cout) {
        return livraisonMapper.toDto(livraisonService.creerLivraison(commandeId, transporteurId, cout));
    }

    // EXPEDIER
    @PutMapping("/{id}/expedier")
    @Operation(summary = "Marquer la livraison comme expédiée")
    public ResponseEntity<String> expedier(@PathVariable Long id) {
        return livraisonService.expedier(id);
    }

    // LIVRER
    @PutMapping("/{id}/livrer")
    @Operation(summary = "Marquer la livraison comme livrée")
    public ResponseEntity<String> livrer(@PathVariable Long id) {
        return livraisonService.livrer(id);
    }

    // GET ALL
    @GetMapping
    @Operation(summary = "Liste toutes les livraisons")
    public List<LivraisonDTO> getAllLivraisons() {
        return livraisonMapper.toListDto(livraisonService.getAllLivraisons());
    }

    // GET ONE
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une livraison par ID")
    public LivraisonDTO getLivraisonById(@PathVariable Long id) {
        return livraisonMapper.toDto(livraisonService.getLivraisonById(id));
    }

    // GET PAR COMMANDE
    @GetMapping("/commande/{commandeId}")
    @Operation(summary = "Suivre la livraison d'une commande")
    public LivraisonDTO getLivraisonByCommande(@PathVariable Long commandeId) {
        return livraisonMapper.toDto(livraisonService.getLivraisonByCommande(commandeId));
    }
}