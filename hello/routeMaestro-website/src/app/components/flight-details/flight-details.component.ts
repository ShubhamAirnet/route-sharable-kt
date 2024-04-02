import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss']
})
export class FlightDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  currentButton:string="flightDetailsAndLayover"

    showInfo(buttonId:string){
     console.log( this.currentButton); 
      return this.currentButton=buttonId;
    }


}
