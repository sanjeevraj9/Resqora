import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Router } from '@angular/router';

import { WebsocketService } from '../services/websocket.service';
import { RequestService } from '../services/request.service';
import { UserHeaderComponent } from '../user-header/user-header.component';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, UserHeaderComponent],
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent
  implements OnInit, OnDestroy {

  currentStatus = 'SEARCHING';
  mechanicName = '';
  mechanicAssigned = false;

  activeRequest: any = null;

  timeline = [
    'SEARCHING',
    'ACCEPTED',
    'ON_THE_WAY',
    'ARRIVED',
    'IN_PROGRESS',
    'COMPLETED'
  ];

  map: any;
  mechanicMarker: any;

  constructor(
    private websocketService: WebsocketService,
    private requestService: RequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const saved =
      localStorage.getItem('activeRequest');

    if (saved) {
      this.activeRequest = JSON.parse(saved);
      this.loadCurrentRequestStatus();
    }

    setTimeout(() => {
      this.initMap();
    }, 500);

    this.connectSockets();
  }

  loadCurrentRequestStatus() {
    if (!this.activeRequest) return;

    this.requestService
      .getRequestById(this.activeRequest.id)
      .subscribe({
        next: (res) => {
          this.currentStatus = res.status;

          if (res.status !== 'REQUESTED') {
            this.mechanicAssigned = true;
          }
        }
      });
  }

  initMap() {
    const mapContainer =
      document.getElementById('liveMap');

    if (!mapContainer) return;

    this.map = L.map('liveMap').setView(
      [22.7196, 75.8577],
      13
    );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: 'OpenStreetMap'
      }
    ).addTo(this.map);
  }

  connectSockets() {
    this.websocketService.connect(
      '/topic/request-accepted',
      (data: any) => {
        this.currentStatus = 'ACCEPTED';
        this.mechanicAssigned = true;
        this.mechanicName =
          data.mechanicName || 'Mechanic';
      }
    );

    this.websocketService.connect(
      '/topic/request-status',
      (data: any) => {
        this.currentStatus = data.status;

        if (data.status === 'COMPLETED') {
          alert('Service completed successfully');
          localStorage.removeItem('activeRequest');
        }
      }
    );

    this.websocketService.connect(
      '/topic/live-location',
      (data: any) => {
        this.updateMechanicLocation(
          data.latitude,
          data.longitude
        );
      }
    );
  }

  cancelBooking() {
    if (!this.activeRequest) return;

    const confirmCancel = confirm(
      'Are you sure you want to cancel this request?'
    );

    if (!confirmCancel) return;

    this.requestService
      .cancelRequest(this.activeRequest.id)
      .subscribe({
        next: () => {
          alert('Request cancelled');
          localStorage.removeItem('activeRequest');
          this.router.navigate(['/user-home']);
        },
        error: (err) => {
          console.log(err);
          alert('Cancel failed');
        }
      });
  }

  updateMechanicLocation(
    lat: number,
    lng: number
  ) {
    if (!this.map) return;

    if (!this.mechanicMarker) {
      this.mechanicMarker = L.marker([lat, lng])
        .addTo(this.map);
    } else {
      this.mechanicMarker.setLatLng([lat, lng]);
    }

    this.map.panTo([lat, lng]);
  }

  isDone(step: string): boolean {
    return (
      this.timeline.indexOf(step) <=
      this.timeline.indexOf(this.currentStatus)
    );
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();

    if (this.map) {
      this.map.remove();
    }
  }
}