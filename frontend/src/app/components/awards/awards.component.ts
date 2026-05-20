import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-awards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="awards">
      <div class="header">
        <span class="section-tag">Recognition</span>
        <h2 class="section-title">Awards & <span>Recognition</span></h2>
      </div>
      <div class="awards-grid">
        <div class="award-card" *ngFor="let a of awards" [class]="a.bgClass">
          <div class="icon">{{a.icon}}</div>
          <h4>{{a.title}}</h4>
          <p>{{a.desc}}</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .awards { background:linear-gradient(135deg,#fff8f8,#eff6ff); }
    .header { margin-bottom:48px; }
    .awards-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
    .award-card { background:var(--glass); backdrop-filter:blur(16px); border:1px solid var(--glass-border); border-radius:20px; padding:28px; text-align:center; transition:all .3s; &:hover{transform:translateY(-4px);box-shadow:var(--shadow-md)} }
    .aw-red:hover { border-color:rgba(232,36,42,0.3); }
    .aw-blue:hover { border-color:rgba(59,130,246,0.3); }
    .aw-green:hover { border-color:rgba(34,197,94,0.3); }
    .aw-purple:hover { border-color:rgba(139,92,246,0.3); }
    .icon { font-size:40px; margin-bottom:14px; }
    h4 { font-size:14px; font-weight:700; color:var(--text); margin-bottom:8px; }
    p { font-size:12px; color:var(--muted); line-height:1.5; }
    @media(max-width:900px){.awards-grid{grid-template-columns:1fr 1fr}}
    @media(max-width:500px){.awards-grid{grid-template-columns:1fr}}
  `]
})
export class AwardsComponent {
  awards = [
    {icon:'🏆',title:'Best Customer Experience 2025',desc:'Smart CX Summit & Awards, 7th Edition',bgClass:'award-card aw-red'},
    {icon:'🌱',title:'Best Go Green Initiative',desc:'EV & CNG sustainability programs',bgClass:'award-card aw-green'},
    {icon:'🌍',title:'Global Change Makers 2024',desc:"Transforming India's mobility ecosystem",bgClass:'award-card aw-blue'},
    {icon:'⚡',title:'Leader in Fleet Maintenance',desc:'Emobility+ India Fleet Show 2023',bgClass:'award-card aw-purple'}
  ];
}
