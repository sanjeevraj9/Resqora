import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

type Role = 'user' | 'mechanic';
type Mode = 'login' | 'register';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  mode: Mode = 'login';
  role: Role = 'user';

  showPassword = false;
  showConfirm = false;
  loading = false;

  mechanicLatitude: number | null = null;
  mechanicLongitude: number | null = null;
  locationFetched = false;

  loginForm = {
    email: '',
    password: ''
  };

  registerForm = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    shopName: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const path = this.router.url;
    this.mode = path.includes('register')
      ? 'register'
      : 'login';
  }

  switchMode(m: Mode) {
    this.mode = m;
    this.router.navigate([
      m === 'login' ? '/login' : '/register'
    ]);
  }

  switchRole(r: Role) {
    this.role = r;
  }

  getCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.mechanicLatitude = position.coords.latitude;
        this.mechanicLongitude = position.coords.longitude;
        this.locationFetched = true;

        alert('Location fetched successfully');
      },
      () => {
        alert('Please allow location access');
      }
    );
  }

  handleSubmit() {
    if (
      this.mode === 'register' &&
      this.registerForm.password !==
      this.registerForm.confirmPassword
    ) {
      alert('Passwords do not match');
      return;
    }

    this.loading = true;

    if (this.mode === 'login') {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  handleLogin() {
    this.authService.login({
      email: this.loginForm.email,
      password: this.loginForm.password
    }).subscribe({
      next: (response) => {
        this.loading = false;

        this.authService.saveAuth(response);

        if (response.role === 'MECHANIC') {
          this.router.navigate(['/mechanic-dashboard']);
        } else {
          this.router.navigate(['/user-home']);
        }
      },
      error: (err) => {
        this.loading = false;
        alert(err?.error?.message || 'Login failed');
      }
    });
  }

  handleRegister() {
    if (this.role === 'user') {
      this.registerUser();
    } else {
      this.registerMechanic();
    }
  }

  registerUser() {
    this.authService.registerUser({
      name: this.registerForm.fullName,
      email: this.registerForm.email,
      phone: this.registerForm.phone,
      password: this.registerForm.password
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.authService.saveAuth(response);
        this.router.navigate(['/user-home']);
      },
      error: (err) => {
        this.loading = false;
        alert(err?.error?.message || 'Registration failed');
      }
    });
  }

  registerMechanic() {

    if (!this.locationFetched) {
      this.loading = false;
      alert('Please fetch your location first');
      return;
    }

    this.authService.registerMechanic({
      name: this.registerForm.fullName,
      email: this.registerForm.email,
      phone: this.registerForm.phone,
      password: this.registerForm.password,
      shopName: this.registerForm.shopName,
      latitude: this.mechanicLatitude,
      longitude: this.mechanicLongitude
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.authService.saveAuth(response);
        this.router.navigate(['/mechanic-dashboard']);
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
        alert(err?.error?.message || 'Mechanic registration failed');
      }
    });
  }
}