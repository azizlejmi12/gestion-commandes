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
import { TransporteurFormComponent } from './components/transporteur/transporteur-form.component';
import { TransporteurDetailComponent } from './components/transporteur/transporteur-detail.component';
import { LivraisonListComponent } from './components/livraison/livraison-list.component';
import { LivraisonFormComponent } from './components/livraison/livraison-form.component';
import { LivraisonDetailComponent } from './components/livraison/livraison-detail.component';
import { PaiementListComponent } from './components/paiement/paiement-list.component';
import { PaiementFormComponent } from './components/paiement/paiement-form.component';
import { PaiementDetailComponent } from './components/paiement/paiement-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/commandes', pathMatch: 'full' },

  { path: 'clients', component: ClientListComponent },
  { path: 'clients/new', component: ClientFormComponent },
  { path: 'clients/:id/edit', component: ClientFormComponent },
  { path: 'clients/:id/historique', component: ClientHistoriqueComponent },
  { path: 'clients/:id', component: ClientDetailComponent },

  { path: 'commandes', component: CommandeListComponent },
  { path: 'commandes/new', component: CommandeFormComponent },
  { path: 'commandes/:id/edit', component: CommandeEditComponent },
  { path: 'commandes/:id', component: CommandeDetailComponent },

  { path: 'transporteurs', component: TransporteurListComponent },
  { path: 'transporteurs/new', component: TransporteurFormComponent },
  { path: 'transporteurs/:id', component: TransporteurDetailComponent },

  { path: 'livraisons', component: LivraisonListComponent },
  { path: 'livraisons/new', component: LivraisonFormComponent },
  { path: 'livraisons/:id', component: LivraisonDetailComponent },

  { path: 'paiements', component: PaiementListComponent },
  { path: 'paiements/new', component: PaiementFormComponent },
  { path: 'paiements/:id', component: PaiementDetailComponent },

  { path: '**', redirectTo: '/commandes' }
];