package com.example.gestioncommandes1.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.gestioncommandes1.dto.LivraisonDTO;
import com.example.gestioncommandes1.entity.Livraison;

@Component
public class LivraisonMapper {

    @Autowired
    private ModelMapper modelMapper;

    public LivraisonDTO toDto(Livraison livraison) {
        LivraisonDTO dto = modelMapper.map(livraison, LivraisonDTO.class);
        dto.setCommandeId(livraison.getCommande().getId());
        if (livraison.getTransporteur() != null) {
            dto.setTransporteurId(livraison.getTransporteur().getId());
            dto.setTransporteurNom(livraison.getTransporteur().getNom());
        }
        return dto;
    }

    public Livraison fromDto(LivraisonDTO dto) {
        return modelMapper.map(dto, Livraison.class);
    }

    public List<LivraisonDTO> toListDto(List<Livraison> livraisons) {
        return livraisons.stream()
                .map(l -> toDto(l))
                .collect(Collectors.toList());
    }
}