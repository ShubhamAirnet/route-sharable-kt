import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotel-cancel',
  templateUrl: './hotel-cancel.component.html',
  styleUrls: ['./hotel-cancel.component.scss']
})
export class HotelCancelComponent implements OnInit {
  @Input() hotelData:any;
  constructor() { }

  ngOnInit(): void {
    console.log(this.hotelData)
  }

}
