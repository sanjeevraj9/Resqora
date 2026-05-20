import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent {
  steps = [
    { num:'01', icon:'📱', iconClass:'iw1', title:'Call or Book Online', desc:'Call our 24/7 helpline or use the Resqora app. Share your live GPS location instantly.' },
    { num:'02', icon:'🤖', iconClass:'iw2', title:'Expert Dispatched', desc:'AI-powered system matches the nearest, best-rated expert to your exact need.' },
    { num:'03', icon:'📍', iconClass:'iw3', title:'Live Tracking', desc:'Track your rescue expert in real-time on the map with accurate ETA updates.' },
    { num:'04', icon:'✅', iconClass:'iw4', title:'Problem Solved!', desc:'Expert arrives, fixes your vehicle on the spot. You\'re back on the road!' }
  ];
}
