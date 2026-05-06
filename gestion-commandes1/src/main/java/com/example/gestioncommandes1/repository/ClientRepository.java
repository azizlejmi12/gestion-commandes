package com.example.gestioncommandes1.repository;

import com.example.gestioncommandes1.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    // Trouver un client par email
    Optional<Client> findByEmail(String email);
    
    // Vérifier si un email existe déjà
    boolean existsByEmail(String email);
}