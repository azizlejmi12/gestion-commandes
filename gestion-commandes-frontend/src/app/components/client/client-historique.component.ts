import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { Commande } from '../../models/commande.model';
import { StatutCommande } from '../../models/statut-commande.enum';

@Component({
  selector: 'app-client-historique',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Historique des Commandes</h2>
      <h4>Client: {{ clientNom }}</h4>
      
      <button class="btn btn-secondary mb-3" routerLink="/clients">
        ← Retour aux clients
      </button>

      <div *ngIf="commandes.length === 0" class="alert alert-info">
        Aucune commande trouvée pour ce client.
      </div>

      <table class="table table-striped" *ngIf="commandes.length > 0">
        <thead>
          <tr>
            <th>N° Commande</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Montant Total</th>
            <th>Nb Articles</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let commande of commandes">
            <td>#{{ commande.id }}</td>
            <td>{{ commande.date | date:'dd/MM/yyyy HH:mm' }}</td>
            <td>
              <span class="badge" [ngClass]="getStatutClass(commande.statut)">
                {{ commande.statut }}
              </span>
            </td>
            <td>{{ getMontantCommande(commande) | currency:'EUR' }}</td>
            <td>{{ commande.lignesCommande.length || 0 }}</td>

          </tr>
        </tbody>
      </table>

      <div class="card mt-3" *ngIf="commandes.length > 0">
        <div class="card-body">
          <h5>Résumé</h5>
          <p>Total des commandes: <strong>{{ commandes.length }}</strong></p>
          <p>Montant total dépensé: <strong>{{ getTotalDepense() | currency:'EUR' }}</strong></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .badge { padding: 5px 10px; }
    .bg-warning { background-color: #ffc107; color: #000; }
    .bg-info { background-color: #17a2b8; color: #fff; }
    .bg-primary { background-color: #007bff; color: #fff; }
    .bg-success { background-color: #28a745; color: #fff; }
    .bg-secondary { background-color: #6c757d; color: #fff; }
  `]
})
export class ClientHistoriqueComponent implements OnInit {
  commandes: Commande[] = [];
  clientId: number = 0;
  clientNom: string = '';

  constructor(
    private commandeService: CommandeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Récupérer le nom du client depuis la première commande
    this.commandeService.getHistoriqueClient(this.clientId).subscribe({
      next: (data) => {
        this.commandes = data;
        if (data.length > 0 && data[0].clientNom) {
          this.clientNom = data[0].clientNom;
        }
      },
      error: (err) => {
        console.error('Erreur chargement historique:', err);
        alert('Erreur lors du chargement de l\'historique');
      }
    });
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

  getTotalDepense(): number {
    return this.commandes.reduce((total, cmd) => total + this.getMontantCommande(cmd), 0);
  }

  getMontantCommande(cmd: Commande): number {
    if (cmd.montantTotal !== undefined && cmd.montantTotal !== null) {
      return cmd.montantTotal;
    }

    if (!cmd.lignesCommande || cmd.lignesCommande.length === 0) {
      return 0;
    }

    return cmd.lignesCommande.reduce((total, ligne) => {
      const sousTotal = ligne.sousTotal ?? (ligne.quantite * ligne.prixUnitaire);
      return total + (sousTotal || 0);
    }, 0);
  }
}