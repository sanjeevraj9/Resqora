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
export class RequestService {

  private apiUrl =
    `${environment.apiUrl}/api/requests`;

  private mechanicUrl =
    `${environment.apiUrl}/api/mechanics`;

  private reviewUrl =
    `${environment.apiUrl}/api/reviews`;

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

  getRequest(id: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders()
      }
    );
  }
  updatePayment(
  requestId: number,
  paymentMethod: string,
  paymentStatus: string
) {
  return this.http.put(
    `${this.apiUrl}/${requestId}/payment`,
    {
      paymentMethod,
      paymentStatus
    },
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
      `${this.mechanicUrl}/profile`,
      {
        headers: this.getHeaders()
      }
    );
  }

  updateMechanicAvailability(
    availability: boolean
  ) {
    return this.http.put<any>(
      `${this.mechanicUrl}/availability`,
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
      `${this.mechanicUrl}/history`,
      {
        headers: this.getHeaders()
      }
    );
  }

submitReview(data: any) {
  return this.http.post(
    this.reviewUrl,
    data,
    {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    }
  );
}

  getMechanicReviews() {
    return this.http.get<any[]>(
      `${this.reviewUrl}/mechanic`,
      {
        headers: this.getHeaders()
      }
    );
  }
  updateAvailability(
  availability: boolean
) {

  return this.http.put(

    `${this.apiUrl}/mechanics/availability`,

    {
      availability
    },

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
  updateMechanicProfile(data: any) {

  return this.http.put(

    `${this.mechanicUrl}/profile`,

    data,

    {
      headers: this.getHeaders()
    }
  );
}

uploadProfilePhoto(file: File) {

  const formData =
    new FormData();

  formData.append(
    'file',
    file
  );

  return this.http.post(

    `${this.mechanicUrl}/upload-profile-photo`,

    formData,

    {
      headers: this.getHeaders()
    }
  );
}

uploadShopPhoto(file: File) {

  const formData =
    new FormData();

  formData.append(
    'file',
    file
  );

  return this.http.post(

    `${this.mechanicUrl}/upload-shop-photo`,

    formData,

    {
      headers: this.getHeaders()
    }
  );
}
}