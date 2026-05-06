package com.example.gestioncommandes1.repository;

import com.example.gestioncommandes1.entity.Transporteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransporteurRepository extends JpaRepository<Transporteur, Long> {
    
    // Transporteurs triés par note (meilleurs d'abord)
    List<Transporteur> findAllByOrderByNoteDesc();
}