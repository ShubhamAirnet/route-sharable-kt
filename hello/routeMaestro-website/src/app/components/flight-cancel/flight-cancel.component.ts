import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-cancel',
  templateUrl: './flight-cancel.component.html',
  styleUrls: ['./flight-cancel.component.scss']
})
export class FlightCancelComponent implements OnInit {


  @Input() fareRule:any;
  @Input() fareRule1:any;
  @Input() fareRule2:any;
  constructor() { }

  ngOnInit(): void {
  }

}
