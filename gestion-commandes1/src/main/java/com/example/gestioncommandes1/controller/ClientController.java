package com.example.gestioncommandes1.controller;

import com.example.gestioncommandes1.entity.Client;
import com.example.gestioncommandes1.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@Tag(name = "Clients", description = "Gestion des clients")
@CrossOrigin(origins = "*")  // Pour Angular
public class ClientController {
    
    private final ClientService clientService;
    
    // CREATE
    @PostMapping
    @Operation(summary = "Créer un client")
    public ResponseEntity<Client> creerClient(@Valid @RequestBody Client client) {
        Client nouveauClient = clientService.creerClient(client);
        return new ResponseEntity<>(nouveauClient, HttpStatus.CREATED);
    }
    
    // READ ALL
    @GetMapping
    @Operation(summary = "Liste tous les clients")
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }
    
    // READ ONE
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un client par ID")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }
    
    // UPDATE
    @PutMapping("/{id}")
    @Operation(summary = "Modifier un client")
    public ResponseEntity<Client> updateClient(
            @PathVariable Long id,
            @Valid @RequestBody Client client) {
        return ResponseEntity.ok(clientService.updateClient(id, client));
    }
    
    // DELETE
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un client")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}