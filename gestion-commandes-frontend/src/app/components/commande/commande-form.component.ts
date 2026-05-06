import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { ClientService } from '../../services/client.service';
import { Commande } from '../../models/commande.model';
import { Client } from '../../models/client.model';
import { LigneCommande } from '../../models/ligne-commande.model';
import { StatutCommande } from '../../models/statut-commande.enum';

@Component({
  selector: 'app-commande-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>Nouvelle Commande</h2>
      
      <div class="form-group">
        <label>Client</label>
        <select class="form-control" [(ngModel)]="selectedClientId" name="client" required>
          <option value="">-- Sélectionner un client --</option>
          <option *ngFor="let client of clients" [value]="client.id">
            {{ client.nom }} ({{ client.email }})
          </option>
        </select>
      </div>

      <h3>Lignes de commande</h3>
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
          <tr *ngFor="let ligne of lignes; let i = index">
            <td><input type="text" class="form-control" [(ngModel)]="ligne.produit" name="produit{{i}}"></td>
            <td><input type="number" class="form-control" [(ngModel)]="ligne.quantite" name="quantite{{i}}" min="1"></td>
            <td><input type="number" class="form-control" [(ngModel)]="ligne.prixUnitaire" name="prix{{i}}" min="0" step="0.01"></td>
            <td>{{ getSousTotal(ligne) | currency:'EUR' }}</td>
            <td><button class="btn btn-danger" (click)="removeLigne(i)">X</button></td>
          </tr>
        </tbody>
      </table>
      
      <button class="btn btn-secondary" (click)="addLigne()">+ Ajouter une ligne</button>
      
      <div class="total">
        <h4>Total: {{ getTotal() | currency:'EUR' }}</h4>
      </div>

      <button class="btn btn-success" (click)="onSubmit()" [disabled]="!selectedClientId || lignes.length === 0">
        Créer la commande
      </button>
      <button class="btn btn-secondary" routerLink="/commandes">Annuler</button>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 800px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-control { width: 100%; padding: 8px; }
    table { margin: 20px 0; }
    input { width: 100%; }
    .total { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
    .btn { margin-right: 10px; margin-top: 10px; }
  `]
})
export class CommandeFormComponent implements OnInit {
  clients: Client[] = [];
  selectedClientId: number | null = null;
  lignes: LigneCommande[] = [];

  constructor(
    private commandeService: CommandeService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Erreur chargement clients:', err)
    });
    this.addLigne(); // Ajouter une ligne vide par défaut
  }

  addLigne(): void {
    this.lignes.push({
      produit: '',
      quantite: 1,
      prixUnitaire: 0
    });
  }

  removeLigne(index: number): void {
    this.lignes.splice(index, 1);
  }

  getSousTotal(ligne: LigneCommande): number {
    return (ligne.quantite || 0) * (ligne.prixUnitaire || 0);
  }

  getTotal(): number {
    return this.lignes.reduce((sum, ligne) => sum + this.getSousTotal(ligne), 0);
  }

  onSubmit(): void {
    if (!this.selectedClientId || this.lignes.length === 0) return;

    // Filtrer les lignes vides
    const lignesValides = this.lignes.filter(l => l.produit && l.quantite > 0 && l.prixUnitaire > 0);
    
    this.commandeService.createCommande(this.selectedClientId, lignesValides).subscribe({
      next: () => this.router.navigate(['/commandes']),
      error: (err) => console.error('Erreur création commande:', err)
    });
  }
}