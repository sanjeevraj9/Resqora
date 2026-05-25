import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verified',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-verified.component.html',
  styleUrls: ['./email-verified.component.scss']
})
export class EmailVerifiedComponent {

  constructor(
    private router: Router
  ) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}