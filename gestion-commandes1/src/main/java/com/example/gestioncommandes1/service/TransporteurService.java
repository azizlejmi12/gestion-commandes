package com.example.gestioncommandes1.service;

import com.example.gestioncommandes1.entity.Transporteur;
import com.example.gestioncommandes1.repository.TransporteurRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TransporteurService {
    
    private final TransporteurRepository transporteurRepository;
    
    public Transporteur creerTransporteur(Transporteur transporteur) {
        return transporteurRepository.save(transporteur);
    }
    
    @Transactional(readOnly = true)
    public List<Transporteur> getAllTransporteurs() {
        return transporteurRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Transporteur getTransporteurById(Long id) {
        return transporteurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transporteur non trouvé"));
    }
    public Transporteur updateTransporteur(Long id, Transporteur transporteurDetails) {
        Transporteur transporteur = getTransporteurById(id);
        transporteur.setNom(transporteurDetails.getNom());
        transporteur.setTelephone(transporteurDetails.getTelephone());
        transporteur.setNote(transporteurDetails.getNote());
        return transporteurRepository.save(transporteur);
    }
    
    public void deleteTransporteur(Long id) {
        transporteurRepository.deleteById(id);
    }
}