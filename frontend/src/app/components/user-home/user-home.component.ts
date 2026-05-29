import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RequestService } from '../services/request.service';
import { AuthService } from '../services/auth.service';
import { UserShellHeaderComponent } from '../user-shell-header/user-shell-header.component';
import { CrashDetectionService } from '../services/crash-detection.service';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserShellHeaderComponent
  ],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent
  implements OnInit {

  showCrashAlert = false;
  sosCountdown = 10;
  sosTimer: any;

  get selectedCity(): string {
    return localStorage.getItem(
      'selectedCity'
    ) || 'Indore';
  }

  selectedVehicle = 'Bike';
  availabilityMessage = '';

  private serviceAreaWords = [
    'bangalore',
    'bengaluru',
    'bengaluru urban',
    'bengaluru rural',
    'bhopal',
    'siwan'
  ];

  vehicleOptions = [
    'Bike',
    'Car',
    'EV Bike',
    'EV Car'
  ];

  activeRequest: any = null;

 serviceMap: any = {
  Bike: [
    {
      icon: '🛞',
      title: 'Puncture Repair',
      desc: 'Quick bike puncture assistance'
    },
    {
      icon: '⛽',
      title: 'Fuel Delivery',
      desc: 'Emergency fuel support'
    },
    {
      icon: '🔋',
      title: 'Battery Jumpstart',
      desc: 'Bike battery support'
    },
    {
      icon: '🛠️',
      title: 'Engine Repair',
      desc: 'Bike engine support'
    }
  ],

  Car: [
    {
      icon: '🚛',
      title: 'Towing',
      desc: 'Fast towing support'
    },
    {
      icon: '⛽',
      title: 'Fuel Delivery',
      desc: 'Emergency fuel support'
    },
    {
      icon: '🔋',
      title: 'Battery Jumpstart',
      desc: 'Car battery support'
    },
    {
      icon: '🛠️',
      title: 'Engine Repair',
      desc: 'Car engine support'
    }
  ],

  'EV Bike': [
    {
      icon: '⚡',
      title: 'Charging Support',
      desc: 'Emergency EV charging'
    },
    {
      icon: '🔋',
      title: 'Battery Diagnostics',
      desc: 'EV battery inspection'
    },
    {
      icon: '🚛',
      title: 'EV Towing',
      desc: 'Safe EV towing support'
    }
  ],

  'EV Car': [
    {
      icon: '⚡',
      title: 'Charging Support',
      desc: 'Emergency EV charging'
    },
    {
      icon: '🔋',
      title: 'Battery Diagnostics',
      desc: 'EV battery inspection'
    },
    {
      icon: '🚛',
      title: 'EV Towing',
      desc: 'Safe EV towing support'
    }
  ]
};

  constructor(
    private router: Router,
    private requestService: RequestService,
    private authService: AuthService,
    private crashDetectionService: CrashDetectionService
  ) {}

  ngOnInit(): void {
    const saved =
      localStorage.getItem('activeRequest');
      this.crashDetectionService.startMonitoring();

    if (saved) {
      this.activeRequest =
        JSON.parse(saved);
    }
  }

  checkPrice() {
    const city = this.selectedCity;

    if (!this.isServiceAvailable(city)) {
      this.availabilityMessage =
        `Service not available in ${city} yet`;
      return;
    }

    this.availabilityMessage = '';

    this.router.navigate(
      ['/services'],
      {
        queryParams: {
          vehicle:
            this.selectedVehicle
        }
      }
    );
  }

  private isServiceAvailable(location: string): boolean {
    const normalized =
      location
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return this.serviceAreaWords.some(area =>
      normalized.includes(area)
    );
  }

 openService(service: any) {
  this.router.navigate(
    ['/service-details', service.title],
    {
      queryParams: {
        vehicle: this.selectedVehicle
      }
    }
  );
}

  trackActiveRequest() {
    this.router.navigate(
      ['/tracking'],
      {
        queryParams: {
          requestId:
            this.activeRequest.id ||
            this.activeRequest.requestId
        }
      }
    );
  }

  cancelActiveRequest() {
    if (!this.activeRequest) return;

    const confirmCancel =
      confirm(
        'Cancel active request?'
      );

    if (!confirmCancel) return;

    this.requestService
      .cancelRequest(
        this.activeRequest.id
      )
      .subscribe({
        next: () => {
          alert(
            'Request cancelled'
          );

          localStorage.removeItem(
            'activeRequest'
          );

          this.activeRequest = null;
        },
        error: () => {
          alert('Cancel failed');
        }
      });
  }

  openSOS() {
    this.showCrashAlert = true;

    this.sosCountdown = 10;

    this.sosTimer =
      setInterval(() => {
        this.sosCountdown--;

        if (
          this.sosCountdown <= 0
        ) {
          clearInterval(
            this.sosTimer
          );

          this.triggerEmergencySOS();
        }
      }, 1000);
  }

  cancelSOS() {
    clearInterval(
      this.sosTimer
    );

    this.showCrashAlert = false;
  }

  triggerEmergencySOS() {
    this.showCrashAlert = false;

    this.authService
      .getProfile()
      .subscribe({
        next: (profile: any) => {
          const emergencyPhone =
            profile.emergencyContactPhone;

          const emergencyName =
            profile.emergencyContactName;

          if (!emergencyPhone) {
            alert(
              'Emergency contact not added'
            );
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat =
                position.coords.latitude;

              const lng =
                position.coords.longitude;

              const locationUrl =
                `https://maps.google.com/?q=${lat},${lng}`;

              const message =
                `🚨 EMERGENCY! Possible accident detected. My live location: ${locationUrl}`;

              window.location.href =
                `whatsapp://send?phone=91${emergencyPhone}&text=${encodeURIComponent(message)}`;

              setTimeout(() => {
                window.location.href =
                  `tel:${emergencyPhone}`;
              }, 2000);

              alert(
                `Emergency alert sent to ${emergencyName}`
              );
            },
            () => {
              alert(
                'Location access denied'
              );
            }
          );
        },
        error: () => {
          alert(
            'Failed to fetch profile'
          );
        }
      });
  }
  get serviceCards() {
  return (
    this.serviceMap[
      this.selectedVehicle
    ] || []
  );
}
}
