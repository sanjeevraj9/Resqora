import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = 'http://localhost:8082/api/requests';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  createRequest(data: any): Observable<any> {
    return this.http.post(
      this.apiUrl,
      data,
      {
        headers: this.getHeaders()
      }
    );
  }

  acceptRequest(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}/accept`,
      {},
      {
        headers: this.getHeaders()
      }
    );
  }

  rejectRequest(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}/reject`,
      {},
      {
        headers: this.getHeaders()
      }
    );
  }

  updateStatus(
    requestId: number,
    status: string
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${requestId}/status`,
      { status },
      {
        headers: this.getHeaders()
      }
    );
  }

  updateLiveLocation(
    requestId: number,
    latitude: number,
    longitude: number
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${requestId}/location`,
      {
        latitude,
        longitude
      },
      {
        headers: this.getHeaders()
      }
    );
  }
  getHistory(): Observable<any> {
  return this.http.get(
    `${this.apiUrl}/history`,
    {
      headers: this.getHeaders()
    }
  );
}
getRequestById(id: number): Observable<any> {
  return this.http.get(
    `${this.apiUrl}/${id}`,
    {
      headers: this.getHeaders()
    }
  );
}
cancelRequest(id: number): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/${id}/cancel`,
    {},
    {
      headers: this.getHeaders()
    }
  );
}
getMechanicActiveRequest() {
  return this.http.get<any>(
    `${this.apiUrl}/mechanic/active`,
    {
      headers: this.getHeaders()
    }
  );
}

getMechanicStats() {
  return this.http.get<any>(
    `${this.apiUrl}/mechanic/stats`,
    {
      headers: this.getHeaders()
    }
  );
}
getMechanicProfile() {
  return this.http.get<any>(
    'http://localhost:8082/api/mechanics/profile',
    {
      headers: this.getHeaders()
    }
  );
}

updateMechanicAvailability(
  availability: boolean
) {
  return this.http.put<any>(
    'http://localhost:8082/api/mechanics/availability',
    {
      availability
    },
    {
      headers: this.getHeaders()
    }
  );
}

getMechanicHistory(): Observable<any[]> {
  return this.http.get<any[]>(
    'http://localhost:8082/api/mechanics/history',
    {
      headers: this.getHeaders()
    }
  );
}
submitReview(data: any) {
  return this.http.post(
    'http://localhost:8082/api/reviews',
    data,
    {
      headers: this.getHeaders()
    }
  );
}

getMechanicReviews() {
  return this.http.get<any[]>(
    'http://localhost:8082/api/reviews/mechanic',
    {
      headers: this.getHeaders()
    }
  );
}
markCashCollected(
  requestId: number
): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/${requestId}/cash-collected`,
    {},
    {
      headers: this.getHeaders()
    }
  );
}
}