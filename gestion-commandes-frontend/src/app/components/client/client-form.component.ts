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
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.clientService.updateClient(this.client.id!, this.client).subscribe({
        next: () => this.router.navigate(['/clients']),
        error: (err) => console.error('Erreur modification:', err)
      });
    } else {
      this.clientService.createClient(this.client).subscribe({
        next: () => this.router.navigate(['/clients']),
        error: (err) => console.error('Erreur création:', err)
      });
    }
  }
}