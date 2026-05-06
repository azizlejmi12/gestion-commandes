import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Gestion Commandes</a>
        <div class="navbar-nav">
          <a class="nav-link" routerLink="/clients" routerLinkActive="active">Clients</a>
          <a class="nav-link" routerLink="/commandes" routerLinkActive="active">Commandes</a>
          <a class="nav-link" routerLink="/transporteurs" routerLinkActive="active">Transporteurs</a>
          <a class="nav-link" routerLink="/livraisons" routerLinkActive="active">Livraisons</a>
          <a class="nav-link" routerLink="/paiements" routerLinkActive="active">Paiements</a>
        </div>
      </div>
    </nav>
    <div class="container mt-3">
      <router-outlet></router-outlet>
    </div>
  `
})
export class NavbarComponent {}