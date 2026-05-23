import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-mechanic-shell-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './mechanic-shell-header.component.html',
  styleUrls: ['./mechanic-shell-header.component.scss']
})
export class MechanicShellHeaderComponent
  implements OnInit {

  profile: any = null;

  selectedCity =
    localStorage.getItem('mechanicCity') || 'Indore';

  selectedState = '';

  showProfileModal = false;
  showLocationModal = false;

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

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  get cities(): string[] {
    return this.cityMap[this.selectedState] || [];
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (res: any) => {
        this.profile = res;
      },
      error: (err) => {
        console.log('PROFILE ERROR:', err);
      }
    });
  }

  detectCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Location not supported');
      return;
    }

    this.selectedCity = 'Detecting...';

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );

          const data = await response.json();

          const city =
            data.city ||
            data.locality ||
            data.principalSubdivision ||
            'Indore';

          this.selectedCity = city;

          localStorage.setItem(
            'mechanicCity',
            city
          );

          this.closeLocationModal();

          this.router.navigate([
            '/mechanic-dashboard'
          ]);

        } catch (err) {
          console.log(err);
          this.selectedCity = 'Indore';
        }
      },
      (err) => {
        console.log(err);
        alert('Location permission denied');
      },
      {
        enableHighAccuracy: false,
        timeout: 3000,
        maximumAge: 60000
      }
    );
  }

  goDashboard() {
    this.router.navigate([
      '/mechanic-dashboard'
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
      'mechanicCity',
      this.selectedCity
    );

    this.closeLocationModal();

    this.router.navigate([
      '/mechanic-dashboard'
    ]);
  }

  openProfile() {
    this.showProfileModal = true;
  }

  closeProfile() {
    this.showProfileModal = false;
  }

  toggleAvailability() {
  if (!this.profile) return;

  const newStatus =
    !this.profile.availability;

  console.log('SENDING:', {
    availability: newStatus
  });

  this.authService
    .updateAvailability(newStatus)
    .subscribe({
      next: (res: any) => {
        console.log('SUCCESS:', res);

        this.profile = res;
      },
      error: (err) => {
        console.log('FULL ERROR:', err);
        console.log('ERROR BODY:', err.error);

        alert('Availability update failed');
      }
    });
}

  goHistory() {
    this.closeProfile();

    this.router.navigate([
      '/mechanic-history'
    ]);
  }

  goReviews() {
    this.closeProfile();

    this.router.navigate([
      '/mechanic-reviews'
    ]);
  }

  logout() {
    localStorage.clear();

    this.router.navigate([
      '/login'
    ]);
  }
}