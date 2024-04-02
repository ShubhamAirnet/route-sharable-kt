import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-flight-header',
  templateUrl: './flight-header.component.html',
  styleUrls: ['./flight-header.component.scss']
})
export class FlightHeaderComponent implements OnInit {
  response:any;
  @Input() trips:any;
  @Input() calendarFare:any;
  @Input() adults:any;
  @Input() child:any;
  @Input() infants:any;
  @Input() fareType:any;
  @Output() responseData: EventEmitter<any> = new EventEmitter<any>();

  localStorageData:any;
  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
    console.log(this.trips)
    console.log(this.calendarFare)
    
  }
  formatSingleDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month},${year}`;
}


  formatDateString(inputDate: string): string {
    const dateObject = new Date(inputDate);
    return this.datePipe.transform(dateObject, 'MM-dd-yy');
  }

  formatDateString2(inputDate: string): string {
    const dateObject = new Date(inputDate);
    return this.datePipe.transform(dateObject, 'yyyy-MM-dd');
  }

  async handleClick(item:any,Origin:string,Destination:string){
    const payload={
      TokenId: localStorage.getItem('authenticateToken'),
      AdultCount:this.adults,
      ChildCount: this.child,
      InfantCount:this.infants,
    
      ResultFareType: this.fareType,
      JourneyType: 1,
      Segments: [
        {
          Origin: Origin,
          Destination: Destination,
          FlightCabinClass: '1',
          PreferredDepartureTime: this.formatDateString2(item?.DepartureDate),
          PreferredArrivalTime: this.formatDateString2(item?.DepartureDate),
        },
      ],
      Sources: null,
    }

    try{
      const res=await axios.post('http://localhost:4000/flight/searchflight',payload);
      console.log(res);
      this.response=res.data;
      
      this.responseData.emit(this.response)
    }catch(error){
      console.log(error.message)
    }
  }
}
