package com.example.gestioncommandes1.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.gestioncommandes1.dto.TransporteurDTO;
import com.example.gestioncommandes1.entity.Transporteur;

@Component
public class TransporteurMapper {

    @Autowired
    private ModelMapper modelMapper;

    public TransporteurDTO toDto(Transporteur transporteur) {
        return modelMapper.map(transporteur, TransporteurDTO.class);
    }

    public Transporteur fromDto(TransporteurDTO dto) {
        return modelMapper.map(dto, Transporteur.class);
    }

    public List<TransporteurDTO> toListDto(List<Transporteur> transporteurs) {
        return transporteurs.stream()
                .map(t -> modelMapper.map(t, TransporteurDTO.class))
                .collect(Collectors.toList());
    }
}