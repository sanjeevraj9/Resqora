import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserHeaderComponent } from '../user-header/user-header.component';

@Component({
  selector: 'app-services-pricing',
  standalone: true,
  imports: [CommonModule, UserHeaderComponent],
  templateUrl: './services-pricing.component.html',
  styleUrls: ['./services-pricing.component.scss']
})
export class ServicesPricingComponent {

  constructor(private router: Router) {}

  services = [
    {
      title: 'Bike Puncture Repair',
      desc: 'Quick puncture repair at your location',
      price: '₹149',
      icon: '🛞'
    },
    {
      title: 'Fuel Delivery',
      desc: 'Emergency petrol delivery service',
      price: '₹249',
      icon: '⛽'
    },
    {
      title: 'Battery Jumpstart',
      desc: 'Dead battery instant support',
      price: '₹299',
      icon: '🔋'
    },
    {
      title: 'Towing Service',
      desc: 'Vehicle towing assistance',
      price: '₹799',
      icon: '🚛'
    },
    {
      title: 'Engine Diagnosis',
      desc: 'Mechanic checks engine issues',
      price: '₹399',
      icon: '⚙️'
    },
    {
      title: 'General Inspection',
      desc: 'Mechanic visit & issue diagnosis',
      price: '₹199',
      icon: '🧰'
    }
  ];

  selectService(service: any) {
    localStorage.setItem(
      'selectedService',
      JSON.stringify(service)
    );

    this.router.navigate(['/issue-details']);
  }
}