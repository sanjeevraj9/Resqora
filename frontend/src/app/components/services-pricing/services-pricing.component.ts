import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { UserShellHeaderComponent } from '../user-shell-header/user-shell-header.component';

@Component({
  selector: 'app-services-pricing',
  standalone: true,
  imports: [
    CommonModule,
    UserShellHeaderComponent
  ],
  templateUrl: './services-pricing.component.html',
  styleUrls: ['./services-pricing.component.scss']
})
export class ServicesPricingComponent
  implements OnInit {

  selectedVehicle = '';
  services: any[] = [];

 serviceMap: any = {
  Bike: [
    {
      title: 'Puncture Repair',
      desc: 'Quick puncture repair at your location',
      price: 149,
      icon: '🛞'
    },
    {
      title: 'Fuel Delivery',
      desc: 'Emergency petrol delivery service',
      price: 249,
      icon: '⛽'
    },
    {
      title: 'Battery Jumpstart',
      desc: 'Dead battery instant support',
      price: 299,
      icon: '🔋'
    },
    {
      title: 'Engine Repair',
      desc: 'Bike engine roadside support',
      price: 399,
      icon: '⚙️'
    },
    {
      title: 'Other Issue',
      desc: 'Facing some other bike problem?',
      price: 199,
      icon: '🧰'
    }
  ],

  Car: [
    {
      title: 'Car Washing',
      desc: 'Professional car washing at your doorstep',
      price: 199,
      icon: '🚗'
    },
    {
      title: 'Towing',
      desc: 'Vehicle towing assistance',
      price: 799,
      icon: '🚛'
    },
    {
      title: 'Fuel Delivery',
      desc: 'Emergency fuel delivery',
      price: 249,
      icon: '⛽'
    },
    {
      title: 'Battery Jumpstart',
      desc: 'Dead battery support',
      price: 299,
      icon: '🔋'
    },
    {
      title: 'Engine Repair',
      desc: 'Car engine diagnosis',
      price: 499,
      icon: '⚙️'
    },
    {
      title: 'Other Issue',
      desc: 'Facing some other car issue?',
      price: 249,
      icon: '🧰'
    }
  ],

  'EV Bike': [
    {
      title: 'Charging Support',
      desc: 'Emergency EV charging support',
      price: 399,
      icon: '⚡'
    },
    {
      title: 'Battery Diagnostics',
      desc: 'EV battery diagnostics',
      price: 499,
      icon: '🔋'
    },
    {
      title: 'EV Towing',
      desc: 'Safe EV towing support',
      price: 899,
      icon: '🚛'
    },
    {
      title: 'Other Issue',
      desc: 'Facing some other EV bike issue?',
      price: 299,
      icon: '🧰'
    }
  ],

  'EV Car': [
    {
      title: 'Car Washing',
      desc: 'Professional EV car washing service',
      price: 249,
      icon: '🚗'
    },
    {
      title: 'Charging Support',
      desc: 'Emergency EV charging support',
      price: 499,
      icon: '⚡'
    },
    {
      title: 'Battery Diagnostics',
      desc: 'EV battery diagnostics',
      price: 599,
      icon: '🔋'
    },
    {
      title: 'EV Towing',
      desc: 'Safe EV towing support',
      price: 999,
      icon: '🚛'
    },
    {
      title: 'Other Issue',
      desc: 'Facing some other EV car issue?',
      price: 349,
      icon: '🧰'
    }
  ]
};

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedVehicle =
        params['vehicle'] || 'Bike';

      this.services =
        this.serviceMap[
          this.selectedVehicle
        ] || [];
    });
  }

  selectService(service: any) {
    this.router.navigate(
      [
        '/issue-details'
      ],
      {
        queryParams: {
          vehicle:
            this.selectedVehicle,
            service: service.title,
          price:
            service.price
        }
      }
    );
  }
}