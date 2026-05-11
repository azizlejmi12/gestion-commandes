package com.example.gestioncommandes1.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.gestioncommandes1.dto.ClientDTO;
import com.example.gestioncommandes1.entity.Client;

@Component
public class ClientMapper {

    @Autowired
    private ModelMapper modelMapper;

    public ClientDTO toDto(Client client) {
        return modelMapper.map(client, ClientDTO.class);
    }

    public Client fromDto(ClientDTO dto) {
        return modelMapper.map(dto, Client.class);
    }

    public List<ClientDTO> toListDto(List<Client> clients) {
        return clients.stream()
                .map(c -> modelMapper.map(c, ClientDTO.class))
                .collect(Collectors.toList());
    }
}