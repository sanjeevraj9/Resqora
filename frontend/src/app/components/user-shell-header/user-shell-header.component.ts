import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { RequestService } from '../services/request.service';
import { ChangeDetectorRef } from '@angular/core';

interface PlaceSuggestion {
  label: string;
  displayName: string;
  serviceAvailable: boolean;
}

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
  citySearchTerm = '';
  showCitySuggestions = false;
  placeSuggestions: PlaceSuggestion[] = [];
  searchLoading = false;
  locationNotice = '';
  private searchTimer: number | undefined;

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
    'Karnataka': [
      'Bangalore',
      'Bengaluru',
      'Whitefield',
      'Electronic City',
      'Yelahanka',
      'Devanahalli'
    ],
    'Madhya Pradesh': [
      'Bhopal'
    ],
    'Bihar': [
      'Siwan',
      'Mairwa',
      'Maharajganj',
      'Barharia',
      'Ziradei',
      'Raghunathpur'
    ]
  };

  private serviceAreaWords = [
    'bangalore',
    'bengaluru',
    'bengaluru urban',
    'bengaluru rural',
    'bhopal',
    'siwan'
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private requestService: RequestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.placeSuggestions = this.createLocalSuggestions('');
  }

  get cities(): string[] {
    return this.cityMap[this.selectedState] || [];
  }

  get allCities(): string[] {
    return Object.values(this.cityMap)
      .flat() as string[];
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

  filterCitySuggestions() {
    const query = this.citySearchTerm
      .trim()
      .toLowerCase();

    this.locationNotice = '';

    window.clearTimeout(this.searchTimer);

    if (!query) {
      this.searchLoading = false;
      this.placeSuggestions = this.createLocalSuggestions('');
      return;
    }

    this.placeSuggestions = this.createLocalSuggestions(query);
    this.searchLoading = true;

    this.searchTimer = window.setTimeout(() => {
      this.searchPlaces(query);
    }, 350);
  }

  openCitySearch() {
    this.showCitySuggestions = true;
    this.filterCitySuggestions();
  }

  closeCitySearchSoon() {
    window.setTimeout(() => {
      this.showCitySuggestions = false;
    }, 120);
  }

  selectFirstCitySuggestion() {
    if (!this.placeSuggestions.length) {
      this.selectTypedLocation();
      return;
    }

    this.selectCityFromSearch(this.placeSuggestions[0]);
  }

  selectCityFromSearch(place: PlaceSuggestion) {
    this.selectedCity = place.label;
    this.citySearchTerm = '';
    this.showCitySuggestions = false;
    this.placeSuggestions = [];
    this.locationNotice = place.serviceAvailable
      ? ''
      : `Service not available in ${place.label} yet`;

    localStorage.setItem(
      'selectedCity',
      place.label
    );
  }

  private selectTypedLocation() {
    const typedCity = this.citySearchTerm.trim();

    if (!typedCity) {
      return;
    }

    this.selectCityFromSearch({
      label: typedCity,
      displayName: typedCity,
      serviceAvailable:
        this.isServiceAvailable(typedCity)
    });
  }

  private async searchPlaces(query: string) {
    try {
      const params =
        new URLSearchParams({
          format: 'jsonv2',
          addressdetails: '1',
          countrycodes: 'in',
          limit: '8',
          q: query
        });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`
      );

      const data = await response.json();

      this.placeSuggestions = this.mergeSuggestions([
        ...this.createLocalSuggestions(query),
        ...data.map((item: any) =>
          this.toPlaceSuggestion(item)
        )
      ]);
    } catch {
      this.placeSuggestions =
        this.createLocalSuggestions(query);
    } finally {
      this.searchLoading = false;
      this.cdr.detectChanges();
    }
  }

  private toPlaceSuggestion(item: any): PlaceSuggestion {
    const address = item.address || {};
    const label =
      address.city ||
      address.town ||
      address.village ||
      address.hamlet ||
      address.suburb ||
      address.county ||
      item.name ||
      item.display_name;

    return {
      label,
      displayName: item.display_name || label,
      serviceAvailable:
        this.isServiceAvailable(item.display_name || label)
    };
  }

  private createLocalSuggestions(query: string): PlaceSuggestion[] {
    return this.allCities
      .filter(city =>
        city.toLowerCase().includes(query)
      )
      .slice(0, 8)
      .map(city => ({
        label: city,
        displayName: `${city}, India`,
        serviceAvailable: this.isServiceAvailable(city)
      }));
  }

  private mergeSuggestions(
    suggestions: PlaceSuggestion[]
  ): PlaceSuggestion[] {
    const seen = new Set<string>();

    return suggestions
      .filter(place => {
        const key = this.normalizeLocation(
          `${place.label} ${place.displayName}`
        );

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .slice(0, 8);
  }

  private isServiceAvailable(location: string): boolean {
    const normalized =
      this.normalizeLocation(location);

    return this.serviceAreaWords.some(area =>
      normalized.includes(area)
    );
  }

  private normalizeLocation(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
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
        this.locationNotice = this.isServiceAvailable(city)
          ? ''
          : `Service not available in ${city} yet`;

        localStorage.setItem(
          'selectedCity',
          city
        );

        this.closeLocationModal();

      } catch {
        this.selectedCity = 'Indore';
        this.locationNotice =
          'Service not available in Indore yet';
      }
    },
    () => {
      this.selectedCity = 'Indore';
      this.locationNotice =
        'Service not available in Indore yet';
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
