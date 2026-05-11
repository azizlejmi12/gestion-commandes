import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { Commande } from '../../models/commande.model';
import { LigneCommande } from '../../models/ligne-commande.model';
import { StatutCommande } from '../../models/statut-commande.enum';

@Component({
  selector: 'app-commande-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>Modifier Commande #{{ commande.id }}</h2>
      <p>Client: <strong>{{ commande.clientNom }}</strong></p>
      <p>Statut: <span class="badge bg-warning">{{ commande.statut }}</span></p>
      
      <div class="alert alert-info">
        ⚠️ Vous ne pouvez modifier que les commandes en attente.
      </div>

      <h4>Lignes de commande</h4>
      <table class="table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix Unitaire</th>
            <th>Sous-total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor=\"let ligne of commande.lignesCommande || []; let i = index\">
            <td><input class="form-control" [(ngModel)]="ligne.produit"></td>
            <td><input type="number" class="form-control" [(ngModel)]="ligne.quantite" (change)="calculerTotal()"></td>
            <td><input type="number" class="form-control" [(ngModel)]="ligne.prixUnitaire" (change)="calculerTotal()"></td>
            <td>{{ ligne.quantite * ligne.prixUnitaire | currency:'EUR' }}</td>
            <td><button class="btn btn-danger btn-sm" (click)="supprimerLigne(i)">🗑️</button></td>
          </tr>
        </tbody>
      </table>

      <button class="btn btn-secondary mb-3" (click)="ajouterLigne()">+ Ajouter une ligne</button>

      <div class="card">
        <div class="card-body">
          <h4>Total: {{ commande.montantTotal | currency:'EUR' }}</h4>
        </div>
      </div>

      <div class="mt-3">
        <button class="btn btn-success" (click)="enregistrer()">💾 Enregistrer</button>
        <button class="btn btn-outline-secondary ms-2" routerLink="/commandes">Annuler</button>
      </div>
    </div>
  `,
  styles: [`.container { padding: 20px; max-width: 900px; }`]
})
export class CommandeEditComponent implements OnInit {
  commande: Commande = {
    statut: StatutCommande.EN_ATTENTE,
    lignesCommande: []
};

  constructor(
    private commandeService: CommandeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.commandeService.getCommandeById(id).subscribe({
      next: (data) => {
        if (data.statut !== 'EN_ATTENTE') {
          alert('Cette commande ne peut plus être modifiée');
          this.router.navigate(['/commandes']);
        }
        this.commande = data;
      },
      error: (err) => {
        alert('Commande non trouvée');
        this.router.navigate(['/commandes']);
      }
    });
  }

  ajouterLigne(): void {
    this.commande.lignesCommande.push({
      produit: '',
      quantite: 1,
      prixUnitaire: 0
    });
    this.calculerTotal();
  }

  supprimerLigne(index: number): void {
    this.commande.lignesCommande.splice(index, 1);
    this.calculerTotal();
  }

  calculerTotal(): void {
    this.commande.montantTotal = this.commande.lignesCommande.reduce(
      (sum, l) => sum + (l.quantite * l.prixUnitaire), 0
    );
  }

  enregistrer(): void {
    this.commandeService.updateCommande(this.commande.id!, this.commande).subscribe({
      next: () => {
        alert('✅ Commande modifiée !');
        this.router.navigate(['/commandes']);
      },
      error: (err) => alert('❌ Erreur: ' + (err.error?.message || 'Modification impossible'))
    });
  }
}