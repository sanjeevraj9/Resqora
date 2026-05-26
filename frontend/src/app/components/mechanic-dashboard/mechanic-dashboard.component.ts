import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RequestService } from '../services/request.service';
import { WebsocketService } from '../services/websocket.service';
import { MechanicShellHeaderComponent } from '../mechanic-shell-header/mechanic-shell-header.component';
import{ChatComponent} from '../chat/chat.component';

@Component({
  selector: 'app-mechanic-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MechanicShellHeaderComponent,
    ChatComponent
  ],
  templateUrl: './mechanic-dashboard.component.html',
  styleUrls: ['./mechanic-dashboard.component.scss']
})
export class MechanicDashboardComponent
  implements OnInit, OnDestroy {

  incomingRequest: any = null;
  activeRequest: any = null;
  jobHistory: any[] = [];
  showChat=false;

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
    this.loadHistory();
  }

  loadActiveRequest() {
    this.requestService
      .getMechanicActiveRequest()
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.activeRequest = res;
            this.startLiveLocationSharing();
          }
        }
      });
  }

  loadStats() {
    this.requestService
      .getMechanicStats()
      .subscribe({
        next: (res: any) => {
          this.completedJobs =
            res.completedJobs || 0;

          this.todayEarnings =
            res.totalEarnings || 0;
        }
      });
  }

  loadHistory() {
    this.requestService
      .getMechanicHistory()
      .subscribe({
        next: (res: any) => {
          this.jobHistory = res || [];
        }
      });
  }

  listenForRequests() {
    this.websocketService.connect(
      '/topic/mechanic-requests',
      (data: any) => {
        this.incomingRequest = data;
      }
    );
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
      next: (res: any) => {

        console.log('ACCEPT RESPONSE', res);
        console.log('INCOMING', this.incomingRequest);

        this.activeRequest = {
          ...res,

          userId:
            res.userId ||
            this.incomingRequest.userId,

          customerName:
            this.incomingRequest.customerName,

          customerPhone:
            this.incomingRequest.customerPhone,

          latitude:
            this.incomingRequest.latitude,

          longitude:
            this.incomingRequest.longitude
        };

        console.log(
          'ACTIVE REQUEST FINAL',
          this.activeRequest
        );

        this.incomingRequest = null;

        this.startLiveLocationSharing();
      },

      error: (err) => {
        console.log(err);
      }
    });
}

  rejectRequest() {
    if (!this.incomingRequest) return;

    this.requestService
      .rejectRequest(this.incomingRequest.requestId)
      .subscribe(() => {
        this.incomingRequest = null;
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
        next: (res: any) => {
          this.activeRequest = {
            ...res,
            customerName:
              this.activeRequest.customerName,
            customerPhone:
              this.activeRequest.customerPhone,
            latitude:
              this.activeRequest.latitude,
            longitude:
              this.activeRequest.longitude
          };

          if (status === 'COMPLETED') {
            clearInterval(
              this.locationInterval
            );

            this.loadStats();
            this.loadHistory();

            setTimeout(() => {
              this.activeRequest = null;
            }, 1500);
          }
        }
      });
  }

  collectCash(request: any) {
    this.requestService
      .markCashCollected(request.id)
      .subscribe({
        next: (res: any) => {
          this.activeRequest.paymentStatus =
            res.paymentStatus;

          alert(
            'Cash marked as collected'
          );
        },
        error: () => {
          alert(
            'Cash collection update failed'
          );
        }
      });
  }

  startLiveLocationSharing() {
    this.locationInterval =
      setInterval(() => {
        if (
          !navigator.geolocation ||
          !this.activeRequest
        ) {
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

  get mechanicId(): number {
  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  );
  return user.id;
}

get userId(): number {
  return this.activeRequest?.userId || 0;
}

get bookingId(): number {
  return this.activeRequest?.id || 0;
}

  formatDate(date: string) {
    return new Date(date)
      .toLocaleString();
  }

  ngOnDestroy(): void {
    clearInterval(
      this.locationInterval
    );

    this.websocketService.disconnect();
  }
}