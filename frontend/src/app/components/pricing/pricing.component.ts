import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent {
  plans = [
    {
      name:'Basic', price:'₹299', period:'/year', badge:'', popular:false,
      desc:'Perfect for occasional drivers needing essential coverage.',
      checkClass:'check-blue', ctaClass:'cta-outline',
      cta:'Get Basic',
      features:['3 Roadside Assistance Calls','Towing up to 20 km','Battery Jumpstart','Flat Tyre Repair','24/7 Helpline Access','Mobile App Access']
    },
    {
      name:'Pro', price:'₹599', period:'/year', badge:'🔥 Most Popular', popular:true,
      desc:'For daily commuters who need reliable full-year protection.',
      checkClass:'check-red', ctaClass:'cta-gradient-red',
      cta:'Get Pro',
      features:['8 Roadside Assistance Calls','Towing up to 50 km','Flat Tyre Repair & Replace','Fuel Delivery (2 times)','Key Lockout Assistance','Accident Recovery Support','Live GPS Tracking','Priority Response']
    },
    {
      name:'Elite', price:'₹1,499', period:'/year', badge:'⭐ Best Value', popular:false,
      desc:'Unlimited peace of mind for you and your family fleet.',
      checkClass:'check-purple', ctaClass:'cta-gradient-blue',
      cta:'Get Elite',
      features:['Unlimited Assistance Calls','Towing up to 100 km','All Pro Features','On-Spot Minor Repairs','Doorstep Services','Family Plan (2 vehicles)','Dedicated Account Manager','EV Specialist Access']
    }
  ];
}
