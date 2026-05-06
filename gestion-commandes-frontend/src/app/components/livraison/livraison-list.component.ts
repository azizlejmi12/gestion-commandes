import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { LivraisonService } from '../../services/livraison.service';
import { CommandeService } from '../../services/commande.service';
import { TransporteurService } from '../../services/transporteur.service';
import { Livraison } from '../../models/livraison.model';
import { Commande } from '../../models/commande.model';
import { Transporteur } from '../../models/transporteur.model';
import { StatutLivraison } from '../../models/statut-livraison.enum';

@Component({
  selector: 'app-livraison-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <h2>Suivi des Livraisons</h2>
      
      <!-- Créer livraison -->
      <div class="card mb-3">
        <div class="card-body">
          <h5>Nouvelle Livraison</h5>
          
          <!-- Info -->
          <div class="alert alert-info">
            <small>
              ✅ Seules les commandes <strong>payées</strong> peuvent être sélectionnées.
            </small>
          </div>

          <div class="row">
            <div class="col-md-4">
              <label>Commande</label>
              <select class="form-control" [(ngModel)]="newLivraison.commandeId">
                <option value="">-- Sélectionner --</option>
                <option *ngFor="let c of commandesLivrables" [value]="c.id">
                  #{{c.id}} - {{c.client.nom}} ({{c.montantTotal | currency:'EUR'}})
                </option>
              </select>
              <small class="text-muted" *ngIf="commandesLivrables.length === 0">
                Aucune commande prête pour livraison
              </small>
            </div>
            <div class="col-md-3">
              <label>Transporteur</label>
              <select class="form-control" [(ngModel)]="newLivraison.transporteurId">
                <option value="">-- Sélectionner --</option>
                <option *ngFor="let t of transporteurs" [value]="t.id">
                  {{t.nom}} <span *ngIf="t.note">({{t.note}}/5⭐)</span>
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label>Coût de livraison</label>
              <input type="number" class="form-control" placeholder="0.00" 
                     [(ngModel)]="newLivraison.cout" min="0" step="0.01">
            </div>
            <div class="col-md-2">
              <label>&nbsp;</label>
              <button class="btn btn-primary w-100" (click)="createLivraison()"
                      [disabled]="!newLivraison.commandeId">
                Créer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des livraisons -->
      <h4>Livraisons en cours</h4>
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Commande</th>
            <th>Client</th>
            <th>Transporteur</th>
            <th>Coût</th>
            <th>Statut</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let l of livraisons" [class.table-success]="l.statut === 'LIVREE'">
            <td>{{ l.id }}</td>
            <td>#{{ l.commande?.id }}</td>
            <td>{{ l.commande?.client?.nom }}</td>
            <td>{{ l.transporteur?.nom || '-' }}</td>
            <td>{{ l.cout | currency:'EUR' }}</td>
            <td>
              <span class="badge" [ngClass]="getStatutClass(l.statut)">
                {{ l.statut }}
              </span>
            </td>
            <td>{{ l.dateLivraison | date:'dd/MM/yyyy HH:mm' }}</td>
            <td>
              <button class="btn btn-sm btn-info" 
                      (click)="expedier(l.id!)" 
                      *ngIf="l.statut === 'EN_PREPARATION'"
                      title="Marquer comme expédiée">
                🚚 Expédier
              </button>
              <button class="btn btn-sm btn-success" 
                      (click)="livrer(l.id!)" 
                      *ngIf="l.statut === 'EXPEDIEE'"
                      title="Marquer comme livrée">
                ✅ Livrer
              </button>
              <span *ngIf="l.statut === 'LIVREE'" class="text-success">
                ✓ Terminée
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Message si vide -->
      <div *ngIf="livraisons.length === 0" class="alert alert-warning">
        Aucune livraison enregistrée.
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .badge { padding: 8px 12px; font-size: 0.9em; }
    .bg-warning { background-color: #ffc107 !important; color: #000 !important; }
    .bg-info { background-color: #17a2b8 !important; color: #fff !important; }
    .bg-primary { background-color: #007bff !important; color: #fff !important; }
    .bg-success { background-color: #28a745 !important; color: #fff !important; }
    .bg-secondary { background-color: #6c757d !important; color: #fff !important; }
    .bg-danger { background-color: #dc3545 !important; color: #fff !important; }
    label { font-weight: bold; margin-bottom: 5px; display: block; }
    .form-control { margin-bottom: 10px; }
  `]
})
export class LivraisonListComponent implements OnInit {
  livraisons: Livraison[] = [];
  commandes: Commande[] = [];
  commandesLivrables: Commande[] = [];  // ✅ Filtrées
  transporteurs: Transporteur[] = [];
  newLivraison = { 
    commandeId: null as number | null, 
    transporteurId: null as number | null, 
    cout: 0 
  };

  constructor(
    private livraisonService: LivraisonService,
    private commandeService: CommandeService,
    private transporteurService: TransporteurService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    forkJoin({
      livraisons: this.livraisonService.getAllLivraisons(),
      commandes: this.commandeService.getAllCommandes()
    }).subscribe({
      next: ({ livraisons, commandes }) => {
        this.livraisons = livraisons;
        this.commandes = commandes;

        const commandesDejaLivrees = new Set(
          livraisons
            .map(livraison => livraison.commande?.id)
            .filter((id): id is number => id !== undefined)
        );

        this.commandesLivrables = commandes.filter(commande =>
          commande.statut === 'EN_COURS_DE_TRAITEMENT' &&
          commande.id !== undefined &&
          !commandesDejaLivrees.has(commande.id)
        );
      },
      error: (err) => console.error('Erreur chargement livraisons/commandes:', err)
    });

    // Charger les transporteurs
    this.transporteurService.getAllTransporteurs().subscribe({
      next: (data) => this.transporteurs = data,
      error: (err) => console.error('Erreur chargement transporteurs:', err)
    });
  }

  createLivraison(): void {
    if (!this.newLivraison.commandeId) {
      alert('❌ Veuillez sélectionner une commande');
      return;
    }

    if (!this.newLivraison.cout || this.newLivraison.cout <= 0) {
      alert('❌ Veuillez indiquer un coût de livraison valide');
      return;
    }
    
    this.livraisonService.createLivraison(
      this.newLivraison.commandeId,
      this.newLivraison.transporteurId,
      this.newLivraison.cout
    ).subscribe({
      next: (livraison) => {
        this.loadAll();
        this.newLivraison = { commandeId: null, transporteurId: null, cout: 0 };
        alert(`✅ Livraison #${livraison.id} créée avec succès !`);
      },
      error: (err) => {
        console.error(err);
        const message = err.error?.message || 'Erreur lors de la création de la livraison';
        alert('❌ ' + message);
      }
    });
  }

  expedier(id: number): void {
    if (confirm('Confirmer l\'expédition de cette livraison ?')) {
      this.livraisonService.expedier(id).subscribe({
        next: () => {
          this.loadAll();
          alert('🚚 Livraison expédiée !');
        },
        error: (err) => alert('❌ Erreur: ' + (err.error?.message || 'Expédition impossible'))
      });
    }
  }

  livrer(id: number): void {
    if (confirm('Confirmer la livraison ? La commande sera marquée comme terminée.')) {
      this.livraisonService.livrer(id).subscribe({
        next: () => {
          this.loadAll();
          alert('✅ Livraison terminée ! Commande livrée.');
        },
        error: (err) => alert('❌ Erreur: ' + (err.error?.message || 'Livraison impossible'))
      });
    }
  }

  getStatutClass(statut: string): string {
    switch(statut) {
      case 'EN_PREPARATION': return 'badge bg-warning text-dark';
      case 'EN_ATTENTE_EXPEDITION': return 'badge bg-info';
      case 'EXPEDIEE': return 'badge bg-primary';
      case 'EN_TRANSIT': return 'badge bg-secondary';
      case 'LIVREE': return 'badge bg-success';
      case 'ANNULEE': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }
}