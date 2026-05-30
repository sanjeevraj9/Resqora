import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RequestService }
from '../services/request.service';
import { MechanicDashboardComponent } from "../mechanic-dashboard/mechanic-dashboard.component";
import { MechanicShellHeaderComponent } from "../mechanic-shell-header/mechanic-shell-header.component";

@Component({
  selector: 'app-edit-mechanic-profile',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MechanicDashboardComponent,
    MechanicShellHeaderComponent
],

  templateUrl:
    './edit-mechanic-profile.component.html',

  styleUrls: [
    './edit-mechanic-profile.component.scss'
  ]
})
export class EditMechanicProfileComponent
implements OnInit {

  name = '';
  phone = '';
  shopName = '';
  specialization = '';
  experienceYears = 0;

  profileImageUrl = '';
  shopImageUrl = '';

  profilePhoto: File | null = null;
  shopPhoto: File | null = null;

  profilePreview: string | null = null;
  shopPreview: string | null = null;

  loading = false;

  constructor(
    private requestService: RequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {

    this.requestService
      .getMechanicProfile()
      .subscribe({

        next: (res: any) => {

          this.name =
            res.name || '';

          this.phone =
            res.phone || '';

          this.shopName =
            res.shopName || '';

          this.specialization =
            res.specialization || '';

          this.experienceYears =
            res.experienceYears || 0;

          this.profileImageUrl =
            res.profileImageUrl || '';

          this.shopImageUrl =
            res.shopImageUrl || '';

          this.profilePreview =
            this.profileImageUrl;

          this.shopPreview =
            this.shopImageUrl;
        }
      });
  }

  onProfileSelected(event: any) {

    if (
      event.target.files &&
      event.target.files.length > 0
    ) {

      this.profilePhoto =
        event.target.files[0];

      this.profilePreview =
        URL.createObjectURL(
          this.profilePhoto!
        );
    }
  }

  onShopSelected(event: any) {

    if (
      event.target.files &&
      event.target.files.length > 0
    ) {

      this.shopPhoto =
        event.target.files[0];

      this.shopPreview =
        URL.createObjectURL(
          this.shopPhoto!
        );
    }
  }

  saveProfile() {

    this.loading = true;

    const data = {

      name: this.name,

      phone: this.phone,

      shopName: this.shopName,

      specialization:
        this.specialization,

      experienceYears:
        this.experienceYears
    };

    this.requestService
      .updateMechanicProfile(data)
      .subscribe({

        next: () => {

          if (this.profilePhoto) {

            this.requestService
              .uploadProfilePhoto(
                this.profilePhoto
              )
              .subscribe();
          }

          if (this.shopPhoto) {

            this.requestService
              .uploadShopPhoto(
                this.shopPhoto
              )
              .subscribe();
          }

          alert(
            'Profile Updated Successfully'
          );

          this.router.navigate([
            '/mechanic-dashboard'
          ]);
        },

        error: () => {

          this.loading = false;

          alert(
            'Update Failed'
          );
        }
      });
  }
}