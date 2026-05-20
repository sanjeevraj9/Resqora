import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services = [
    { icon:'🏗️', title:'Towing Service', desc:'Fastest bike & car towing via flatbed or lifting. Safe, reliable, 24/7. No hidden charges.', iconClass:'icon-red', linkClass:'link-red' },
    { icon:'🔧', title:'Flat Tyre Repair', desc:'On-the-spot tyre repair and replacement at your exact location within minutes.', iconClass:'icon-blue', linkClass:'link-blue' },
    { icon:'🔋', title:'Battery Jumpstart', desc:'Quick jumpstart by certified mechanics. Dead battery? We bring your vehicle back to life.', iconClass:'icon-purple', linkClass:'link-purple' },
    { icon:'⛽', title:'Fuel Delivery', desc:'Run out of fuel? Emergency fuel delivered to your precise GPS location 24/7.', iconClass:'icon-teal', linkClass:'link-teal' },
    { icon:'🔑', title:'Key Lockout Help', desc:'Locked your keys inside? Our specialists arrive swiftly without causing any damage.', iconClass:'icon-orange', linkClass:'link-orange' },
    { icon:'📹', title:'Dashcam Installation', desc:'Doorstep dashcam installation by expert technicians. All brands supported.', iconClass:'icon-green', linkClass:'link-green' },
    { icon:'🚑', title:'Accident Recovery', desc:'24/7 rapid response accident recovery with insurance coordination support.', iconClass:'icon-red', linkClass:'link-red' },
    { icon:'🔩', title:'On-Spot Repairs', desc:'Minor engine, brake, or starting issues? Certified mechanics fix it right there.', iconClass:'icon-blue', linkClass:'link-blue' }
  ];
}
