import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent {

  userName = 'Rahul';

  stats = [
    {
      icon: '🚨',
      value: '0',
      label: 'Active Requests'
    },
    {
      icon: '🚗',
      value: '2',
      label: 'My Vehicles'
    },
    {
      icon: '📍',
      value: 'Live',
      label: 'Tracking'
    },
    {
      icon: '🛟',
      value: '24/7',
      label: 'Support'
    }
  ];

}