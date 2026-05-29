import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestService } from '../services/request.service';
import { LocationService } from '../services/location.service';
import { MechanicShellHeaderComponent } from '../mechanic-shell-header/mechanic-shell-header.component';

@Component({
  selector: 'app-mechanic-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MechanicShellHeaderComponent],
  templateUrl: './mechanic-profile.component.html',
  styleUrls: ['./mechanic-profile.component.scss']
})
export class MechanicProfileComponent implements OnInit {

  profile: any = {};

  constructor(
    private requestService: RequestService,
    private router: Router,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.locationService.city$
  .subscribe(city => {
    if (!this.profile.city) {
      this.profile.city = city;
    }
  });
  }

  loadProfile() {
    this.requestService
      .getMechanicProfile()
      .subscribe({
        next: (res) => {
          this.profile = res;
        }
      });
  }

  saveProfile() {
  alert('Full profile update backend pending');
}
toggleAvailability() {
  const newStatus =
    !this.profile.availability;

  this.requestService
    .updateMechanicAvailability(newStatus)
    .subscribe({
      next: (res: any) => {
        this.profile = res;
      },
      error: () => {
        alert('Status update failed');
      }
    });
}

  goBack() {
    this.router.navigate(['/mechanic-dashboard']);
  }
}
