import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LivraisonService } from '../../services/livraison.service';
import { Livraison } from '../../models/livraison.model';
import { StatutLivraison } from '../../models/statut-livraison.enum';

@Component({
  selector: 'app-livraison-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Détail de la Livraison</h2>
      <button class="btn btn-secondary mb-3" routerLink="/livraisons">← Retour</button>

      <div class="card mb-3">
        <div class="card-body">
          <p><strong>ID:</strong> {{ livraison.id }}</p>
          <p><strong>Commande:</strong> #{{ livraison.commandeId }}</p>
          <p><strong>Transporteur:</strong> {{ livraison.transporteurNom || '-' }}</p>
          <p><strong>Date:</strong> {{ livraison.dateLivraison || '-' }}</p>
          <p><strong>Coût:</strong> {{ livraison.cout | currency:'EUR' }}</p>
          <p><strong>Statut:</strong> {{ livraison.statut }}</p>
        </div>
      </div>

      <button class="btn btn-info me-2" (click)="expedier()" *ngIf="livraison.statut === 'EN_PREPARATION'">Expédier</button>
      <button class="btn btn-success" (click)="livrer()" *ngIf="livraison.statut === 'EXPEDIEE'">Livrer</button>
    </div>
  `,
  styles: [`.container { padding: 20px; max-width: 700px; }`]
})
export class LivraisonDetailComponent implements OnInit {
  livraison: Livraison = { statut: StatutLivraison.EN_PREPARATION, cout: 0 } as Livraison;

  constructor(
    private livraisonService: LivraisonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadLivraison();
  }

  loadLivraison(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.livraisonService.getLivraisonById(id).subscribe({
      next: (data) => this.livraison = data,
      error: (err) => {
        console.error('Erreur chargement livraison:', err);
        alert('Livraison non trouvée');
      }
    });
  }

  expedier(): void {
    if (!this.livraison.id) return;
    this.livraisonService.expedier(this.livraison.id).subscribe({
      next: () => this.loadLivraison(),
      error: (err) => alert('Erreur expédition: ' + (err.error?.message || 'expédition impossible'))
    });
  }

  livrer(): void {
    if (!this.livraison.id) return;
    this.livraisonService.livrer(this.livraison.id).subscribe({
      next: () => this.loadLivraison(),
      error: (err) => alert('Erreur livraison: ' + (err.error?.message || 'livraison impossible'))
    });
  }
}