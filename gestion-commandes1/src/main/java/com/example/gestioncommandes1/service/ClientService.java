package com.example.gestioncommandes1.service;

import com.example.gestioncommandes1.entity.Client;
import com.example.gestioncommandes1.repository.ClientRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientService {
    
    private final ClientRepository clientRepository;
    
    // CREATE
    public Client creerClient(Client client) {
        if (clientRepository.existsByEmail(client.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }
        return clientRepository.save(client);
    }
    
    // READ ALL
    @Transactional(readOnly = true)
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }
    
    // READ ONE
    @Transactional(readOnly = true)
    public Client getClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client non trouvé avec id: " + id));
    }
    
    // UPDATE
    public Client updateClient(Long id, Client clientDetails) {
        Client client = getClientById(id);
        
        // Vérifier si le nouvel email n'est pas déjà pris par un autre client
        if (!client.getEmail().equals(clientDetails.getEmail()) 
                && clientRepository.existsByEmail(clientDetails.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }
        
        client.setNom(clientDetails.getNom());
        client.setEmail(clientDetails.getEmail());
        client.setAdresse(clientDetails.getAdresse());
        
        return clientRepository.save(client);
    }
    
    // DELETE
    public void deleteClient(Long id) {
        Client client = getClientById(id);
        clientRepository.delete(client);
    }
}