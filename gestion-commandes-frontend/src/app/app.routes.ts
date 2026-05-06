import { Routes } from '@angular/router';
import { ClientListComponent } from './components/client/client-list.component';
import { ClientFormComponent } from './components/client/client-form.component';
import { CommandeListComponent } from './components/commande/commande-list.component';
import { CommandeFormComponent } from './components/commande/commande-form.component';
import { TransporteurListComponent } from './components/transporteur/transporteur-list.component';
import { LivraisonListComponent } from './components/livraison/livraison-list.component';
import { PaiementListComponent } from './components/paiement/paiement-list.component';
import { CommandeEditComponent } from './components/commande/commande-edit.component';
import { ClientHistoriqueComponent } from './components/client/client-historique.component';
import { ClientDetailComponent } from './components/client/client-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/clients', pathMatch: 'full' },
  
  // Clients
{ path: 'clients', component: ClientListComponent },
{ path: 'clients/new', component: ClientFormComponent },
{ path: 'clients/:id/edit', component: ClientFormComponent },
{ path: 'clients/:id/historique', component: ClientHistoriqueComponent },
{ path: 'clients/:id', component: ClientDetailComponent }, 

  
  // Commandes
  { path: 'commandes', component: CommandeListComponent },
  { path: 'commandes/new', component: CommandeFormComponent },
  { path: 'commandes/:id/edit', component: CommandeEditComponent },
  // Transporteurs
  { path: 'transporteurs', component: TransporteurListComponent },
  
  // Livraisons
  { path: 'livraisons', component: LivraisonListComponent },
  
  // Paiements
  { path: 'paiements', component: PaiementListComponent },
  
  { path: '**', redirectTo: '/clients' }
];