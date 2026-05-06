package com.example.gestioncommandes1.controller;

import com.example.gestioncommandes1.entity.Transporteur;
import com.example.gestioncommandes1.service.TransporteurService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transporteurs")
@RequiredArgsConstructor
@Tag(name = "Transporteurs", description = "Gestion des transporteurs")
@CrossOrigin(origins = "*")
public class TransporteurController {
    
    private final TransporteurService transporteurService;
    
    // CREATE
    @PostMapping
    @Operation(summary = "Créer un transporteur")
    public ResponseEntity<Transporteur> creerTransporteur(@RequestBody Transporteur transporteur) {
        Transporteur nouveau = transporteurService.creerTransporteur(transporteur);
        return new ResponseEntity<>(nouveau, HttpStatus.CREATED);
    }
    
    // GET ALL
    @GetMapping
    @Operation(summary = "Liste tous les transporteurs")
    public ResponseEntity<List<Transporteur>> getAllTransporteurs() {
        return ResponseEntity.ok(transporteurService.getAllTransporteurs());
    }
    
    // GET ONE
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un transporteur par ID")
    public ResponseEntity<Transporteur> getTransporteurById(@PathVariable Long id) {
        return ResponseEntity.ok(transporteurService.getTransporteurById(id));
    }
    // Update
    @PutMapping("/{id}")
    @Operation(summary = "Modifier un transporteur")
    public ResponseEntity<Transporteur> updateTransporteur(@PathVariable Long id, @RequestBody Transporteur transporteur) {
        return ResponseEntity.ok(transporteurService.updateTransporteur(id, transporteur));
    }
    
    // DELETE
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un transporteur")
    public ResponseEntity<Void> deleteTransporteur(@PathVariable Long id) {
        transporteurService.deleteTransporteur(id);
        return ResponseEntity.noContent().build();
    }
}