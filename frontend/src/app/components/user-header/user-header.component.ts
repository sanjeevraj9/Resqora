import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent {

  @Input() selectedCity = 'Your City';

  @Output() cityClicked =
    new EventEmitter<void>();

  @Output() accountClicked =
    new EventEmitter<void>();

  constructor(
    private router: Router
  ) {}

  goHome() {
    this.router.navigate(['/user-home']);
  }

  openCitySelector() {
    this.cityClicked.emit();
  }

  openAccount() {
    this.accountClicked.emit();
  }
}