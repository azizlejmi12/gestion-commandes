import { Routes } from '@angular/router';
import { ClientListComponent } from './components/client/client-list.component';
import { ClientFormComponent } from './components/client/client-form.component';
import { ClientDetailComponent } from './components/client/client-detail.component';
import { ClientHistoriqueComponent } from './components/client/client-historique.component';
import { CommandeListComponent } from './components/commande/commande-list.component';
import { CommandeFormComponent } from './components/commande/commande-form.component';
import { CommandeEditComponent } from './components/commande/commande-edit.component';
import { CommandeDetailComponent } from './components/commande/commande-detail.component';
import { TransporteurListComponent } from './components/transporteur/transporteur-list.component';
import { LivraisonListComponent } from './components/livraison/livraison-list.component';
import { PaiementListComponent } from './components/paiement/paiement-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/commandes', pathMatch: 'full' },
  
  // Clients - Routes fixes AVANT les paramétrées
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/new', component: ClientFormComponent },
  { path: 'clients/:id/edit', component: ClientFormComponent },
  { path: 'clients/:id/historique', component: ClientHistoriqueComponent },
  { path: 'clients/:id', component: ClientDetailComponent },
  
  // Commandes - Routes fixes AVANT les paramétrées
  { path: 'commandes', component: CommandeListComponent },
  { path: 'commandes/new', component: CommandeFormComponent },
  { path: 'commandes/:id/edit', component: CommandeEditComponent },
  { path: 'commandes/:id', component: CommandeDetailComponent },
  
  // Transporteurs
  { path: 'transporteurs', component: TransporteurListComponent },
  
  // Livraisons
  { path: 'livraisons', component: LivraisonListComponent },
  
  // Paiements
  { path: 'paiements', component: PaiementListComponent },
  
  // Fallback - TOUJOURS EN DERNIER
  { path: '**', redirectTo: '/commandes' }
];