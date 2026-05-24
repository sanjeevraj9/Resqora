import { Injectable } from '@angular/core';
import { EmergencyService } from './emergency.service';

@Injectable({
  providedIn: 'root'
})
export class CrashDetectionService {

  private crashTriggered = false;
  private threshold = 35;

  constructor(
    private emergencyService: EmergencyService
  ) {}

  startMonitoring() {
    if (
      typeof DeviceMotionEvent === 'undefined'
    ) {
      return;
    }

    window.addEventListener(
      'devicemotion',
      this.handleMotion
    );
  }

  stopMonitoring() {
    window.removeEventListener(
      'devicemotion',
      this.handleMotion
    );
  }

  handleMotion = (
    event: DeviceMotionEvent
  ) => {

    if (this.crashTriggered) return;

    const acc =
      event.accelerationIncludingGravity;

    if (!acc) return;

    const x = acc.x || 0;
    const y = acc.y || 0;
    const z = acc.z || 0;

    const total =
      Math.sqrt(
        x * x +
        y * y +
        z * z
      );

    if (total > this.threshold) {
      this.crashTriggered = true;
      this.triggerEmergencySOS();
    }
  };

  triggerEmergencySOS() {
    navigator.geolocation.getCurrentPosition(
      (position) => {

        this.emergencyService
          .triggerEmergency(
            position.coords.latitude,
            position.coords.longitude
          )
          .subscribe({
            next: () => {
              alert(
                '🚨 Emergency alert sent automatically'
              );
            },
            error: (err) => {
              console.log(err);
            }
          });
      }
    );
  }
}