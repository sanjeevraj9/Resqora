import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RequestService } from '../services/request.service';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {

  selectedMethod = 'COD';
  loading = false;

  constructor(
    private router: Router,
    private requestService: RequestService
  ) {}

  selectMethod(method: string) {
    this.selectedMethod = method;
  }

  continuePayment() {
    const bookingData =
      localStorage.getItem('pendingBooking');

    if (!bookingData) {
      alert('No booking found');
      return;
    }

    const booking =
      JSON.parse(bookingData);

    if (this.selectedMethod === 'UPI') {
      this.openRazorpay(booking);
      return;
    }

    booking.paymentMethod = 'COD';
    booking.paymentStatus = 'CASH_PENDING';

    this.createRequest(booking);
  }

  openRazorpay(booking: any) {
    const options = {
      key: 'rzp_test_SshViohzF567Ll',
      amount:
        booking.estimatedPrice * 100,
      currency: 'INR',
      name: 'ResQora',
      description:
        'Roadside Assistance Payment',

      handler: (response: any) => {
        booking.paymentMethod = 'UPI';
        booking.paymentStatus = 'PAID';

        this.createRequest(booking);
      },

      modal: {
        ondismiss: () => {
          alert('Payment cancelled');
        }
      },

      theme: {
        color: '#ef4444'
      }
    };

    const razorpay =
      new Razorpay(options);

    razorpay.open();
  }

  createRequest(data: any) {
    this.loading = true;

    this.requestService
      .createRequest(data)
      .subscribe({
        next: (res) => {
          localStorage.setItem(
            'activeRequest',
            JSON.stringify(res)
          );

          localStorage.removeItem(
            'pendingBooking'
          );

          this.router.navigate([
            '/tracking'
          ]);
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
          alert('Booking failed');
        }
      });
  }
}