package com.example.gestioncommandes1.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.gestioncommandes1.dto.TransporteurDTO;
import com.example.gestioncommandes1.entity.Transporteur;
import com.example.gestioncommandes1.mapper.TransporteurMapper;
import com.example.gestioncommandes1.service.TransporteurService;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/transporteurs")
@CrossOrigin(origins = "*")
@Tag(name = "Transporteurs", description = "Gestion des transporteurs")
public class TransporteurController {

    @Autowired
    private TransporteurService transporteurService;

    @Autowired
    private TransporteurMapper transporteurMapper;

    // CREATE
    @PostMapping
    @Operation(summary = "Créer un transporteur")
    public TransporteurDTO creerTransporteur(@RequestBody Transporteur transporteur) {
    	return transporteurMapper.toDto(transporteurService.creerTransporteur(transporteur));
    }

    // GET ALL
    @GetMapping
    @Operation(summary = "Liste tous les transporteurs")
    public List<TransporteurDTO> getAllTransporteurs() {
        return transporteurMapper.toListDto(transporteurService.getAllTransporteurs());
    }

    // GET ONE
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un transporteur par ID")
    public TransporteurDTO getTransporteurById(@PathVariable Long id) {
        return transporteurMapper.toDto(transporteurService.getTransporteurById(id));
    }

    // UPDATE
    @PutMapping("/{id}")
    @Operation(summary = "Modifier un transporteur")
    public ResponseEntity<String> updateTransporteur(@PathVariable Long id, @RequestBody Transporteur transporteur) {
        return transporteurService.updateTransporteur(id, transporteur);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un transporteur")
    public void deleteTransporteur(@PathVariable Long id) {
        transporteurService.deleteTransporteur(id);
    }
}