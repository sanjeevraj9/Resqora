import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { RequestService } from '../services/request.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user-shell-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-shell-header.component.html',
  styleUrls: ['./user-shell-header.component.scss']
})
export class UserShellHeaderComponent implements OnInit {

  selectedCity =
    localStorage.getItem('selectedCity') || 'Indore';

  selectedState = '';

  showProfileModal = false;
  showHistory = false;
  editMode = false;
  showLocationModal = false;

  profile: any = null;
  history: any[] = [];

  editForm = {
    name: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  };

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
    private authService: AuthService,
    private requestService: RequestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  get cities(): string[] {
    return this.cityMap[this.selectedState] || [];
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
      }
    });
  }
  

  goHome() {
    
  }

  openLocationModal() {
    this.showLocationModal = true;
  }

  closeLocationModal() {
    this.showLocationModal = false;
  }

  saveLocation() {
    if (!this.selectedCity) {
      alert('Please select city');
      return;
    }

    localStorage.setItem(
      'selectedCity',
      this.selectedCity
    );

    this.closeLocationModal();
  }

  openProfile() {
    this.showProfileModal = true;
  }

  closeProfile() {
    this.showProfileModal = false;
    this.editMode = false;
    this.showHistory = false;
  }

  enableEdit() {
    this.editMode = true;

    this.editForm = {
      name: this.profile.name,
      phone: this.profile.phone,
      emergencyContactName:
        this.profile.emergencyContactName || '',
      emergencyContactPhone:
        this.profile.emergencyContactPhone || ''
    };
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
          alert('Profile updated');
        }
      });
  }
  
  detectCurrentLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported');
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
          'selectedCity',
          city
        );

        this.closeLocationModal();

      } catch {
        this.selectedCity = 'Indore';
      }
    },
    () => {
      this.selectedCity = 'Indore';
    },
    {
      enableHighAccuracy: false,
      timeout: 3000,
      maximumAge: 60000
    }
  );
}

  toggleHistory() {
    this.showHistory = !this.showHistory;

    if (this.showHistory) {
      this.requestService
        .getHistory()
        .subscribe({
          next: (res) => {
            this.history = res;
          }
        });
    }
  }

  formatDate(date: string) {
    return new Date(date)
      .toLocaleString();
  }

  getStatusClass(status: string) {
    return status.toLowerCase();
  }

  rebook(item: any) {
    this.router.navigate(
      ['/issue-details'],
      {
        queryParams: {
          issue: item.issueType
        }
      }
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}