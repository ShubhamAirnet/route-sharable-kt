import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightBookingService } from 'src/app/Services/flight_booking/flight-booking.service';
import { FlightsService } from 'src/app/Services/flights_api/flights.service';
import { HotelsService } from 'src/app/Services/hotels_api/hotels.service';
import { HotelBookingService } from 'src/app/Services/hotels_booking/hotel-booking.service';
import { PackageService } from 'src/app/Services/package/package.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {
  uid:string;
  index:string;
  travelData:any;
  tripDetails:any;

  
  isFlight:boolean=true;
  isHotel:boolean=false;
  isPackage:boolean=false;

  constructor(private hotels:HotelsService,private flights:FlightsService,private route:ActivatedRoute,private hotelBook:HotelBookingService,private flightBook:FlightBookingService,private pack:PackageService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Get the uid parameter from the URL
      this.uid = params['uid'];
      console.log('UID:', this.uid);
      this.index = params['id'];
      console.log('UID:', this.index);
  });
 
// 0--> hotel , 1 --> flight , 2 --> package
  if(this.index==='0'){
    this.getDataFromDB(this.uid,this.index)
    this.getHotelBookingDetails(this.uid)
  }else if(this.index==='1'){
    this.getDataFromDB(this.uid,this.index)

    this.getFlightBookingDetails(this.uid)
  }else if(this.index==='2'){
    this.getDataFromDB(this.uid,this.index)

    console.log('package has been called')
  }
  }

  toggle(value:string){
    if(value==='flights'){
      this.isFlight=true;
      this.isHotel=false;
      this.isPackage=false
    }else if(value==='hotels'){
      this.isFlight=false;
      this.isHotel=true;
      this.isPackage=false
    
    }else if(value==='packages'){
      this.isFlight=false;
      this.isHotel=false;
      this.isPackage=true
    }
  }


  async getDataFromDB(uid:string,index:string){
    try{
      let res;
      if(index==='0'){
        res=await this.hotelBook.getAllDetails(uid)

      }else if(index==='1'){
        res=await this.flightBook.getAllDetails(uid)
      }else if(index==='2'){
        res=await this.pack.getAllData(uid)
      }
      console.log(res)
      this.travelData=res
    }catch(error){
      console.log(error.message)
    }
  }

  async getFlightBookingDetails(uid:string){
    console.log(uid)
    const payload={
      flightToken:localStorage.getItem('authenticateToken'),
      uid:uid,
      collection:'flight_bookings'
    }
    try{
      const data=await this.flights.getFlightBookingDetails(payload)
      console.log(data)
      this.tripDetails=data
    }catch(error){
      console.log(error.message)
    }
  }

  async getHotelBookingDetails(uid:string){
    const payload={
      token:localStorage.getItem('authenticateToken'),
      uid:uid,
      collection:'hotel_bookings'
    }
    try{
      const res=await this.hotels.hotelBookingDetails(payload);
      console.log(res)
      this.tripDetails=res
    }catch(error){
      console.log(error.message)
    }
  }
}
