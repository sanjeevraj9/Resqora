import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  testimonials = [
    {i:'R',name:'Rahul Sharma',role:'Customer, Delhi',text:'Flat tyre at midnight. Resqora came in 25 minutes and fixed it on the spot. Absolute lifesaver!',avatarClass:'a-red',starClass:'s-red'},
    {i:'P',name:'Priya Menon',role:'Customer, Bangalore',text:'Battery died on the highway. Mechanic arrived in 20 mins with jumpstart equipment. Super professional!',avatarClass:'a-blue',starClass:'s-blue'},
    {i:'A',name:'Ankit Patel',role:'Customer, Ahmedabad',text:'Dashcam installed at home in under 30 mins. Punctual, skilled technician. Great price!',avatarClass:'a-purple',starClass:'s-purple'},
    {i:'S',name:'Sneha Reddy',role:'Customer, Hyderabad',text:'Locked my keys inside. Resqora resolved it without any damage to my car. Wow service!',avatarClass:'a-teal',starClass:'s-red'},
    {i:'V',name:'Vijay Kumar',role:'Fleet Manager, Chennai',text:'Used Resqora fleet RSA for our company vehicles. Response time and professionalism is unmatched.',avatarClass:'a-orange',starClass:'s-blue'},
    {i:'M',name:'Mohan Das',role:'Customer, Mumbai',text:'Bike broke down late at night. Resqora found me via GPS in minutes and towed safely. 10/10!',avatarClass:'a-green',starClass:'s-purple'}
  ];
}
