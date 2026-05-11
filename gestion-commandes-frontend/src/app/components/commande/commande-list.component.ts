import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { Commande } from '../../models/commande.model';

@Component({
  selector: 'app-commande-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Liste des Commandes</h2>
      
      <button [routerLink]="['/commandes/new']" class="btn btn-primary mb-3">
        + Nouvelle Commande
      </button>

      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Montant Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let commande of commandes">
            <td>{{ commande.id }}</td>
            <td>{{ commande.clientNom }}</td>
            <td>{{ commande.date | date:'short' }}</td>
            <td>
              <span class="badge" [ngClass]="getStatutClass(commande.statut)">
                {{ commande.statut }}
              </span>
            </td>
            <td>{{ commande.montantTotal | currency:'EUR' }}</td>
           <td>
                <button class="btn btn-sm btn-info" [routerLink]="['/commandes', commande.id]">Voir</button>
                <button class="btn btn-sm btn-warning" [routerLink]="['/commandes', commande.id, 'edit']" 
                        *ngIf="commande.statut === 'EN_ATTENTE'">Modifier</button>
                <button class="btn btn-sm btn-danger" (click)="deleteCommande(commande.id!)" 
                        *ngIf="commande.statut === 'EN_ATTENTE'">Supprimer</button>
                <button class="btn btn-sm btn-success" (click)="validerCommande(commande.id!)" 
                        *ngIf="commande.statut === 'EN_ATTENTE'">Valider</button>
                </td>
            
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .btn { margin-right: 5px; }
    .badge { padding: 5px 10px; border-radius: 4px; }
    .badge-warning { background-color: #ffc107; color: #000; }
    .badge-success { background-color: #28a745; color: #fff; }
    .badge-info { background-color: #17a2b8; color: #fff; }
    .badge-secondary { background-color: #6c757d; color: #fff; }
  `]
})
export class CommandeListComponent implements OnInit {
  commandes: Commande[] = [];

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.commandeService.getAllCommandes().subscribe({
      next: (data) => this.commandes = data,
      error: (err) => console.error('Erreur chargement commandes:', err)
    });
  }

  validerCommande(id: number): void {
    this.commandeService.validerCommande(id).subscribe({
      next: () => this.loadCommandes(),
      error: (err) => console.error('Erreur validation:', err)
    });
  }
  deleteCommande(id: number): void {
  if (confirm('Voulez-vous vraiment supprimer cette commande ?')) {
    this.commandeService.deleteCommande(id).subscribe({
      next: () => this.loadCommandes(),
      error: (err) => {
        console.error('Erreur suppression:', err);
        alert('Impossible de supprimer: ' + (err.error?.message || err.message));
      }
    });
  }
}
getStatutClass(statut: string): string {
  switch(statut) {
    case 'EN_ATTENTE': return 'badge bg-warning text-dark';
    case 'VALIDEE': return 'badge bg-info';
    case 'EN_COURS_DE_TRAITEMENT': return 'badge bg-primary';
    case 'EXPEDIEE': return 'badge bg-secondary';
    case 'LIVREE': return 'badge bg-success';
    case 'ANNULEE': return 'badge bg-danger';
    default: return 'badge bg-secondary';
  }
}
}