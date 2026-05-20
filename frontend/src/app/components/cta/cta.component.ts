import { Component } from '@angular/core';

@Component({
  selector: 'app-cta',
  standalone: true,
  template: `
    <div id="contact" class="cta-band">
      <div class="cta-blur1"></div>
      <div class="cta-blur2"></div>
      <div class="cta-inner">
        <h2>Stranded? We're<br/>Just a Call Away.</h2>
        <p>24/7 emergency roadside assistance across 19,100+ pincodes in India. Help arrives in minutes.</p>
        <div class="cta-btns">
          <a href="tel:+919525450138" class="btn-white">📞 Call-RESQORA Now</a>
          <a href="#pricing" class="btn-outline-white">View Plans →</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cta-band {
      background: linear-gradient(135deg, var(--primary) 0%, #c0181e 40%, var(--purple) 100%);
      padding: 80px 5%; text-align: center; position: relative; overflow: hidden;
    }
    .cta-blur1 { position:absolute; width:400px; height:400px; border-radius:50%; background:rgba(255,255,255,0.08); top:-100px; right:-80px; filter:blur(60px); }
    .cta-blur2 { position:absolute; width:300px; height:300px; border-radius:50%; background:rgba(255,255,255,0.06); bottom:-80px; left:-60px; filter:blur(40px); }
    .cta-inner { position:relative; z-index:1; }
    h2 { font-family:'Barlow Condensed',sans-serif; font-size:clamp(36px,5vw,64px); font-weight:900; text-transform:uppercase; color:#fff; margin-bottom:16px; line-height:1; }
    p { font-size:16px; color:rgba(255,255,255,0.82); margin-bottom:36px; }
    .cta-btns { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
    .btn-white { background:#fff; color:var(--primary); padding:15px 36px; border-radius:50px; font-size:15px; font-weight:800; text-decoration:none; transition:all .2s; box-shadow:0 6px 20px rgba(0,0,0,0.2); &:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,0.25)} }
    .btn-outline-white { border:2px solid rgba(255,255,255,0.5); color:#fff; padding:15px 36px; border-radius:50px; font-size:15px; font-weight:700; text-decoration:none; transition:all .2s; &:hover{border-color:#fff;background:rgba(255,255,255,0.1)} }
  `]
})
export class CtaComponent {}
