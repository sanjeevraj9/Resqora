import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl =
    `${environment.apiUrl}/api/auth`;

  private userUrl =
    `${environment.apiUrl}/api/users`;

  private mechanicUrl =
    `${environment.apiUrl}/api/mechanics`;

  constructor(
    private http: HttpClient
  ) {}

  private getHeaders() {
    const token =
      localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  login(data: any): Observable<any> {
    return this.http.post(
      `${this.authUrl}/login`,
      data
    );
  }

  registerUser(data: any): Observable<any> {
    return this.http.post(
      `${this.authUrl}/register/user`,
      data
    );
  }

  registerMechanic(data: any): Observable<any> {
    return this.http.post(
      `${this.authUrl}/register/mechanic`,
      data
    );
  }

  getProfile(): Observable<any> {
    const role =
      localStorage.getItem('role');

    if (role === 'MECHANIC') {
      return this.http.get(
        `${this.mechanicUrl}/profile`,
        {
          headers: this.getHeaders()
        }
      );
    }

    return this.http.get(
      `${this.userUrl}/profile`,
      {
        headers: this.getHeaders()
      }
    );
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(
      `${this.userUrl}/profile`,
      data,
      {
        headers: this.getHeaders()
      }
    );
  }

  updateAvailability(
    available: boolean
  ): Observable<any> {
    const token =
      localStorage.getItem('token');

    return this.http.put(
      `${this.mechanicUrl}/availability`,
      {
        availability: available
      },
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      }
    );
  }

 saveAuth(response: any) {
  if (!response?.token) return;

  localStorage.setItem(
    'token',
    response.token
  );

  localStorage.setItem(
    'email',
    response.email
  );

  localStorage.setItem(
    'role',
    response.role
  );

  localStorage.setItem(
    'user',
    JSON.stringify({
      id: response.id,
      email: response.email,
      role: response.role,
      name: response.name
    })
  );
}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
  }
}