import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  stats = [
    { target: 700000, display: '0', suffix: '+', label: 'Vehicles Served' },
    { target: 19100, display: '0', suffix: '+', label: 'Pincodes Covered' },
    { target: 11000, display: '0', suffix: '+', label: 'Service Providers' },
    { target: 500000, display: '0', suffix: '+', label: 'Happy Customers' }
  ];
  animated = false;

  ngOnInit() {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !this.animated) {
        this.animated = true;
        this.animateAll();
      }
    }, { threshold: 0.3 });
    setTimeout(() => {
      const el = document.querySelector('app-stats');
      if (el) observer.observe(el);
    }, 100);
  }

  animateAll() {
    this.stats.forEach((stat, i) => {
      const duration = 2000;
      const steps = 60;
      const increment = stat.target / steps;
      let current = 0;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), stat.target);
        stat.display = current >= 1000
          ? (current >= 100000
            ? Math.round(current / 100000) + 'L'
            : Math.round(current / 1000) + 'K')
          : current.toString();
        if (step >= steps) clearInterval(timer);
      }, duration / steps);
    });
  }
}
