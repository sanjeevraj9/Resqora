import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private citySubject =
    new BehaviorSubject<string>(
      localStorage.getItem('selectedCity') || 'Detecting...'
    );

  city$ = this.citySubject.asObservable();

  constructor() {
    if (!localStorage.getItem('selectedCity')) {
      this.detectCity();
    }
  }

  setCity(city: string) {
    localStorage.setItem(
      'selectedCity',
      city
    );

    this.citySubject.next(city);
  }

  getCity() {
    return this.citySubject.value;
  }

  detectCity() {
    if (!navigator.geolocation) {
      this.setCity('Your City');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        )
          .then(res => res.json())
          .then(data => {
            const city =
              data.address.city ||
              data.address.town ||
              data.address.state ||
              'Your City';

            this.setCity(city);
          })
          .catch(() => {
            this.setCity('Your City');
          });
      },
      () => {
        this.setCity('Your City');
      }
    );
  }
}