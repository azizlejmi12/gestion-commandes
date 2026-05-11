import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { Commande } from '../../models/commande.model';
import { StatutCommande } from '../../models/statut-commande.enum';

@Component({
  selector: 'app-commande-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Détail de la Commande</h2>
      
      <button class="btn btn-secondary mb-3" routerLink="/commandes">
        ← Retour aux commandes
      </button>

      <!-- Carte infos commande -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h4>Commande #{{ commande.id }}</h4>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <p><strong>Client:</strong> {{ commande.clientNom }}</p>
              <p><strong>Date:</strong> {{ commande.date | date:'dd/MM/yyyy HH:mm' }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Statut:</strong> <span class="badge" [ngClass]="getStatutClass(commande.statut)">{{ commande.statut }}</span></p>
              <p><strong>Montant Total:</strong> <strong class="text-success">{{ commande.montantTotal | currency:'EUR' }}</strong></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lignes de commande -->
      <h4>Détail des Articles ({{ commande.lignesCommande.length }})</h4>
      <table class="table table-striped" *ngIf="commande.lignesCommande.length > 0">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix Unitaire</th>
            <th>Sous-total</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let ligne of commande.lignesCommande">
            <td>{{ ligne.produit }}</td>
            <td>{{ ligne.quantite }}</td>
            <td>{{ ligne.prixUnitaire | currency:'EUR' }}</td>
            <td>{{ (ligne.quantite * ligne.prixUnitaire) | currency:'EUR' }}</td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="commande.lignesCommande.length === 0" class="alert alert-warning">
        Aucun article dans cette commande.
      </div>

      <!-- Boutons action -->
      <div class="mt-3">
        <button class="btn btn-warning" [routerLink]="['/commandes', commande.id, 'edit']" 
                *ngIf="commande.statut === 'EN_ATTENTE'">
          ✏️ Modifier
        </button>
        <button class="btn btn-info ms-2" routerLink="/commandes">
          📋 Retour à la liste
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .card { margin-bottom: 15px; }
    .badge { padding: 5px 10px; }
    .text-success { color: #28a745; }
  `]
})
export class CommandeDetailComponent implements OnInit {
  commande: Commande = {
    id: 0,
    clientId: 0,
    clientNom: '',
    date: '',
    statut: StatutCommande.EN_ATTENTE,
    montantTotal: 0,
    lignesCommande: []
  };

  constructor(
    private commandeService: CommandeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.commandeService.getCommandeById(id).subscribe({
      next: (data) => this.commande = data,
      error: (err) => {
        console.error('Erreur chargement commande:', err);
        alert('Commande non trouvée');
      }
    });
  }

  getStatutClass(statut: StatutCommande | string): string {
    switch(statut) {
      case 'EN_ATTENTE': return 'badge bg-warning text-dark';
      case 'VALIDEE': return 'badge bg-info';
      case 'EN_COURS_DE_TRAITEMENT': return 'badge bg-primary';
      case 'EXPEDIEE': return 'badge bg-secondary';
      case 'LIVREE': return 'badge bg-success';
      case 'ANNULEE': return 'badge bg-danger';
      case 'RETOURNEE': return 'badge bg-dark';
      default: return 'badge bg-secondary';
    }
  }
}
