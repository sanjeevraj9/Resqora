import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { RequestService } from '../services/request.service';
import { UserHeaderComponent } from '../user-header/user-header.component';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserHeaderComponent
  ],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {

  selectedCity = '';
  selectedState = '';
  selectedVehicle = 'Bike';

  showProfileModal = false;
  showHistory = false;
  editMode = false;
  showLocationModal = false;

  profile: any = null;
  history: any[] = [];
  activeRequest: any = null;

  editForm = {
    name: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  };

  vehicleOptions = [
    'Bike',
    'Car'
  ];

  states = [
    'Madhya Pradesh',
    'Maharashtra',
    'Delhi',
    'Uttar Pradesh'
  ];

  cityMap: any = {
    'Madhya Pradesh': ['Indore', 'Bhopal'],
    'Maharashtra': ['Mumbai', 'Pune'],
    'Delhi': ['New Delhi'],
    'Uttar Pradesh': ['Lucknow', 'Noida']
  };

  serviceCards = [
    {
      title: 'Puncture Repair',
      desc: 'Fast tyre puncture repair anywhere',
      icon: '🛞',
      type: 'puncture'
    },
    {
      title: 'Fuel Delivery',
      desc: 'Emergency petrol delivery',
      icon: '⛽',
      type: 'fuel'
    },
    {
      title: 'Battery Jumpstart',
      desc: 'Dead battery quick support',
      icon: '🔋',
      type: 'battery'
    },
    {
      title: 'Towing',
      desc: 'Instant towing assistance',
      icon: '🚛',
      type: 'towing'
    },
    {
      title: 'Engine Issue',
      desc: 'Engine diagnostics & help',
      icon: '⚙️',
      type: 'engine'
    },
    {
      title: 'General Breakdown',
      desc: 'Mechanic inspection support',
      icon: '🧰',
      type: 'breakdown'
    }
    
  ];
  formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  );
}

rebook(item: any) {
  const serviceMap: any = {
    PUNCTURE: 'puncture',
    FUEL_EMPTY: 'fuel',
    BATTERY_ISSUE: 'battery',
    TOWING: 'towing',
    ENGINE_PROBLEM: 'engine',
    OTHER: 'breakdown'
  };

  this.router.navigate([
    '/service-details',
    serviceMap[item.issueType] || 'breakdown'
  ]);
}

getStatusClass(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'status-completed';

    case 'CANCELLED':
      return 'status-cancelled';

    case 'ACCEPTED':
    case 'ON_THE_WAY':
      return 'status-active';

    default:
      return 'status-pending';
  }
}

  constructor(
    private router: Router,
    private authService: AuthService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.autoFetchLocation();

    this.authService.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
      }
    });

    this.loadActiveRequest();
    
  }

  get cities(): string[] {
    return this.cityMap[this.selectedState] || [];
  }

  autoFetchLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        )
          .then((res) => res.json())
          .then((data) => {
            this.selectedCity =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              'Your City';

            localStorage.setItem(
              'selectedCity',
              this.selectedCity
            );
          });
      }
    );
  }

  loadActiveRequest() {
  const saved =
    localStorage.getItem('activeRequest');

  if (!saved) return;

  const request =
    JSON.parse(saved);

  this.requestService
    .getRequestById(request.id)
    .subscribe({
      next: (res) => {

        if (
          res.status === 'COMPLETED' ||
          res.status === 'CANCELLED'
        ) {
          localStorage.removeItem('activeRequest');
          this.activeRequest = null;
          return;
        }

        this.activeRequest = res;
      },

      error: () => {
        localStorage.removeItem('activeRequest');
        this.activeRequest = null;
      }
    });
}

  trackActiveRequest() {
    this.router.navigate(['/tracking']);
  }

  cancelActiveRequest() {
    if (!this.activeRequest) return;

    this.requestService
      .cancelRequest(this.activeRequest.id)
      .subscribe({
        next: () => {
          alert('Request cancelled');

          localStorage.removeItem('activeRequest');
          this.activeRequest = null;
        },
        error: () => {
          alert('Cancel failed');
        }
      });
  }

  openService(service: any) {
    this.router.navigate([
      '/service-details',
      service.type
    ]);
  }

  openLocationModal() {
    this.showLocationModal = true;
  }

  closeLocationModal() {
    this.showLocationModal = false;
  }

  saveLocation() {
    localStorage.setItem(
      'selectedCity',
      this.selectedCity
    );

    this.showLocationModal = false;
  }

  openProfile() {
    this.showProfileModal = true;
  }

  closeProfile() {
    this.showProfileModal = false;
    this.showHistory = false;
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;

    if (this.showHistory && this.history.length === 0) {
      this.requestService.getHistory().subscribe({
        next: (res) => {
          this.history = res;
        }
      });
    }
  }
  checkPrice() {
  if (!this.selectedCity) {
    alert('Please select city');
    return;
  }

  localStorage.setItem(
    'selectedVehicleType',
    this.selectedVehicle
  );

  this.router.navigate(['/services']);
}

enableEdit() {
  this.editMode = true;

  if (this.profile) {
    this.editForm = {
      name: this.profile.name || '',
      phone: this.profile.phone || '',
      emergencyContactName:
        this.profile.emergencyContactName || '',
      emergencyContactPhone:
        this.profile.emergencyContactPhone || ''
    };
  }
}

cancelEdit() {
  this.editMode = false;
}

saveProfile() {
  this.authService
    .updateProfile(this.editForm)
    .subscribe({
      next: (res) => {
        this.profile = res;
        this.editMode = false;
        alert('Profile updated successfully');
      },
      error: () => {
        alert('Profile update failed');
      }
    });
}

openSOS() {
  if (!this.profile?.emergencyContactPhone) {
    alert(
      'Please add emergency contact first'
    );
    return;
  }

  if (!navigator.geolocation) {
    alert('Location not supported');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const mapLink =
        `https://www.google.com/maps?q=${lat},${lng}`;

      const phone =
        this.profile.emergencyContactPhone;

      const message =
        `EMERGENCY! My live location: ${mapLink}`;

      window.open(
        `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`,
        '_blank'
      );
    }
  );
}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}