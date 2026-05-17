import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaiementService } from '../../services/paiement.service';
import { Paiement } from '../../models/paiement.model';
import { StatutPaiement } from '../../models/statut-paiement.enum';

@Component({
  selector: 'app-paiement-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Détail du Paiement</h2>
      <button class="btn btn-secondary mb-3" routerLink="/paiements">← Retour</button>

      <div class="card mb-3">
        <div class="card-body">
          <p><strong>ID:</strong> {{ paiement.id }}</p>
          <p><strong>Commande:</strong> #{{ paiement.commandeId }}</p>
          <p><strong>Date:</strong> {{ paiement.date || '-' }}</p>
          <p><strong>Mode:</strong> {{ paiement.mode }}</p>
          <p><strong>Statut:</strong> {{ paiement.statut }}</p>
        </div>
      </div>

      <button class="btn btn-success me-2" (click)="traiter()" *ngIf="paiement.statut === 'EN_ATTENTE'">Traiter</button>
      <button class="btn btn-warning" (click)="rembourser()" *ngIf="paiement.statut === 'PAYE'">Rembourser</button>
    </div>
  `,
  styles: [`.container { padding: 20px; max-width: 700px; }`]
})
export class PaiementDetailComponent implements OnInit {
  paiement: Paiement = { statut: StatutPaiement.EN_ATTENTE, mode: '' };

  constructor(
    private paiementService: PaiementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadPaiement();
  }

  loadPaiement(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.paiementService.getPaiementById(id).subscribe({
      next: (data) => this.paiement = data,
      error: (err) => {
        console.error('Erreur chargement paiement:', err);
        alert('Paiement non trouvé');
      }
    });
  }

  traiter(): void {
    if (!this.paiement.id) return;
    this.paiementService.traiterPaiement(this.paiement.id).subscribe({
      next: () => this.loadPaiement(),
      error: (err) => alert('Erreur traitement paiement: ' + (err.error?.message || 'traitement impossible'))
    });
  }

  rembourser(): void {
    if (!this.paiement.id) return;
    this.paiementService.rembourser(this.paiement.id).subscribe({
      next: () => this.loadPaiement(),
      error: (err) => alert('Erreur remboursement: ' + (err.error?.message || 'remboursement impossible'))
    });
  }
}