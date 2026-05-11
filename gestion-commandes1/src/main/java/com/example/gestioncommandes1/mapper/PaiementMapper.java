package com.example.gestioncommandes1.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.gestioncommandes1.dto.PaiementDTO;
import com.example.gestioncommandes1.entity.Paiement;

@Component
public class PaiementMapper {

    @Autowired
    private ModelMapper modelMapper;

    public PaiementDTO toDto(Paiement paiement) {
        PaiementDTO dto = modelMapper.map(paiement, PaiementDTO.class);
        dto.setCommandeId(paiement.getCommande().getId());
        return dto;
    }

    public Paiement fromDto(PaiementDTO dto) {
        return modelMapper.map(dto, Paiement.class);
    }

    public List<PaiementDTO> toListDto(List<Paiement> paiements) {
        return paiements.stream()
                .map(p -> toDto(p))
                .collect(Collectors.toList());
    }
}