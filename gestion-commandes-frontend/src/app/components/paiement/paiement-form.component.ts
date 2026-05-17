import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommandeService } from '../../services/commande.service';
import { PaiementService } from '../../services/paiement.service';
import { Commande } from '../../models/commande.model';
import { Paiement } from '../../models/paiement.model';
import { StatutPaiement } from '../../models/statut-paiement.enum';

@Component({
  selector: 'app-paiement-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>Nouveau Paiement</h2>

      <form (ngSubmit)="onSubmit()" #paiementForm="ngForm">
        <div class="form-group">
          <label>Commande</label>
          <select class="form-control" [(ngModel)]="commandeId" name="commandeId" required>
            <option [ngValue]="null">-- Sélectionner une commande --</option>
            <option *ngFor="let commande of commandes" [ngValue]="commande.id">
              #{{ commande.id }} - {{ commande.clientNom }} ({{ commande.montantTotal | currency:'EUR' }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Mode</label>
          <select class="form-control" [(ngModel)]="mode" name="mode" required>
            <option value="CARTE">CARTE</option>
            <option value="VIREMENT">VIREMENT</option>
            <option value="ESPECES">ESPECES</option>
          </select>
        </div>

        <button type="submit" class="btn btn-success" [disabled]="!paiementForm.valid">Créer</button>
        <button type="button" class="btn btn-secondary" routerLink="/paiements">Annuler</button>
      </form>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 650px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-control { width: 100%; padding: 8px; }
    .btn { margin-right: 10px; margin-top: 10px; }
  `]
})
export class PaiementFormComponent implements OnInit {
  commandes: Commande[] = [];
  commandeId: number | null = null;
  mode = 'CARTE';
  initialPaiementsCount = 0;

  constructor(
    private paiementService: PaiementService,
    private commandeService: CommandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.commandeService.getAllCommandes().subscribe({
      next: (commandes) => {
        const commandesEligibles = commandes.filter(
          commande => commande.statut === 'VALIDEE' && commande.id !== undefined
        );

        if (commandesEligibles.length === 0) {
          this.commandes = [];
          return;
        }

        forkJoin(
          commandesEligibles.map(commande =>
            this.paiementService.getPaiementByCommande(commande.id!).pipe(
              catchError(() => of(null))
            )
          )
        ).subscribe({
          next: (paiements) => {
            this.commandes = commandesEligibles.filter((commande, index) => {
              const paiement = paiements[index] as Paiement | null;
              return !paiement || paiement.statut !== StatutPaiement.PAYE;
            });
          },
          error: (err) => console.error('Erreur chargement paiements par commande:', err)
        });
      },
      error: (err) => console.error('Erreur chargement commandes:', err)
    });

    this.paiementService.getAllPaiements().subscribe({
      next: (data) => this.initialPaiementsCount = data.length,
      error: (err) => console.error('Erreur chargement paiements initiaux:', err)
    });
  }

  onSubmit(): void {
    if (!this.commandeId) {
      alert('Veuillez sélectionner une commande');
      return;
    }

    this.paiementService.createPaiement(this.commandeId, this.mode).subscribe({
      next: () => void this.router.navigate(['/paiements']),
      error: (err) => {
        console.error('Erreur création paiement:', err);
        this.waitForCreatedPaiement(0);
      }
    });
  }

  private waitForCreatedPaiement(attempt: number): void {
    if (attempt >= 5) {
      alert('Erreur lors de la création du paiement');
      return;
    }

    setTimeout(() => {
      this.paiementService.getAllPaiements().subscribe({
        next: (paiements) => {
          if (paiements.length > this.initialPaiementsCount) {
            void this.router.navigate(['/paiements']);
            return;
          }

          this.waitForCreatedPaiement(attempt + 1);
        },
        error: () => this.waitForCreatedPaiement(attempt + 1)
      });
    }, 300);
  }
}
