import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlansService } from 'src/app/Services/plans/plans.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  NavigateToContact(){
    this.router.navigate(['/contact-us']);
  }

  constructor(private router:Router,private plans:PlansService) {
    
   }

  ngOnInit(): void {

   
  }

}
