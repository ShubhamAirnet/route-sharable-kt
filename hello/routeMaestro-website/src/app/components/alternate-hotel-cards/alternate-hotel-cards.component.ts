import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-alternate-hotel-cards',
  templateUrl: './alternate-hotel-cards.component.html',
  styleUrls: ['./alternate-hotel-cards.component.scss']
})
export class AlternateHotelCardsComponent implements OnInit {
  @Input() hotel:any;
  @Input() checkOutDate:any;
  @Input() cityName:any;
  @Input() RoomGuests:any;
  @Input() nationality:any;
  @Input() countryCode:any;
  @Input() cityId:any;

  selectedHotel: any = null;

  charge1:number=0
  charge2:number=0
  charge3:number=0;
  isHotelInfo = false;

 

  incentiveCharge:number=0
  totalCharge:number=0
  constructor() { 
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("HotelCardsComponent ngOnChanges", changes);
    // console.log(this.hotel)
    // console.log(this.RoomGuests)

    // You can add logic here to handle input changes if needed
  }
  ngOnInit(): void {
    // console.log('fetching')
    // console.log(this.hotel)
  }


  // to show hotel info
  showHotelInfo() {
    this.isHotelInfo = !this.isHotelInfo;
  }

  // get the selected rooms from the hotel info
  gotFinalRoomsArr(finalRoomsArr) {
    console.log(finalRoomsArr);

    let checkInAsUid = finalRoomsArr[0].checkInDate;

    
  }
  
  // when a hotel card is selected 
  isSelectedHotel(hotel: any): boolean {
    return this.selectedHotel === hotel;
  }

  // Function to handle hotel selection
  selectHotel(hotel: any): void {
    if (this.isSelectedHotel(hotel)) {
      // If already selected, deselect
      this.selectedHotel = null;
    } else {
      // If not selected, select
      this.selectedHotel = hotel;
    }
  }


  // convert number into array
getStarArray(rating: number): any[] {
  return Array(rating).fill(0);
}
}
