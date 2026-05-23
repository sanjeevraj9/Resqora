import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl =
    'http://localhost:8082/api/auth';

  private userUrl =
    'http://localhost:8082/api/users';

  private mechanicUrl =
    'http://localhost:8082/api/mechanics';

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
    'http://localhost:8082/api/mechanics/availability',
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
  }

  logout() {
    localStorage.clear();
  }
}