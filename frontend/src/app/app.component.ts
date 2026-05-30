import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterModule,
  RouterOutlet,
  NavigationEnd
} from '@angular/router';

import { filter } from 'rxjs/operators';

import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],
  template: `
    <app-navbar *ngIf="!hideNavbar"></app-navbar>

    <router-outlet></router-outlet>

    <app-footer></app-footer>

   
  `
})
export class AppComponent {

  hideNavbar = false;

  constructor(
    private router: Router
  ) {
    this.router.events
      .pipe(
        filter(event =>
          event instanceof NavigationEnd
        )
      )
      .subscribe(() => {

        const hiddenNavbarRoutes = [
          '/user-home',
          '/service-details',
          '/issue-details',
          '/tracking',
          '/payment',
          '/mechanic-dashboard',
          '/mechanic-profile',
          '/mechanic-history',
          '/live-support',
          '/services',
          '/email-verified',
          '/oauth-success',
          '/edit-mechanic-profile'
        ];

        this.hideNavbar =
          hiddenNavbarRoutes.some(route =>
            this.router.url.startsWith(route)
          );
      });
  }
}
