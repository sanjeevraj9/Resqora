import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';


import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { environment }
from '../../../environments/environment';

@Component({
  selector: 'app-complete-profile',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './complete-profile.component.html',

  styleUrls: [
    './complete-profile.component.scss'
  ]
})
export class CompleteProfileComponent implements OnInit {

 name =
  localStorage.getItem('oauthName') || '';

phone = '';

shopName = '';

profilePhoto: File | null = null;

shopPhoto: File | null = null;

profilePreview: string | null = null;

shopPreview: string | null = null;

latitude: number | null = null;

longitude: number | null = null;

isMechanic =
  localStorage.getItem('oauthRole')
  === 'MECHANIC';

  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
   ngOnInit() {
  this.getCurrentLocation();
}
  
  onFileSelected(event: any) {

  if (
    event.target.files &&
    event.target.files.length > 0
  ) {

    this.shopPhoto =
      event.target.files[0];
  }
}

getCurrentLocation() {

  if (!navigator.geolocation) {

    return;
  }

  navigator.geolocation.getCurrentPosition(

    (position) => {

      this.latitude =
        position.coords.latitude;

      this.longitude =
        position.coords.longitude;

      console.log(
        'LAT:',
        this.latitude
      );

      console.log(
        'LNG:',
        this.longitude
      );
    },

    (error) => {

      console.error(
        'Location error',
        error
      );
    }

  );
}
onProfilePhotoSelected(event: any) {

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

onShopPhotoSelected(event: any) {

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

  savePhone() {

    if (
      !this.phone ||
      this.phone.length < 10
    ) {

      alert(
        'Enter valid phone number'
      );

      return;
    }

    this.loading = true;

    const token =
      localStorage.getItem(
        'token'
      );

    const oauthRole =
      localStorage.getItem(
        'oauthRole'
      ) || 'USER';

    this.http.put(

      `${environment.apiUrl}/api/auth/update-phone`,

     {
  name: this.name,

  phone: this.phone,

  role: oauthRole,

  shopName: this.shopName,
  latitude: this.latitude,
  longitude: this.longitude
},

      {
        headers: new HttpHeaders({

          Authorization:
            `Bearer ${token}`,

          'Content-Type':
            'application/json'
        })
      }

    ).subscribe({

      next: (res: any) => {

  localStorage.setItem(
    'token',
    res.token
  );
  this.uploadProfilePhoto(
  res.token
);

this.uploadShopPhoto(
  res.token
);

  localStorage.setItem(
    'role',
    res.role
  );

  if (
    res.role === 'MECHANIC'
  ) {

    this.router.navigate([
      '/mechanic-dashboard'
    ]);

  } else {

    this.router.navigate([
      '/user-home'
    ]);
  }
},

      error: (err: any) => {

        console.log(
          'Update phone error:',
          err
        );

        this.loading = false;

        alert(
          'Phone update failed'
        );
      }
    });
  }
  uploadProfilePhoto(token: string) {

  if (!this.profilePhoto) {
    return;
  }

  const formData =
    new FormData();

  formData.append(
    'file',
    this.profilePhoto
  );

  this.http.post(

    `${environment.apiUrl}/api/mechanics/upload-profile-photo`,

    formData,

    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }

  ).subscribe();
}
uploadShopPhoto(token: string) {

  if (
    !this.shopPhoto ||
    !this.isMechanic
  ) {
    return;
  }

  const formData =
    new FormData();

  formData.append(
    'file',
    this.shopPhoto
  );

  this.http.post(

    `${environment.apiUrl}/api/mechanics/upload-shop-photo`,

    formData,

    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }

  ).subscribe();
}
 
}