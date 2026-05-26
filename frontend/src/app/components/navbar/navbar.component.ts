import {
  Component,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  scrolled = false;
  mobileOpen = false;

  navLinks = [
    { label: 'Services', href: 'services' },
    { label: 'How It Works', href: 'how' },
    { label: 'Pricing', href: 'pricing' },
    { label: 'EV Support', href: 'ev' },
    { label: 'Coverage', href: 'coverage' },
    { label: 'Contact', href: 'contact' }
  ];

  constructor(
    private router: Router
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled =
      window.scrollY > 50;
  }

  toggleMobile() {
    this.mobileOpen =
      !this.mobileOpen;
  }

  closeMobile() {
    this.mobileOpen = false;
  }

  scrollToSection(
    sectionId: string
  ) {
    this.closeMobile();

    if (
      this.router.url !== '/'
    ) {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const el =
            document.getElementById(
              sectionId
            );

          if (el) {
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 300);
      });

      return;
    }

    const el =
      document.getElementById(
        sectionId
      );

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
