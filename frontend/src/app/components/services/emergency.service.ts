import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {

  private baseUrl =
    `${environment.apiUrl}/api/emergency`;

  constructor(
    private http: HttpClient
  ) {}

  private getHeaders() {
    return {
      Authorization:
        `Bearer ${localStorage.getItem('token')}`
    };
  }

  triggerEmergency(
    lat: number,
    lng: number
  ) {
    return this.http.post(
      `${this.baseUrl}/trigger?latitude=${lat}&longitude=${lng}`,
      {},
      {
        headers: this.getHeaders()
      }
    );
  }
}