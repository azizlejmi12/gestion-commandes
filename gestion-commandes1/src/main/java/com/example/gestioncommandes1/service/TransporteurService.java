package com.example.gestioncommandes1.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.gestioncommandes1.entity.Transporteur;
import com.example.gestioncommandes1.repository.TransporteurRepository;

@Service
public class TransporteurService {

    @Autowired
    private TransporteurRepository transREP;

    // CREATE
    public Transporteur creerTransporteur(Transporteur transporteur) {
        return transREP.save(transporteur);
    }

    // GET ALL
    public List<Transporteur> getAllTransporteurs() {
        return transREP.findAll();
    }

    // GET ONE
    public Transporteur getTransporteurById(Long id) {
        return transREP.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transporteur non trouvé")
        );
    }

    // UPDATE
    public ResponseEntity<String> updateTransporteur(Long id, Transporteur transporteurDetails) {
        transREP.findById(id).ifPresentOrElse(
            transporteur -> {
                transporteur.setNom(transporteurDetails.getNom());
                transporteur.setTelephone(transporteurDetails.getTelephone());
                transporteur.setNote(transporteurDetails.getNote());
                transREP.save(transporteur);
            },
            () -> {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Transporteur non trouvé");
            }
        );
        return ResponseEntity.ok("Transporteur mis à jour avec succès");
    }

    // DELETE
    public void deleteTransporteur(Long id) {
        transREP.deleteById(id);
    }
}