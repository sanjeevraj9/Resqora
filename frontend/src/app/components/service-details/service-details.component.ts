import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
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
export class ServiceDetailsComponent
  implements OnInit {

  service: any = null;
  isLoggedIn = false;
  vehicleType = '';

  servicesMap: any = {
    CAR: {
      towing: {
        title: 'Towing',
        icon: '🚛',
        price: '₹599',
        desc: 'Instant towing assistance for car breakdown.',
        features: [
          'Safe Vehicle Transport',
          '24/7 Towing',
          'Emergency Support',
          'Professional Handling'
        ]
      },

      battery: {
        title: 'Battery Jumpstart',
        icon: '🔋',
        price: '₹249',
        desc: 'Dead car battery? Quick jumpstart support.',
        features: [
          'Quick Jumpstart',
          'Battery Inspection',
          '24/7 Service',
          'Expert Technician'
        ]
      },

      engine: {
        title: 'Engine Issue',
        icon: '⚙️',
        price: '₹399',
        desc: 'Car engine diagnostics & roadside help.',
        features: [
          'Engine Diagnostics',
          'Emergency Repair',
          'Mechanic Support',
          'On-Site Help'
        ]
      },

      fuel: {
        title: 'Fuel Delivery',
        icon: '⛽',
        price: '₹299',
        desc: 'Emergency fuel delivery.',
        features: [
          'Petrol/Diesel Delivery',
          'Fast Reach',
          'Anywhere Support'
        ]
      }
    },

    BIKE: {
      puncture: {
        title: 'Puncture Repair',
        icon: '🛞',
        price: '₹199',
        desc: 'Fast bike puncture repair service.',
        features: [
          'Tube & Tubeless Support',
          '24/7 Availability',
          'Fast On-Road Assistance'
        ]
      },

      battery: {
        title: 'Battery Issue',
        icon: '🔋',
        price: '₹199',
        desc: 'Bike battery support.',
        features: [
          'Battery Check',
          'Jumpstart',
          'Mechanic Support'
        ]
      },

      engine: {
        title: 'Engine Issue',
        icon: '⚙️',
        price: '₹299',
        desc: 'Bike engine roadside support.',
        features: [
          'Engine Diagnostics',
          'Repair Support',
          'Quick Assistance'
        ]
      },

      fuel: {
        title: 'Fuel Delivery',
        icon: '⛽',
        price: '₹199',
        desc: 'Emergency bike fuel delivery.',
        features: [
          'Fast Delivery',
          '24/7 Support'
        ]
      }
    },

    EV: {
      charging: {
        title: 'Charging Support',
        icon: '⚡',
        price: '₹399',
        desc: 'Emergency EV charging assistance.',
        features: [
          'Fast Charging Help',
          'Battery Diagnostics',
          'EV Support'
        ]
      },

      towing: {
        title: 'EV Towing',
        icon: '🚛',
        price: '₹699',
        desc: 'Safe EV towing support.',
        features: [
          'Safe EV Handling',
          '24/7 Emergency Towing'
        ]
      },

      battery: {
        title: 'Battery Diagnostics',
        icon: '🔋',
        price: '₹499',
        desc: 'EV battery diagnostics.',
        features: [
          'Battery Check',
          'Health Diagnostics'
        ]
      }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn =
      !!localStorage.getItem('token');

    const type =
      this.route.snapshot.paramMap.get('type');

    this.route.queryParams.subscribe(params => {
  const rawVehicle =
    params['vehicle'] || 'Car';

  if (rawVehicle === 'Bike') {
    this.vehicleType = 'BIKE';
  } else if (rawVehicle === 'Car') {
    this.vehicleType = 'CAR';
  } else if (
    rawVehicle === 'EV Bike' ||
    rawVehicle === 'EV Car'
  ) {
    this.vehicleType = 'EV';
  } else {
    this.vehicleType = 'CAR';
  }

  const serviceKey =
    (type || 'towing')
      .toLowerCase()
      .replace(/\s+/g, '');

  const serviceMapping: any = {
    'puncturerepair': 'puncture',
    'fueldelivery': 'fuel',
    'batteryjumpstart': 'battery',
    'enginerepair': 'engine',
    'chargingsupport': 'charging',
    'evtowing': 'towing',
    'batterydiagnostics': 'battery',
    'towing': 'towing'
  };

  this.service =
    this.servicesMap[
      this.vehicleType
    ]?.[
      serviceMapping[
        serviceKey
      ]
    ];
});
  }

  bookNow() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(
      ['/issue-details'],
      {
        queryParams: {
          vehicle: this.vehicleType,
          service: this.service.title
        }
      }
    );
  }
}