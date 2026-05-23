import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RequestService } from '../services/request.service';
import { VehicleService } from '../services/vehicle.service';
import { UserShellHeaderComponent } from '../user-shell-header/user-shell-header.component';

@Component({
  selector: 'app-issue-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserShellHeaderComponent
  ],
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.scss']
})
export class IssueDetailsComponent implements OnInit {

  selectedService: any = null;
  selectedIssue = '';
  problemDescription = '';

  selectedVehicleType = '';
  selectedBrand = '';
  selectedModel = '';

  latitude: number | null = null;
  longitude: number | null = null;
  locationFetched = false;

  vehicleData: any = {
    Bike: {
      Hero: ['Splendor', 'HF Deluxe'],
      Honda: ['Shine', 'Unicorn'],
      Bajaj: ['Pulsar', 'Platina'],
      TVS: ['Apache', 'Raider']
    },

    Car: {
      Maruti: ['Swift', 'Baleno'],
      Hyundai: ['Creta', 'i20'],
      Tata: ['Nexon', 'Punch'],
      Honda: ['City', 'Amaze']
    }
  };

  issueOptions = [
    'Vehicle not starting',
    'Engine making noise',
    'Smoke issue',
    'Brake problem',
    'Battery issue',
    'Other'
  ];

  constructor(
    private vehicleService: VehicleService,
    private requestService: RequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const serviceData =
      localStorage.getItem('selectedService');

    if (serviceData) {
      this.selectedService =
        JSON.parse(serviceData);
    }

    this.selectedVehicleType =
      localStorage.getItem('selectedVehicleType') || 'Bike';

    this.getCurrentLocation();
  }

  get brands(): string[] {
    return Object.keys(
      this.vehicleData[this.selectedVehicleType] || {}
    );
  }

  get models(): string[] {
    return (
      this.vehicleData[this.selectedVehicleType]?.[
        this.selectedBrand
      ] || []
    );
  }

  chooseIssue(issue: string) {
    this.selectedIssue = issue;
  }

  getCurrentLocation() {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.locationFetched = true;
      }
    );
  }

  mapIssueType(): string {
    if (!this.selectedService) return 'OTHER';

    const title =
      this.selectedService.title?.toLowerCase() || '';

    if (title.includes('puncture')) return 'PUNCTURE';
    if (title.includes('fuel')) return 'FUEL_EMPTY';
    if (title.includes('battery')) return 'BATTERY_ISSUE';
    if (title.includes('towing')) return 'TOWING';
    if (title.includes('engine')) return 'ENGINE_PROBLEM';

    return 'OTHER';
  }
continueBooking() {

  if (!this.selectedBrand) {
    alert('Please select brand');
    return;
  }

  if (!this.selectedModel) {
    alert('Please select model');
    return;
  }

  if (!this.locationFetched) {
    alert('Location fetching...');
    return;
  }

  const vehiclePayload = {
    vehicleType:
      this.selectedVehicleType === 'Bike'
        ? 'BIKE'
        : 'CAR',

    brand: this.selectedBrand,
    model: this.selectedModel,
    registrationNumber:
      'TEMP-' + Date.now(),
    fuelType: 'PETROL'
  };

  this.vehicleService
    .createVehicle(vehiclePayload)
    .subscribe({

      next: (savedVehicle) => {

        const requestPayload = {
          vehicleId: savedVehicle.id,
          issueType: this.mapIssueType(),
          description:
            this.problemDescription ||
            this.selectedIssue,

          latitude: this.latitude,
          longitude: this.longitude,

          estimatedPrice: Number(
            this.selectedService.price.replace('₹', '')
          )
        };

        localStorage.setItem(
          'pendingBooking',
          JSON.stringify(requestPayload)
        );

        this.router.navigate([
          '/payment'
        ]);
      },

      error: () => {
        alert('Vehicle creation failed');
      }
    });
}
}