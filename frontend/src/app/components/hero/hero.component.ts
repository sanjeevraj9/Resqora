import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  stats = [
    { num: '11K+', label: 'Service Providers' },
    { num: '19K+', label: 'Pincodes' },
    { num: '4.8★', label: 'Avg Rating' },
    { num: '24/7', label: 'Always On' }
  ];
}
