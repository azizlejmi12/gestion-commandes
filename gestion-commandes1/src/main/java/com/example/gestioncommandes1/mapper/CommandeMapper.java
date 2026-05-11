package com.example.gestioncommandes1.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.gestioncommandes1.dto.CommandeDTO;
import com.example.gestioncommandes1.entity.Commande;

@Component
public class CommandeMapper {

    @Autowired
    private ModelMapper modelMapper;

    public CommandeDTO toDto(Commande commande) {
        CommandeDTO dto = modelMapper.map(commande, CommandeDTO.class);
        dto.setClientId(commande.getClient().getId());
        dto.setClientNom(commande.getClient().getNom());
        return dto;
    }

    public Commande fromDto(CommandeDTO dto) {
        return modelMapper.map(dto, Commande.class);
    }

    public List<CommandeDTO> toListDto(List<Commande> commandes) {
        return commandes.stream()
                .map(c -> toDto(c))
                .collect(Collectors.toList());
    }
}