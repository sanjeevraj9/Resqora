import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  services = ['Towing Service', 'Flat Tyre Repair', 'Battery Jumpstart', 'Fuel Delivery', 'Key Lockout Help', 'Dashcam Installation'];
  solutions = ['B2C Plans', 'B2B & Fleet', 'OEM Partners', 'Insurance RSA', 'EV Services'];
  company = ['About Us', 'Careers', 'News & Press', 'Contact Us', 'Privacy Policy', 'Terms of Use'];
  socials = [
    { icon: '𝕏', label: 'Twitter' },
    { icon: 'in', label: 'LinkedIn' },
    { icon: 'f', label: 'Facebook' },
    { icon: '▶', label: 'YouTube' }
  ];
}
