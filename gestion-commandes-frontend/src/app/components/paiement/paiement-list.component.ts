import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaiementService } from '../../services/paiement.service';
import { CommandeService } from '../../services/commande.service';
import { Paiement } from '../../models/paiement.model';
import { Commande } from '../../models/commande.model';
import { StatutPaiement } from '../../models/statut-paiement.enum';

@Component({
  selector: 'app-paiement-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestion des Paiements</h2>
      
      <!-- Créer paiement -->
      <div class="card mb-3">
        <div class="card-body">
          <h5>Nouveau Paiement</h5>
          <div class="row">
            <div class="col">
              <select class="form-control" [(ngModel)]="newPaiement.commandeId">
                <option value="">-- Commande --</option>
                <option *ngFor="let c of commandes" [value]="c.id">Commande #{{c.id}} ({{c.montantTotal | currency:'EUR'}})</option>
              </select>
            </div>
            <div class="col">
              <select class="form-control" [(ngModel)]="newPaiement.mode">
                <option value="CARTE">Carte bancaire</option>
                <option value="PAYPAL">PayPal</option>
                <option value="VIREMENT">Virement</option>
              </select>
            </div>
            <div class="col">
              <button class="btn btn-primary" (click)="createPaiement()">Créer</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste -->
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Commande</th>
            <th>Montant</th>
            <th>Mode</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of paiements">
            <td>{{ p.id }}</td>
            <td>#{{ p.commandeId }}</td>
            <td>{{ getCommandeAmount(p.commandeId!) }}</td>
            <td>{{ p.mode }}</td>
            <td>
              <span class="badge" [ngClass]="getStatutClass(p.statut)">{{ p.statut }}</span>
            </td>
            <td>
              <button class="btn btn-sm btn-success" (click)="traiter(p.id!)" *ngIf="p.statut === 'EN_ATTENTE'">Payer</button>
              <button class="btn btn-sm btn-warning" (click)="rembourser(p.id!)" *ngIf="p.statut === 'PAYE'">Rembourser</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .badge { padding: 5px 10px; }
    .bg-warning { background-color: #ffc107; color: #000; }
    .bg-success { background-color: #28a745; color: #fff; }
    .bg-danger { background-color: #dc3545; color: #fff; }
    .bg-info { background-color: #17a2b8; color: #fff; }
  `]
})
export class PaiementListComponent implements OnInit {
  paiements: Paiement[] = [];
  commandes: Commande[] = [];
  newPaiement = { commandeId: null as number | null, mode: 'CARTE' };

  constructor(
    private paiementService: PaiementService,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    // Note: Il faudrait ajouter getAllPaiements() dans le service
    // Pour l'instant, on charge par commande
    this.commandeService.getAllCommandes().subscribe(data => {
      this.commandes = data;
      // Charger les paiements pour chaque commande
      this.paiements = []; // Reset
      data.forEach(c => {
        if (c.id) {
          this.paiementService.getPaiementByCommande(c.id).subscribe({
            next: (p) => this.paiements.push(p),
            error: () => {} // Ignorer si pas de paiement
          });
        }
      });
    });
  }

  createPaiement(): void {
    if (!this.newPaiement.commandeId) return;
    this.paiementService.createPaiement(this.newPaiement.commandeId, this.newPaiement.mode)
      .subscribe(() => this.loadAll());
  }

  traiter(id: number): void {
    this.paiementService.traiterPaiement(id).subscribe(() => this.loadAll());
  }

  rembourser(id: number): void {
    this.paiementService.rembourser(id).subscribe(() => this.loadAll());
  }

  getStatutClass(statut: string): string {
    switch(statut) {
      case 'EN_ATTENTE': return 'bg-warning';
      case 'TRAITEMENT_EN_COURS': return 'bg-info';
      case 'PAYE': return 'bg-success';
      case 'REFUSE': return 'bg-danger';
      case 'REMBOURSE': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  getCommandeAmount(commandeId: number): string {
    const commande = this.commandes.find(c => c.id === commandeId);
    return commande ? (commande.montantTotal || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : '-';
  }
}