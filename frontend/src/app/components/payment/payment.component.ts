import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { RequestService } from '../services/request.service';
import { UserShellHeaderComponent } from '../user-shell-header/user-shell-header.component';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    UserShellHeaderComponent
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent
  implements OnInit {

  selectedMethod = 'COD';
  loading = false;
  requestId!: number;
  requestData: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.requestId =
        Number(params['requestId']);

      if (!this.requestId) {
        alert('Invalid booking');
        this.router.navigate(['/user-home']);
        return;
      }

      this.loadRequest();
    });
  }

  loadRequest() {
    this.requestService
      .getRequest(this.requestId)
      .subscribe({
        next: (res: any) => {
          this.requestData = res;
        },
        error: () => {
          alert('Booking not found');
          this.router.navigate(['/user-home']);
        }
      });
  }

  selectMethod(method: string) {
    this.selectedMethod = method;
  }

  continuePayment() {
    if (!this.requestData) {
      return;
    }

    if (this.selectedMethod === 'UPI') {
      this.openRazorpay();
      return;
    }

    this.updatePayment(
      'COD',
      'CASH_PENDING'
    );
  }

  openRazorpay() {
    const options = {
      key: 'rzp_test_SshViohzF567Ll',

      amount:
        this.requestData
          .estimatedPrice * 100,

      currency: 'INR',

      name: 'ResQora',

      description:
        'Roadside Assistance Payment',

      handler: () => {
        this.updatePayment(
          'UPI',
          'PAID'
        );
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

  updatePayment(
    paymentMethod: string,
    paymentStatus: string
  ) {
    this.loading = true;

    this.requestService
      .updatePayment(
        this.requestId,
        paymentMethod,
        paymentStatus
      )
      .subscribe({
        next: () => {
          localStorage.setItem(
            'activeRequest',
            JSON.stringify({
              ...this.requestData,
              id: this.requestId,
              paymentMethod,
              paymentStatus
            })
          );

          this.router.navigate(
            ['/tracking'],
            {
              queryParams: {
                requestId:
                  this.requestId
              }
            }
          );
        },

        error: (err) => {
          this.loading = false;
          alert(
            err?.error?.message ||
            'Payment update failed'
          );
        }
      });
  }
}
