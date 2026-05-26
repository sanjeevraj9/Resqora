import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import * as L from 'leaflet';

import { RequestService } from '../services/request.service';
import { UserShellHeaderComponent } from '../user-shell-header/user-shell-header.component';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserShellHeaderComponent,
    ChatComponent
  ],
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {

  request: any = null;
  showChat = false;

  currentStatus = 'SEARCHING';
  mechanicAssigned = false;
  mechanicName = '';

  timeline = [
    'REQUESTED',
    'ACCEPTED',
    'ON_THE_WAY',
    'IN_PROGRESS',
    'COMPLETED'
  ];

  map: any;
  userMarker: any;
  mechanicMarker: any;

  showReviewModal = false;
  selectedRating = 0;
  reviewComment = '';

  constructor(
    private requestService: RequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.loadTracking();
  }

  get userId(): number {
    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );
    return user.id;
  }

  get mechanicId(): number {
    return this.request?.mechanicId || 0;
  }

  get bookingId(): number {
    return this.request?.id || 0;
  }

  initMap() {
    const iconDefault = L.icon({
      iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon =
      iconDefault;

    this.map = L.map('liveMap').setView(
      [22.7196, 75.8577],
      13
    );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenStreetMap'
      }
    ).addTo(this.map);
  }

  loadTracking() {
    const activeRequest =
      localStorage.getItem('activeRequest');

    if (!activeRequest) {
      this.router.navigate(['/user-home']);
      return;
    }

    const request =
      JSON.parse(activeRequest);

    this.requestService
      .getRequestById(request.id)
      .subscribe({
        next: (res: any) => {
          this.request = res;
          this.currentStatus = res.status;

          this.mechanicAssigned =
            !!res.mechanicName;

          this.mechanicName =
            res.mechanicName || '';

          this.updateMapMarkers(res);

          if (
            res.status === 'COMPLETED' &&
            !this.showReviewModal
          ) {
            this.showReviewModal = true;
          }

          setTimeout(() => {
            this.loadTracking();
          }, 5000);
        },

        error: () => {
          console.log(
            'Tracking fetch failed'
          );
        }
      });
  }

  updateMapMarkers(res: any) {
    if (
      res.latitude &&
      res.longitude
    ) {
      if (this.userMarker) {
        this.map.removeLayer(
          this.userMarker
        );
      }

      this.userMarker = L.marker([
        res.latitude,
        res.longitude
      ]).addTo(this.map);

      this.map.setView(
        [res.latitude, res.longitude],
        13
      );
    }
  }

  isDone(step: string) {
    return (
      this.timeline.indexOf(step) <=
      this.timeline.indexOf(
        this.currentStatus
      )
    );
  }

  cancelBooking() {
    if (!this.request) return;

    const confirmCancel = confirm(
      'Cancel this request?'
    );

    if (!confirmCancel) return;

    this.requestService
      .cancelRequest(this.request.id)
      .subscribe({
        next: () => {
          alert(
            'Request cancelled'
          );

          localStorage.removeItem(
            'activeRequest'
          );

          this.router.navigate([
            '/user-home'
          ]);
        },

        error: () => {
          alert('Cancel failed');
        }
      });
  }

  setRating(star: number) {
    this.selectedRating = star;
  }

  submitReview() {
    if (
      !this.selectedRating ||
      !this.request
    ) {
      alert(
        'Please select rating'
      );
      return;
    }

    const reviewPayload = {
      requestId: this.request.id,
      rating: this.selectedRating,
      comment: this.reviewComment
    };

    this.requestService
      .submitReview(reviewPayload)
      .subscribe({
        next: () => {
          alert(
            'Review submitted successfully ✅'
          );

          this.showReviewModal =
            false;

          localStorage.removeItem(
            'activeRequest'
          );

          this.router.navigate([
            '/user-home'
          ]);
        },

        error: (err) => {
          console.log(err);

          alert(
            err?.error?.message ||
              'Review failed'
          );
        }
      });
  }
}