import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { LivraisonService } from '../../services/livraison.service';
import { TransporteurService } from '../../services/transporteur.service';
import { Commande } from '../../models/commande.model';
import { Transporteur } from '../../models/transporteur.model';

@Component({
  selector: 'app-livraison-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>Nouvelle Livraison</h2>

      <form (ngSubmit)="onSubmit()" #livraisonForm="ngForm">
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
          <label>Transporteur</label>
          <select class="form-control" [(ngModel)]="transporteurId" name="transporteurId">
            <option [ngValue]="null">-- Aucun --</option>
            <option *ngFor="let transporteur of transporteurs" [ngValue]="transporteur.id">
              {{ transporteur.nom }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Coût</label>
          <input type="number" class="form-control" [(ngModel)]="cout" name="cout" min="0" step="0.01" required>
        </div>

        <button type="submit" class="btn btn-success" [disabled]="!livraisonForm.valid">Créer</button>
        <button type="button" class="btn btn-secondary" routerLink="/livraisons">Annuler</button>
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
export class LivraisonFormComponent implements OnInit {
  commandes: Commande[] = [];
  transporteurs: Transporteur[] = [];
  commandeId: number | null = null;
  transporteurId: number | null = null;
  cout = 0;
  initialLivraisonsCount = 0;

  constructor(
    private commandeService: CommandeService,
    private transporteurService: TransporteurService,
    private livraisonService: LivraisonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.commandeService.getAllCommandes().subscribe({
      next: (data) => this.commandes = data.filter(commande => commande.statut === 'EN_COURS_DE_TRAITEMENT'),
      error: (err) => console.error('Erreur chargement commandes:', err)
    });

    this.livraisonService.getAllLivraisons().subscribe({
      next: (data) => this.initialLivraisonsCount = data.length,
      error: (err) => console.error('Erreur chargement livraisons initiaux:', err)
    });

    this.transporteurService.getAllTransporteurs().subscribe({
      next: (data) => this.transporteurs = data,
      error: (err) => console.error('Erreur chargement transporteurs:', err)
    });
  }

  onSubmit(): void {
    if (!this.commandeId) {
      alert('Veuillez sélectionner une commande');
      return;
    }
    if (!this.cout || this.cout <= 0) {
      alert('Veuillez saisir un coût valide');
      return;
    }

    this.livraisonService.createLivraison(this.commandeId, this.transporteurId, this.cout).subscribe({
      next: () => void this.router.navigate(['/livraisons']),
      error: (err) => {
        console.error('Erreur création livraison:', err);
        this.waitForCreatedLivraison(0);
      }
    });
  }

  private waitForCreatedLivraison(attempt: number): void {
    if (attempt >= 5) {
      alert('Erreur lors de la création de la livraison');
      return;
    }

    setTimeout(() => {
      this.livraisonService.getAllLivraisons().subscribe({
        next: (livraisons) => {
          if (livraisons.length > this.initialLivraisonsCount) {
            void this.router.navigate(['/livraisons']);
            return;
          }

          this.waitForCreatedLivraison(attempt + 1);
        },
        error: () => this.waitForCreatedLivraison(attempt + 1)
      });
    }, 300);
  }
}