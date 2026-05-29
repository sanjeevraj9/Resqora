import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

@Component({
  selector: 'app-oauth-success',
  standalone: true,

  template: `
    <div class="loader-page">

      <div class="loader"></div>

      <h2>
        Signing you in...
      </h2>

    </div>
  `,

  styles: [`

    .loader-page{
      height:100vh;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:20px;
      background:#f8fafc;
    }

    .loader{
      width:60px;
      height:60px;
      border:5px solid #fecaca;
      border-top-color:#ef4444;
      border-radius:50%;
      animation:spin 1s linear infinite;
    }

    @keyframes spin{
      to{
        transform:rotate(360deg);
      }
    }

    h2{
      color:#0f172a;
      font-weight:800;
    }

  `]
})
export class OAuthSuccessComponent
implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      const token =
        params['token'];

      const phone =
        params['phone'];

      const role =
        params['role'];

      const name =
        params['name'];

      if (!token) {

        this.router.navigate([
          '/login'
        ]);

        return;
      }

      localStorage.setItem(
        'token',
        token
      );

      if (name) {

        localStorage.setItem(
          'oauthName',
          name
        );
      }

      const oauthRole =
        localStorage.getItem(
          'oauthRole'
        );

      localStorage.setItem(
        'role',
        oauthRole || role
      );

      if (
        !phone ||
        phone === 'null'
      ) {

        this.router.navigate([
          '/complete-profile'
        ]);

        return;
      }

      if (
        (oauthRole || role)
        === 'MECHANIC'
      ) {

        this.router.navigate([
          '/mechanic-dashboard'
        ]);

      } else {

        this.router.navigate([
          '/user-home'
        ]);
      }

    });
  }
}