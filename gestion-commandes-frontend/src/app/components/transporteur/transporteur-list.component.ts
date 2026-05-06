import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TransporteurService } from '../../services/transporteur.service';
import { Transporteur } from '../../models/transporteur.model';

@Component({
  selector: 'app-transporteur-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>Gestion des Transporteurs</h2>

      <!-- Formulaire Création/Modification -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          {{ editingTransporteur ? 'Modifier Transporteur #' + editingTransporteur.id : 'Nouveau Transporteur' }}
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <label>Nom *</label>
              <input class="form-control" [(ngModel)]="currentTransporteur.nom" placeholder="Nom du transporteur">
            </div>
            <div class="col-md-3">
              <label>Téléphone</label>
              <input class="form-control" [(ngModel)]="currentTransporteur.telephone" placeholder="Téléphone">
            </div>
            <div class="col-md-2">
              <label>Note (0-5)</label>
              <input type="number" class="form-control" [(ngModel)]="currentTransporteur.note" 
                     min="0" max="5" step="0.1" placeholder="Note">
            </div>
            <div class="col-md-3">
              <label>&nbsp;</label>
              <div>
                <button class="btn btn-success" (click)="saveTransporteur()">
                  {{ editingTransporteur ? '💾 Modifier' : '➕ Créer' }}
                </button>
                <button class="btn btn-secondary ms-2" (click)="resetForm()" *ngIf="editingTransporteur">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des transporteurs -->
      <h4>Liste des Transporteurs ({{ transporteurs.length }})</h4>
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of transporteurs">
            <td>{{ t.id }}</td>
            <td>{{ t.nom }}</td>
            <td>{{ t.telephone || '-' }}</td>
            <td>
              <span *ngIf="t.note">{{ t.note }}/5 ⭐</span>
              <span *ngIf="!t.note" class="text-muted">Non noté</span>
            </td>
            <td>
              <button class="btn btn-sm btn-warning" (click)="editTransporteur(t)">
                ✏️ Modifier
              </button>
              <button class="btn btn-sm btn-danger ms-1" (click)="deleteTransporteur(t.id!)">
                🗑️ Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="transporteurs.length === 0" class="alert alert-info">
        Aucun transporteur enregistré.
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    label { font-weight: bold; margin-bottom: 5px; display: block; }
    .form-control { margin-bottom: 10px; }
  `]
})
export class TransporteurListComponent implements OnInit {
  transporteurs: Transporteur[] = [];
  currentTransporteur: Transporteur = { nom: '', telephone: '', note: undefined };
  editingTransporteur: Transporteur | null = null;

  constructor(private transporteurService: TransporteurService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.transporteurService.getAllTransporteurs().subscribe({
      next: (data) => this.transporteurs = data,
      error: (err) => console.error('Erreur chargement transporteurs:', err)
    });
  }

  saveTransporteur(): void {
    if (!this.currentTransporteur.nom) {
      alert('Le nom est obligatoire');
      return;
    }

    if (this.editingTransporteur) {
      // UPDATE
      this.transporteurService.updateTransporteur(
        this.editingTransporteur.id!, 
        this.currentTransporteur
      ).subscribe({
        next: () => {
          this.loadAll();
          this.resetForm();
          alert('✅ Transporteur modifié !');
        },
        error: (err) => alert('❌ Erreur: ' + (err.error?.message || 'Modification impossible'))
      });
    } else {
      // CREATE
      this.transporteurService.createTransporteur(this.currentTransporteur).subscribe({
        next: () => {
          this.loadAll();
          this.resetForm();
          alert('✅ Transporteur créé !');
        },
        error: (err) => alert('❌ Erreur: ' + (err.error?.message || 'Création impossible'))
      });
    }
  }

  editTransporteur(transporteur: Transporteur): void {
    this.editingTransporteur = transporteur;
    this.currentTransporteur = { ...transporteur }; // Copie pour ne pas modifier directement
  }

  deleteTransporteur(id: number): void {
    if (confirm('Supprimer ce transporteur ?')) {
      this.transporteurService.deleteTransporteur(id).subscribe({
        next: () => {
          this.loadAll();
          alert('🗑️ Transporteur supprimé');
        },
        error: (err) => alert('❌ Erreur: ' + (err.error?.message || 'Suppression impossible'))
      });
    }
  }

  resetForm(): void {
    this.currentTransporteur = { nom: '', telephone: '', note: undefined };
    this.editingTransporteur = null;
  }
}