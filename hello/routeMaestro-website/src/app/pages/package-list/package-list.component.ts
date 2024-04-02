import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { FlightBookingService } from 'src/app/Services/flight_booking/flight-booking.service';
import { FlightsService } from 'src/app/Services/flights_api/flights.service';
import { HotelsService } from 'src/app/Services/hotels_api/hotels.service';
import { HotelBookingService } from 'src/app/Services/hotels_booking/hotel-booking.service';
import { PackageService } from 'src/app/Services/package/package.service';
import { TransactionsService } from 'src/app/Services/transactions.service';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit {
  packageData:any;
  status:number;
  flightData:any;
  hotelData:any;

  allFlights:any
  allPackages:any
  allHotels:any


  isFlight:boolean=true;
  isHotel:boolean=false;
  isPackage:boolean=false;

  activeButton: string | null = null;

  constructor(private pack:PackageService,private router:Router,private hotelBook:HotelBookingService,private flights:FlightsService,private hotels:HotelsService,private flightBook:FlightBookingService,private transact:TransactionsService) { }

  ngOnInit(): void {
    this.getFlightsData()
    this.getHotelsData()
    this.getPackageData()
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

  highlightButton(button: string): void {
    this.activeButton = button;
    if(this.isFlight){
      this.filterFlights()
    }else if(this.isHotel){
      this.filterHotels()
    }
  }
  async getFlightsData(){
    try{
      const res=await this.flightBook.getAllFlightBookings();
      if(res){
        this.flightData=res
        this.allFlights=res
        
        console.log(res)
      }
      
      
    }catch(error){
      console.log(error)
    }
  }
  async getPackageData(){
    try{
      const res=await this.pack.getAllPackageBookings();
      if(res){
        this.packageData=res
        this.allPackages=res
        
        console.log(res)
      }
      
      
    }catch(error){
      console.log(error)
    }
  }
  async getHotelsData(){
    try{
      const res=await this.hotelBook.getAllHotelBookings();
      if(res){
        this.hotelData=res
        this.allPackages=res
        
        console.log(res)
      }
      
      
    }catch(error){
      console.log(error)
    }
  }


  // Flights
  getFlightName(flight:any){
    if(flight.trip.tripData.JourneyType!==2){
      const Origin=flight.trip.tripData.Segments[0].Origin;
      const Destination=flight.trip.tripData.Segments[flight.trip.tripData.Segments.length-1]?.Destination;
      return `${Origin}-${Destination}`
    }else {
      const Origin=flight.trip.tripData.Segments[0].Origin;
      const Destination=flight.trip.tripData.Segments[0]?.Destination;
      return `${Origin}-${Destination}`
    }
  }
  getFlightPrimaryName(flight:any){
    const name=flight.primary_details.name;
   
    return name;
  }
  getFlightPrimaryContact(flight:any){
    const name=flight.primary_details.phone;
   
    return name;
  }

  getFlightPaxLength(flight:any){
    const length=flight.passengers.length;
    return length;
  }
  getFlightStatus(flight:any){
    const status=flight.flight_details.status;
    return status;
  }


  async getTotalAmount(flight: any): Promise<number> {
    try {
        const res = await this.transact.getUserDetails(flight?.transactUid);
        const totalCost = res.totalCost;
        return totalCost;
    } catch (error) {
        console.log(error.message);
        throw error; // Re-throw the error to propagate it to the caller
    }
}


filterFlights(){
  if(this.activeButton==='Booked'){
    this.flightData.filter((flight)=>{
      flight.flight_details.status==='Booked'
    })
  }else if(this.activeButton==='Failed'){
    this.flightData.filter((flight)=>{
      flight.flight_details.status==='Failed'
    })
  }else if(this.activeButton==='BookedOther'){
    this.flightData.filter((flight)=>{
      flight.flight_details.status==='BookedOther'
    })
  }else if(this.activeButton==='NotConfirmed'){
    this.flightData.filter((flight)=>{
      flight.flight_details.status==='NotConfirmed'
    })
  }else {
    this.flightData=this.allFlights
  }

}


// hotels

getHotelName(hotel:any){
 return hotel?.hotel_details?.hotelName;
}
getHotelPrimaryName(hotel:any){
  const name=hotel.primary_details.name;
 
  return name;
}
getHotelPrimaryContact(hotel:any){
  const phone=hotel.primary_details.phone;
 
  return phone;
}

getHotelPaxLength(hotel:any){
  const length=hotel.passengers.length;
  return length;
}
getHotelStatus(hotel:any){
  const status=hotel?.hotel_details.status;
  return status;
}

filterHotels(){
  if(this.activeButton==='Booked'){
    this.hotelData.filter((flight)=>{
      flight.hotel_details.status==='Booked'
    })
  }else if(this.activeButton==='Failed'){
    this.hotelData.filter((hotel)=>{
      hotel.hotel_details.status==='Failed'
    })
  }else if(this.activeButton==='Cancelled'){
    this.hotelData.filter((hotel)=>{
      hotel.hotel_details.status==='Cancelled'
    })
  }else {
    this.hotelData=this.allHotels
  }

}

// package

getPackageName(flight:any){
  if(flight.trip.tripData.JourneyType!==2){
    const Origin=flight.trip.tripData.Segments[0].Origin;
    const Destination=flight.trip.tripData.Segments[flight.trip.tripData.Segments.length-1]?.Destination;
    return `${Origin}-${Destination}`
  }else {
    const Origin=flight.trip.tripData.Segments[0].Origin;
    const Destination=flight.trip.tripData.Segments[0]?.Destination;
    return `${Origin}-${Destination}`
  }
}
getPackagePrimaryName(flight:any){
  const name=flight.primary_details.name;
 
  return name;
}
getPackagePrimaryContact(flight:any){
  const name=flight.primary_details.phone;
 
  return name;
}

getPackagePaxLength(flight:any){
  const length=flight.passengers.length;
  return length;
}
getPackageStatus(flight:any){
  const status=flight.flight_details.status;
  return status;
}



 
// 0--> hotel , 1 --> flight , 2 --> package
  handleNavigation(uid:string,index:number){

    this.router.navigate([`/booking-details/${uid}/${index}`])
    }

    

  }


