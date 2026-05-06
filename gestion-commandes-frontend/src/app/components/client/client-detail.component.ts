import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { CommandeService } from '../../services/commande.service';
import { Client } from '../../models/client.model';
import { Commande } from '../../models/commande.model';
import { StatutCommande } from '../../models/statut-commande.enum';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Détail du Client</h2>
      
      <button class="btn btn-secondary mb-3" routerLink="/clients">
        ← Retour aux clients
      </button>

      <!-- Carte infos client -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h4>Informations</h4>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <p><strong>ID:</strong> {{ client.id }}</p>
              <p><strong>Nom:</strong> {{ client.nom }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Email:</strong> {{ client.email }}</p>
              <p><strong>Adresse:</strong> {{ client.adresse }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Résumé commandes -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card text-center bg-info text-white">
            <div class="card-body">
              <h3>{{ commandes.length }}</h3>
              <p>Commandes totales</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center bg-success text-white">
            <div class="card-body">
              <h3>{{ getTotalDepense() | currency:'EUR' }}</h3>
              <p>Total dépensé</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center bg-warning text-dark">
            <div class="card-body">
              <h3>{{ getCommandesEnAttente() }}</h3>
              <p>Commandes en attente</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des commandes -->
      <h4>Historique des Commandes</h4>
      <table class="table table-striped" *ngIf="commandes.length > 0">
        <thead>
          <tr>
            <th>N°</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Montant</th>
            <th>Articles</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let cmd of commandes">
            <td>#{{ cmd.id }}</td>
            <td>{{ cmd.date | date:'dd/MM/yyyy' }}</td>
            <td>
              <span class="badge" [ngClass]="getStatutClass(cmd.statut)">
                {{ cmd.statut }}
              </span>
            </td>
            <td>{{ cmd.montantTotal | currency:'EUR' }}</td>
            <td>{{ cmd.lignesCommande.length }}</td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="commandes.length === 0" class="alert alert-info">
        Aucune commande pour ce client.
      </div>

      <!-- Boutons action -->
      <div class="mt-3">
        <button class="btn btn-warning" [routerLink]="['/clients', client.id, 'edit']">
          ✏️ Modifier
        </button>
        <button class="btn btn-primary ms-2" [routerLink]="['/clients', client.id, 'historique']">
          📋 Voir historique complet
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .card { margin-bottom: 15px; }
    .badge { padding: 5px 10px; }
    .bg-warning { background-color: #ffc107; color: #000; }
    .bg-info { background-color: #17a2b8; color: #fff; }
    .bg-primary { background-color: #007bff; color: #fff; }
    .bg-success { background-color: #28a745; color: #fff; }
    .bg-secondary { background-color: #6c757d; color: #fff; }
  `]
})
export class ClientDetailComponent implements OnInit {
  client: Client = { id: 0, nom: '', email: '', adresse: '' };
  commandes: Commande[] = [];

  constructor(
    private clientService: ClientService,
    private commandeService: CommandeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Charger le client
    this.clientService.getClientById(id).subscribe({
      next: (data) => this.client = data,
      error: (err) => {
        console.error('Erreur chargement client:', err);
        alert('Client non trouvé');
      }
    });

    // Charger ses commandes
    this.commandeService.getHistoriqueClient(id).subscribe({
      next: (data) => this.commandes = data,
      error: (err) => console.error('Erreur chargement commandes:', err)
    });
  }

  getTotalDepense(): number {
    return this.commandes.reduce((total, cmd) => total + (cmd.montantTotal || 0), 0);
  }

  getCommandesEnAttente(): number {
    return this.commandes.filter(cmd => cmd.statut === StatutCommande.EN_ATTENTE).length;
  }

  getStatutClass(statut: StatutCommande | string): string {
    switch(statut) {
      case 'EN_ATTENTE': return 'badge bg-warning';
      case 'VALIDEE': return 'badge bg-info';
      case 'EN_COURS_DE_TRAITEMENT': return 'badge bg-primary';
      case 'EXPEDIEE': return 'badge bg-secondary';
      case 'LIVREE': return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  }
}