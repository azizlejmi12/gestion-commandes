import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
      <button class="btn btn-primary mb-3" routerLink="/paiements/new">+ Nouveau Paiement</button>
      
      <!-- Créer paiement -->
      <div class="card mb-3">
        <div class="card-body">
          <h5>Nouveau Paiement</h5>
          <div class="row">
            <div class="col">
              <select class="form-control" [(ngModel)]="newPaiement.commandeId">
                <option value="">-- Commande --</option>
                <option *ngFor="let c of commandesEligibles" [value]="c.id">Commande #{{c.id}} ({{ getMontantCommande(c) | currency:'EUR' }})</option>
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
              <button class="btn btn-sm btn-info me-1" [routerLink]="['/paiements', p.id]">Voir</button>
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
  commandesEligibles: Commande[] = [];
  newPaiement = { commandeId: null as number | null, mode: 'CARTE' };

  constructor(
    private paiementService: PaiementService,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    forkJoin({
      commandes: this.commandeService.getAllCommandes(),
      paiements: this.paiementService.getAllPaiements()
    }).subscribe({
      next: ({ commandes, paiements }) => {
        this.commandes = commandes;
        this.paiements = paiements;

        const commandesDejaPayees = new Set(
          paiements
            .filter(paiement => paiement.statut === StatutPaiement.PAYE && paiement.commandeId !== undefined && paiement.commandeId !== null)
            .map(paiement => String(paiement.commandeId))
        );

        const commandesEligibles = commandes.filter(
          commande => commande.id !== undefined && commande.id !== null && !commandesDejaPayees.has(String(commande.id))
        );

        if (commandesEligibles.length === 0) {
          this.commandesEligibles = [];
          return;
        }

        forkJoin(
          commandesEligibles.map(commande =>
            this.paiementService.getPaiementByCommande(commande.id!).pipe(
              catchError(() => of(null))
            )
          )
        ).subscribe({
          next: (paiementsParCommande) => {
            this.commandesEligibles = commandesEligibles.filter((commande, index) => {
              const paiement = paiementsParCommande[index] as Paiement | null;
              return !paiement || paiement.statut !== StatutPaiement.PAYE;
            });
          },
          error: (err) => console.error('Erreur chargement paiements par commande:', err)
        });
      },
      error: (err) => console.error('Erreur chargement paiements/commandes:', err)
    });
  }

  createPaiement(): void {
    if (!this.newPaiement.commandeId) {
      alert('Veuillez sélectionner une commande');
      return;
    }
    this.paiementService.createPaiement(this.newPaiement.commandeId, this.newPaiement.mode)
      .subscribe({
        next: () => this.loadAll(),
        error: (err) => alert('Erreur création paiement: ' + (err.error?.message || 'création impossible'))
      });
  }

  traiter(id: number): void {
    this.paiementService.traiterPaiement(id).subscribe({
      next: () => this.loadAll(),
      error: (err) => {
        console.error('Erreur traitement paiement:', err);
        this.paiementService.getPaiementById(id).subscribe({
          next: (paiement) => {
            if (paiement.statut !== 'EN_ATTENTE') {
              this.loadAll();
              return;
            }

            alert('Erreur traitement paiement: traitement impossible');
          },
          error: () => alert('Erreur traitement paiement: traitement impossible')
        });
      }
    });
  }

  rembourser(id: number): void {
    this.paiementService.rembourser(id).subscribe({
      next: () => this.loadAll(),
      error: (err) => {
        console.error('Erreur remboursement:', err);
        this.paiementService.getPaiementById(id).subscribe({
          next: (paiement) => {
            if (paiement.statut === 'REMBOURSE') {
              this.loadAll();
              return;
            }

            alert('Erreur remboursement: remboursement impossible');
          },
          error: () => alert('Erreur remboursement: remboursement impossible')
        });
      }
    });
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
    return commande ? this.getMontantCommande(commande).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : '-';
  }

  getMontantCommande(commande: Commande): number {
    if (commande.montantTotal !== undefined && commande.montantTotal !== null) {
      return commande.montantTotal;
    }

    if (!commande.lignesCommande || commande.lignesCommande.length === 0) {
      return 0;
    }

    return commande.lignesCommande.reduce((total, ligne) => {
      const sousTotal = ligne.sousTotal ?? (ligne.quantite * ligne.prixUnitaire);
      return total + (sousTotal || 0);
    }, 0);
  }
}