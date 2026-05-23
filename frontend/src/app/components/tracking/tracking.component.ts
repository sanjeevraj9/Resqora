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

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserShellHeaderComponent
  ],
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent
  implements OnInit {

  request: any = null;

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

  initMap() {
    this.map = L.map('liveMap').setView(
      [22.7196, 75.8577],
      13
    );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '© OpenStreetMap'
      }
    ).addTo(this.map);
  }

  loadTracking() {
    const activeRequest =
      localStorage.getItem('activeRequest');

    if (!activeRequest) {
      this.router.navigate([
        '/user-home'
      ]);
      return;
    }

    const request =
      JSON.parse(activeRequest);

    this.requestService
      .getRequestById(request.id)
      .subscribe({
        next: (res: any) => {
          this.request = res;

          this.currentStatus =
            res.status;

          if (
            res.status !== 'REQUESTED'
          ) {
            this.mechanicAssigned =
              true;

            this.mechanicName =
              res.mechanicName ||
              'Mechanic Assigned';
          }

          this.updateMapMarkers(res);

          if (
            res.status ===
            'COMPLETED'
          ) {
            this.showReviewModal =
              true;
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
        [
          res.latitude,
          res.longitude
        ],
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

    const confirmCancel =
      confirm(
        'Cancel this request?'
      );

    if (!confirmCancel) return;

    this.requestService
      .cancelRequest(
        this.request.id
      )
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
          alert(
            'Cancel failed'
          );
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

  //   this.reviewService
  //     .submitReview(reviewPayload)
  //     .subscribe({
  //       next: () => {
  //         alert(
  //           'Review submitted'
  //         );

  //         this.showReviewModal =
  //           false;

  //         localStorage.removeItem(
  //           'activeRequest'
  //         );

  //         this.router.navigate([
  //           '/user-home'
  //         ]);
  //       },
  //       error: () => {
  //         alert(
  //           'Review failed'
  //         );
  //       }
  //     });
   }
  
}