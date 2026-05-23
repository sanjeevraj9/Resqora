import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserShellHeaderComponent } from '../user-shell-header/user-shell-header.component';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    CommonModule,
    UserShellHeaderComponent
  ],
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit {

  service: any = null;
  isLoggedIn = false;

  servicesMap: any = {
    puncture: {
      title: 'Puncture Repair',
      icon: '🛞',
      price: '₹199',
      desc: 'Fast tyre puncture repair service anywhere, anytime.',
      features: [
        'Tube & Tubeless Support',
        '24/7 Emergency Availability',
        'Fast On-Road Assistance',
        'Expert Mechanics'
      ]
    },

    fuel: {
      title: 'Fuel Delivery',
      icon: '⛽',
      price: '₹299',
      desc: 'Emergency fuel delivery at your location.',
      features: [
        'Petrol Delivery',
        'Fast Emergency Reach',
        'Anywhere Support',
        'Verified Delivery'
      ]
    },

    battery: {
      title: 'Battery Jumpstart',
      icon: '🔋',
      price: '₹249',
      desc: 'Dead battery? Quick jumpstart support.',
      features: [
        'Quick Jumpstart',
        'Battery Inspection',
        '24/7 Service',
        'Expert Technician'
      ]
    },

    towing: {
      title: 'Towing',
      icon: '🚛',
      price: '₹599',
      desc: 'Instant towing assistance for breakdown vehicles.',
      features: [
        'Safe Vehicle Transport',
        '24/7 Towing',
        'Emergency Support',
        'Professional Handling'
      ]
    },

    engine: {
      title: 'Engine Issue',
      icon: '⚙️',
      price: '₹399',
      desc: 'Engine diagnostics & roadside help.',
      features: [
        'Engine Diagnostics',
        'Emergency Repair',
        'Mechanic Support',
        'On-Site Help'
      ]
    },

    breakdown: {
      title: 'General Breakdown',
      icon: '🧰',
      price: '₹349',
      desc: 'Complete roadside breakdown support.',
      features: [
        'Full Inspection',
        'Mechanic Visit',
        'Emergency Repair',
        'Quick Assistance'
      ]
    }
  };

  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('token');

    const type =
      this.route.snapshot.paramMap.get('type');

    this.service =
      this.servicesMap[type || 'puncture'];
  }

  bookNow() {
    localStorage.setItem(
      'selectedService',
      JSON.stringify(this.service)
    );

    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/issue-details']);
  }
}