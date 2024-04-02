import { Component, OnInit,EventEmitter, Output, NgZone, ChangeDetectorRef } from '@angular/core';
import { FlightBookingService } from 'src/app/Services/flight_booking/flight-booking.service';


@Component({
  selector: 'app-reissue-travel-data',
  templateUrl: './reissue-travel-data.component.html',
  styleUrls: ['./reissue-travel-data.component.scss']
})
export class ReissueTravelDataComponent implements OnInit {
  currentIndex:number=0;
  flightData:any;
  travelers: any;
  currentTravellerCount:number=0;
  selectedCard: number = 0;
  isChild: boolean;
  

  // @Output() closeDialog: EventEmitter<any>=new EventEmitter<any>
  constructor(private flightBook:FlightBookingService,private zone: NgZone,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getFlightDetails()
  }

  dialogbox(){
    // this.closeDialog.emit()
  }

  async getFlightDetails(){
    try{
      const res=await this.flightBook.getAllDetails(localStorage.getItem('uid'))
      console.log(res)
      this.flightData=res
      this.travelers=this.flightData?.passengers
    }catch(error){
      console.log(error)
    }
  }
  handleCardClick(index: number) {
    console.log('Before update:', this.currentIndex);
       
    this.zone.run(() => {
      // this.editIndex=index;
      this.currentIndex = index;
      console.log(this.currentIndex)
      this.selectedCard = index;
      this.cdr.detectChanges();
      this.travelers[this.currentIndex];
    })
  }

  getArray(length: number): any[] {
    return new Array(length);
  }

  adult(){
    this.isChild=false
  }
  child(){
    this.isChild=true
  }
}
