import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coverage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="coverage" class="coverage">
      <div class="header">
        <span class="section-tag">Pan-India Network</span>
        <h2 class="section-title">Covering Every <span>Corner of India</span></h2>
        <p class="section-desc" style="margin:0 auto">From metros to tier-3 cities, Resqora's service network reaches you wherever you're stranded.</p>
      </div>
      <div class="coverage-map">
        <div class="map-bg">🗺️</div>
        <div class="pins">
          <span class="pin" *ngFor="let city of cities">📍 {{city}}</span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .coverage { background:linear-gradient(135deg,#eff6ff,#faf5ff); text-align:center; }
    .header { margin-bottom:48px; }
    .coverage-map { max-width:760px; margin:0 auto; background:var(--glass); backdrop-filter:blur(20px); border:1px solid var(--glass-border); border-radius:24px; padding:48px 32px; position:relative; overflow:hidden; box-shadow:var(--shadow-md); }
    .map-bg { position:absolute; font-size:260px; opacity:.04; top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none; user-select:none; }
    .pins { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; position:relative; z-index:1; }
    .pin { background:rgba(255,255,255,0.8); border:1px solid var(--light2); border-radius:100px; padding:7px 16px; font-size:13px; font-weight:500; color:var(--text2); transition:all .2s; cursor:default; &:hover{background:var(--primary);color:#fff;border-color:var(--primary);transform:translateY(-2px)} }
  `]
})
export class CoverageComponent {
  cities = ['Mumbai','Delhi','Bangalore','Chennai','Hyderabad','Pune','Kolkata','Ahmedabad','Jaipur','Lucknow','Bhopal','Indore','Nagpur','Surat','Chandigarh','Kochi','+ 19,000 more pincodes'];
}
