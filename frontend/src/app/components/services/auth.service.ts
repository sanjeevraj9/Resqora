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

  private authUrl = 'http://localhost:8082/api/auth';
  private userUrl = 'http://localhost:8082/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

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
    return this.http.get(
      `${this.userUrl}/profile`,
      {
        headers: this.getHeaders()
      }
    );
  }

  saveAuth(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('email', response.email);
    localStorage.setItem('role', response.role);
  }

  logout() {
    localStorage.clear();
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
}