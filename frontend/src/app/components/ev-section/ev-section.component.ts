import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ev-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="ev" class="ev">
      <div class="ev-inner">
        <div class="ev-content">
          <span class="section-tag" style="color:var(--teal)">EV Innovation</span>
          <h2 class="section-title">Electrifying The<br/><span style="color:var(--teal)">Future</span> of Mobility</h2>
          <p class="section-desc">Resqora leads India's EV revolution with specialized repair, roadside support, and a growing network of EV-certified mechanics.</p>
          <div class="ev-stats">
            <div class="ev-stat" *ngFor="let s of evStats">
              <span class="num">{{s.num}}</span>
              <span class="lbl">{{s.lbl}}</span>
            </div>
          </div>
          <a href="#contact" class="btn-teal" style="margin-top:28px;display:inline-flex">⚡ Book EV Service</a>
        </div>
        <div class="ev-visual">
          <div class="ev-ring"></div>
          <div class="ev-icon">⚡</div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .ev { background:linear-gradient(135deg,#f0fdf4,#ecfeff); border-top:1px solid rgba(20,184,166,0.1); border-bottom:1px solid rgba(20,184,166,0.1); }
    .ev-inner { display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; }
    .ev-stats { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:28px; }
    .ev-stat { background:rgba(255,255,255,0.7); backdrop-filter:blur(12px); border:1px solid rgba(20,184,166,0.15); border-radius:14px; padding:18px 20px; display:flex; flex-direction:column; gap:4px; }
    .num { font-family:'Barlow Condensed',sans-serif; font-size:28px; font-weight:900; color:var(--teal); line-height:1; }
    .lbl { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:.8px; }
    .ev-visual { display:flex; align-items:center; justify-content:center; position:relative; aspect-ratio:1; max-width:360px; margin:0 auto; }
    .ev-ring { position:absolute; width:100%; height:100%; border-radius:50%; border:1px solid rgba(20,184,166,0.2); animation:evSpin 15s linear infinite; }
    .ev-ring::before { content:''; position:absolute; top:-5px; left:50%; width:10px; height:10px; border-radius:50%; background:var(--teal); transform:translateX(-50%); box-shadow:0 0 12px rgba(20,184,166,0.6); }
    .ev-icon { font-size:100px; position:relative; z-index:2; filter:drop-shadow(0 0 30px rgba(20,184,166,0.3)); animation:evPulse 2s ease-in-out infinite; }
    @keyframes evSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes evPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
    @media(max-width:900px){.ev-inner{grid-template-columns:1fr}.ev-visual{display:none}}
  `]
})
export class EvSectionComponent {
  evStats = [
    {num:'1L+',lbl:'EVs Serviced'},{num:'500+',lbl:'EV Specialists'},
    {num:'4.9★',lbl:'EV Rating'},{num:'24/7',lbl:'EV Helpline'}
  ];
}
