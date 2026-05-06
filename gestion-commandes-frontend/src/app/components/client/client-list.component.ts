import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Liste des Clients</h2>
      
      <button [routerLink]="['/clients/new']" class="btn btn-primary mb-3">
        + Nouveau Client
      </button>

      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Adresse</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let client of clients">
            <td>{{ client.id }}</td>
            <td>{{ client.nom }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.adresse }}</td>
            <td>
              <button class="btn btn-sm btn-info" [routerLink]="['/clients', client.id]">
                  👁️ Voir
              </button>
              <button class="btn btn-sm btn-warning" [routerLink]="['/clients', client.id, 'edit']">
                Modifier
              </button>
              <button class="btn btn-sm btn-danger" (click)="deleteClient(client.id!)">
                Supprimer
              </button>
               <button class="btn btn-sm btn-primary" [routerLink]="['/clients', client.id, 'historique']">
              📋 Historique
            </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .btn { margin-right: 5px; }
    table { margin-top: 20px; }
  `]
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Erreur chargement clients:', err)
    });
  }

  deleteClient(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => this.loadClients(),
        error: (err) => console.error('Erreur suppression:', err)
      });
    }
  }
}