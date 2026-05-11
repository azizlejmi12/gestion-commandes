package com.example.gestioncommandes1.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.gestioncommandes1.entity.Client;
import com.example.gestioncommandes1.repository.ClientRepository;

@Service
public class ClientService {

    @Autowired
    private ClientRepository cREP;

    // CREATE
    public Client creerClient(Client client) {
        return cREP.save(client);
    }

    // READ ALL
    public List<Client> getAllClients() {
        return cREP.findAll();
    }

    // READ ONE
    public Client getClientById(Long id) {
        return cREP.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client non trouvé")
        );
    }

    // UPDATE
    public ResponseEntity<String> updateClient(Long id, Client clientDetails) {
        cREP.findById(id).ifPresentOrElse(
            client -> {
                client.setNom(clientDetails.getNom());
                client.setEmail(clientDetails.getEmail());
                client.setAdresse(clientDetails.getAdresse());
                cREP.save(client);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Client non trouvé");
            }
        );
        return ResponseEntity.ok("Client mis à jour avec succès");
    }

    // DELETE
    public void deleteClient(Long id) {
        cREP.deleteById(id);
    }
}