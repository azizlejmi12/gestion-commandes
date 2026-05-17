import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>{{ isEditMode ? 'Modifier' : 'Nouveau' }} Client</h2>
      
      <form (ngSubmit)="onSubmit()" #clientForm="ngForm">
        <div class="form-group">
          <label>Nom</label>
          <input type="text" class="form-control" [(ngModel)]="client.nom" 
                 name="nom" required>
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input type="email" class="form-control" [(ngModel)]="client.email" 
                 name="email" required>
        </div>
        
        <div class="form-group">
          <label>Adresse</label>
          <textarea class="form-control" [(ngModel)]="client.adresse" 
                    name="adresse" required></textarea>
        </div>
        
        <button type="submit" class="btn btn-success" [disabled]="!clientForm.valid">
          {{ isEditMode ? 'Modifier' : 'Créer' }}
        </button>
        <button type="button" class="btn btn-secondary" routerLink="/clients">
          Annuler
        </button>
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
export class ClientFormComponent implements OnInit {
  client: Client = {
    id: 0,
    nom: '',
    email: '',
    adresse: ''
  };
  isEditMode = false;
  initialClientsCount = 0;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clientService.getClientById(+id).subscribe({
        next: (data) => this.client = data,
        error: (err) => console.error('Erreur chargement client:', err)
      });
    }

    this.clientService.getAllClients().subscribe({
      next: (data) => this.initialClientsCount = data.length,
      error: (err) => console.error('Erreur chargement clients initiaux:', err)
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      const payload = {
        nom: this.client.nom,
        email: this.client.email,
        adresse: this.client.adresse
      };

      this.clientService.updateClient(this.client.id!, payload).subscribe({
        next: () => this.router.navigate(['/clients']),
        error: (err) => console.error('Erreur modification:', err)
      });
    } else {
      const payload = {
        nom: this.client.nom,
        email: this.client.email,
        adresse: this.client.adresse
      };

      this.clientService.createClient(payload).subscribe({
        next: () => this.router.navigate(['/clients']),
        error: (err) => {
          console.error('Erreur création:', err);
          this.waitForCreatedClient(0);
        }
      });
    }
  }

  private waitForCreatedClient(attempt: number): void {
    if (attempt >= 5) {
      alert('Erreur lors de la création du client');
      return;
    }

    setTimeout(() => {
      this.clientService.getAllClients().subscribe({
        next: (clients) => {
          if (clients.length > this.initialClientsCount) {
            void this.router.navigate(['/clients']);
            return;
          }

          this.waitForCreatedClient(attempt + 1);
        },
        error: () => this.waitForCreatedClient(attempt + 1)
      });
    }, 300);
  }
}