import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TransporteurService } from '../../services/transporteur.service';
import { Transporteur } from '../../models/transporteur.model';

@Component({
  selector: 'app-transporteur-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>{{ isEditMode ? 'Modifier' : 'Nouveau' }} Transporteur</h2>

      <form (ngSubmit)="onSubmit()" #transporteurForm="ngForm">
        <div class="form-group">
          <label>Nom</label>
          <input class="form-control" [(ngModel)]="transporteur.nom" name="nom" required>
        </div>

        <div class="form-group">
          <label>Téléphone</label>
          <input class="form-control" [(ngModel)]="transporteur.telephone" name="telephone">
        </div>

        <div class="form-group">
          <label>Note</label>
          <input type="number" class="form-control" [(ngModel)]="transporteur.note" name="note" min="0" max="5" step="0.1">
        </div>

        <button type="submit" class="btn btn-success" [disabled]="!transporteurForm.valid">
          {{ isEditMode ? 'Modifier' : 'Créer' }}
        </button>
        <button type="button" class="btn btn-secondary" routerLink="/transporteurs">Annuler</button>
      </form>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 600px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-control { width: 100%; padding: 8px; }
    .btn { margin-right: 10px; margin-top: 10px; }
  `]
})
export class TransporteurFormComponent implements OnInit {
  transporteur: Transporteur = { nom: '', telephone: '', note: undefined };
  isEditMode = false;
  initialTransporteursCount = 0;

  constructor(
    private transporteurService: TransporteurService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.transporteurService.getTransporteurById(+id).subscribe({
        next: (data) => this.transporteur = data,
        error: (err) => console.error('Erreur chargement transporteur:', err)
      });
    }

    this.transporteurService.getAllTransporteurs().subscribe({
      next: (data) => this.initialTransporteursCount = data.length,
      error: (err) => console.error('Erreur chargement transporteurs initiaux:', err)
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      const payload = {
        nom: this.transporteur.nom,
        telephone: this.transporteur.telephone,
        note: this.transporteur.note
      };

      this.transporteurService.updateTransporteur(this.transporteur.id!, payload).subscribe({
        next: () => void this.router.navigate(['/transporteurs']),
        error: (err) => alert('Erreur modification transporteur: ' + (err.error?.message || 'modification impossible'))
      });
    } else {
      const payload = {
        nom: this.transporteur.nom,
        telephone: this.transporteur.telephone,
        note: this.transporteur.note
      };

      this.transporteurService.createTransporteur(payload).subscribe({
        next: () => void this.router.navigate(['/transporteurs']),
        error: (err) => {
          console.error('Erreur création transporteur:', err);
          this.waitForCreatedTransporteur(0);
        }
      });
    }
  }

  private waitForCreatedTransporteur(attempt: number): void {
    if (attempt >= 5) {
      alert('Erreur lors de la création du transporteur');
      return;
    }

    setTimeout(() => {
      this.transporteurService.getAllTransporteurs().subscribe({
        next: (transporteurs) => {
          if (transporteurs.length > this.initialTransporteursCount) {
            void this.router.navigate(['/transporteurs']);
            return;
          }

          this.waitForCreatedTransporteur(attempt + 1);
        },
        error: () => this.waitForCreatedTransporteur(attempt + 1)
      });
    }, 300);
  }
}