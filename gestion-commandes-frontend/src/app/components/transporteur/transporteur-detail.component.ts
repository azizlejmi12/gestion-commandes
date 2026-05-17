import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TransporteurService } from '../../services/transporteur.service';
import { Transporteur } from '../../models/transporteur.model';

@Component({
  selector: 'app-transporteur-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Détail du Transporteur</h2>
      <button class="btn btn-secondary mb-3" routerLink="/transporteurs">← Retour</button>

      <div class="card">
        <div class="card-body">
          <p><strong>ID:</strong> {{ transporteur.id }}</p>
          <p><strong>Nom:</strong> {{ transporteur.nom }}</p>
          <p><strong>Téléphone:</strong> {{ transporteur.telephone || '-' }}</p>
          <p><strong>Note:</strong> {{ transporteur.note ?? '-' }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`.container { padding: 20px; max-width: 700px; }`]
})
export class TransporteurDetailComponent implements OnInit {
  transporteur: Transporteur = { nom: '', telephone: '', note: undefined };

  constructor(
    private transporteurService: TransporteurService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.transporteurService.getTransporteurById(id).subscribe({
      next: (data) => this.transporteur = data,
      error: (err) => {
        console.error('Erreur chargement transporteur:', err);
        alert('Transporteur non trouvé');
      }
    });
  }
}