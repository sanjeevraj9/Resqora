import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { MechanicDashboardComponent } from './components/mechanic-dashboard/mechanic-dashboard.component';
import { ServicesPricingComponent } from './components/services-pricing/services-pricing.component';
import { IssueDetailsComponent } from './components/issue-details/issue-details.component';
import { TrackingComponent } from './components/tracking/tracking.component';
import { ServiceDetailsComponent } from './components/service-details/service-details.component';
import { MechanicProfileComponent } from './components/mechanic-profile/mechanic-profile.component';
import { MechanicHistoryComponent } from './components/mechanic-history/mechanic-history.component';
import { PaymentComponent } from './components/payment/payment.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'login', component: AuthComponent },
  { path: 'register', component: AuthComponent },

  { path: 'user-home', component: UserHomeComponent },

  { path: 'services', component: ServicesPricingComponent },

  { path: 'issue-details', component: IssueDetailsComponent },

  { path: 'tracking', component: TrackingComponent },

  { path: 'mechanic-dashboard', component: MechanicDashboardComponent },
  {
  path: 'service-details/:type',
  component: ServiceDetailsComponent
},
  { path: 'mechanic-profile', component: MechanicProfileComponent },
{
  path: 'mechanic-history',
  component: MechanicHistoryComponent
},
{
  path: 'payment',
  component: PaymentComponent
},
  { path: '**', redirectTo: '' }

  
];