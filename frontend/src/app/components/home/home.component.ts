import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeroComponent } from '../hero/hero.component';
import { ServicesComponent } from '../services/services.component';
import { HowItWorksComponent } from '../how-it-works/how-it-works.component';
import { StatsComponent } from '../stats/stats.component';
import { PricingComponent } from '../pricing/pricing.component';
import { EvSectionComponent } from '../ev-section/ev-section.component';
import { CoverageComponent } from '../coverage/coverage.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { AwardsComponent } from '../awards/awards.component';
import { CtaComponent } from '../cta/cta.component';
import { AuthComponent } from '../auth/auth.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroComponent,
    ServicesComponent,
    HowItWorksComponent,
    StatsComponent,
    PricingComponent,
    EvSectionComponent,
    CoverageComponent,
    TestimonialsComponent,
    AwardsComponent,
    CtaComponent,
    AuthComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}