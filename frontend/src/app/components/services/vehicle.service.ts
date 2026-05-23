import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private apiUrl = 'https://resqora-api.onrender.com/api/vehicles';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getVehicles() {
    return this.http.get<any[]>(
      this.apiUrl,
      {
        headers: this.getHeaders()
      }
    );
  }

  createVehicle(data: any) {
    return this.http.post<any>(
      this.apiUrl,
      data,
      {
        headers: this.getHeaders()
      }
    );
  }
}