package com.example.gestioncommandes1.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.gestioncommandes1.dto.ClientDTO;
import com.example.gestioncommandes1.entity.Client;
import com.example.gestioncommandes1.mapper.ClientMapper;
import com.example.gestioncommandes1.service.ClientService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
@Tag(name = "Clients", description = "Gestion des clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private ClientMapper clientMapper;

    // CREATE
    @PostMapping
    @Operation(summary = "Créer un client")
    public ClientDTO creerClient(@RequestBody Client client) {
        return clientMapper.toDto(clientService.creerClient(client));
    }

    // GET ALL
    @GetMapping
    @Operation(summary = "Liste tous les clients")
    public List<ClientDTO> getAllClients() {
        return clientMapper.toListDto(clientService.getAllClients());
    }

    // GET ONE
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un client par ID")
    public ClientDTO getClientById(@PathVariable Long id) {
        return clientMapper.toDto(clientService.getClientById(id));
    }

    // UPDATE
    @PutMapping("/{id}")
    @Operation(summary = "Modifier un client")
    public ResponseEntity<String> updateClient(@PathVariable Long id, @RequestBody Client client) {
        return clientService.updateClient(id, client);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un client")
    public void deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
    }
}