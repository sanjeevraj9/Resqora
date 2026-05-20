import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RequestService } from '../services/request.service';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-mechanic-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mechanic-dashboard.component.html',
  styleUrls: ['./mechanic-dashboard.component.scss']
})
export class MechanicDashboardComponent
  implements OnInit, OnDestroy {

  incomingRequest: any = null;
  activeRequest: any = null;

  availability = true;

  todayEarnings = 0;
  completedJobs = 0;

  statuses = [
    'ON_THE_WAY',
    'ARRIVED',
    'IN_PROGRESS',
    'COMPLETED'
  ];

  locationInterval: any;

  constructor(
    private requestService: RequestService,
    private websocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.listenForRequests();
    this.loadActiveRequest();
    this.loadStats();
  }

  loadActiveRequest() {
    this.requestService
      .getMechanicActiveRequest()
      .subscribe({
        next: (res) => {
          if (res) {
            this.activeRequest = res;
            this.startLiveLocationSharing();
          }
        },
        error: () => {}
      });
  }

  loadStats() {
    this.requestService
      .getMechanicStats()
      .subscribe({
        next: (res) => {
          this.completedJobs =
            res.completedJobs || 0;

          this.todayEarnings =
            res.totalEarnings || 0;
        },
        error: () => {}
      });
  }

  listenForRequests() {
    this.websocketService.connect(
      '/topic/mechanic-requests',
      (data: any) => {
        if (!this.availability) return;

        this.incomingRequest = data;
      }
    );
  }

  toggleAvailability() {
    this.availability = !this.availability;
  }

  callCustomer() {
    const phone =
      this.incomingRequest?.customerPhone ||
      this.activeRequest?.customerPhone;

    if (!phone) return;

    window.location.href = `tel:${phone}`;
  }

  openNavigation() {
    const lat =
      this.incomingRequest?.latitude ||
      this.activeRequest?.latitude;

    const lng =
      this.incomingRequest?.longitude ||
      this.activeRequest?.longitude;

    if (!lat || !lng) return;

    window.open(
      `https://www.google.com/maps?q=${lat},${lng}`,
      '_blank'
    );
  }

  acceptRequest() {
    if (!this.incomingRequest) return;

    this.requestService
      .acceptRequest(this.incomingRequest.requestId)
      .subscribe({
        next: (res) => {
          this.activeRequest = {
            ...res,
            customerName:
              this.incomingRequest.customerName,
            customerPhone:
              this.incomingRequest.customerPhone,
            latitude:
              this.incomingRequest.latitude,
            longitude:
              this.incomingRequest.longitude
          };

          this.incomingRequest = null;

          this.startLiveLocationSharing();
        },
        error: () => {
          alert('Accept failed');
        }
      });
  }

  rejectRequest() {
    if (!this.incomingRequest) return;

    this.requestService
      .rejectRequest(this.incomingRequest.requestId)
      .subscribe({
        next: () => {
          this.incomingRequest = null;
        },
        error: () => {
          alert('Reject failed');
        }
      });
  }

  updateStatus(status: string) {
    if (!this.activeRequest) return;

    this.requestService
      .updateStatus(
        this.activeRequest.id,
        status
      )
      .subscribe({
        next: (res) => {
          this.activeRequest = {
            ...res,
            customerPhone:
              this.activeRequest.customerPhone,
            latitude:
              this.activeRequest.latitude,
            longitude:
              this.activeRequest.longitude
          };

          if (status === 'COMPLETED') {
            this.todayEarnings +=
              Number(this.activeRequest.estimatedPrice || 0);

            this.completedJobs++;

            clearInterval(this.locationInterval);

            setTimeout(() => {
              this.activeRequest = null;
            }, 1500);
          }
        },
        error: () => {
          alert('Status update failed');
        }
      });
  }

  startLiveLocationSharing() {
    this.locationInterval = setInterval(() => {

      if (!navigator.geolocation || !this.activeRequest) {
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.requestService
            .updateLiveLocation(
              this.activeRequest.id,
              position.coords.latitude,
              position.coords.longitude
            )
            .subscribe();
        }
      );

    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.locationInterval);
    this.websocketService.disconnect();
  }
}