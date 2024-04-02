

import { Component, OnInit, Output ,EventEmitter } from '@angular/core';
import axios from 'axios'
import { PackageService } from 'src/app/Services/package/package.service';
import { hotel_details } from '../package-cancellation/hotel_details';
import { flightSegments } from './flightSegments';
import { HotelsService } from 'src/app/Services/hotels_api/hotels.service';
import { FlightsService } from 'src/app/Services/flights_api/flights.service';
import { HotelBookingService } from 'src/app/Services/hotels_booking/hotel-booking.service';
import { FlightBookingService } from 'src/app/Services/flight_booking/flight-booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel-package',
  templateUrl: './cancel-package.component.html',
  styleUrls: ['./cancel-package.component.scss']
})
export class CancelPackageComponent implements OnInit {
  selectedRequestType: string = '';
  selectedCancellationType: string = '';
  selectedSectors: string[] = [];
  remarks: string = '';
  isPartial: boolean = false;
  travelData:any;
  hotelData=hotel_details;
  cities=[]

  @Output() cancelDialog: EventEmitter<any> = new EventEmitter<any>();
  sectors=[];
  sectorArray=[]
  cancelledHotels=[];
  hotelSet=[]
  hotelDetails: import("@angular/fire/firestore").DocumentData;
  selectedDate: string; 
   
  constructor(private pack:PackageService,private router: Router,private hotelBook:HotelBookingService,private hotels:HotelsService,private flights:FlightsService,private flightBook:FlightBookingService) { 
    this.selectedDate=''
  }

  ngOnInit(): void {
    // this.getData()
    // this.getHotelDetails()
    this.getFlightDetails()
    console.log(this.cities)
    console.log(this.hotelData)
  }

  // for flight reissuance
  async handleReissuance(){
    await this.authenticateFlightApi()
    this.router.navigate([`/reissue/${this.selectedDate}`]);
  }

  // close dialog box
  handleClose(){
    this.cancelDialog.emit(false)
  }

  onDateChange(): void {
    // Handle date change here
    console.log('New value of selectedDate:', this.selectedDate);
  }

  // authenticate token
  authenticateFlightApi() {
    this.flights.authenticate().subscribe(
      (data: { token: string }) => {
        console.log(data.token);
        localStorage.setItem("authenticateToken", data.token);
      //  this.singleHotelCancel(data.token)
      this.singleFlightCancel(data.token)
      // this.singlePartialFlightCancel(data.token)
        
      },
      (err) => {
        console.log(err, "error aa gya");
      }
    );
  }

  // to check if the cancellation is full or partail
  onRequestTypeChange() {
    this.isPartial = this.selectedRequestType === '2' ?true :false;
    console.log(this.isPartial)
  }

  // update the hotel arrays w.r.t to the 
  updateHotelsArray(sector: any, isChecked: boolean) {
    const index = this.sectorArray.findIndex(s => s.Destination === sector.Destination && s.Origin === sector.Origin);
  
    if (index !== -1) {
      if (isChecked) {
        this.hotelSet.push(sector);
      } else {
        // Remove the sector from the array
        const hotelIndex = this.hotelSet.findIndex(s => s.hotelName === sector.hotelName && s.cityName === sector.cityName);
        if (hotelIndex !== -1) {
          this.hotelSet.splice(hotelIndex, 1);
        }
      }
    }
    console.log(this.hotelSet);
  }
  
  updateSectorArray(sector: any, isChecked: boolean) {
    if (isChecked) {
      this.sectorArray.push(sector);
      for (const hotelArray of Object.values(this.hotelData)) {
        if (hotelArray[0].cityName === sector.cityName) {
          this.cancelledHotels.push({ hotelName: hotelArray[0].search.HotelName, cityName: sector.cityName, Origin: sector.Origin, Destination: sector.Destination });
      
        }
      }
    } else {
      // Remove the sector from the array
      const index = this.sectorArray.findIndex(s => s.Destination === sector.Destination && s.Origin === sector.Origin);
      if (index !== -1) {
        this.sectorArray.splice(index, 1);
  
        for (const hotelArray of Object.values(this.hotelData)) {
          if (hotelArray[0].cityName === sector.cityName) {
            const cancelIndex = this.cancelledHotels.findIndex(s => s.hotelName === hotelArray[0].search.HotelName && s.cityName === sector.cityName);
            const hotelIndex = this.hotelSet.findIndex(s => s.hotelName === hotelArray[0].search.HotelName && s.cityName === sector.cityName);
            if (hotelIndex !== -1) {
              this.hotelSet.splice(hotelIndex, 1); // Remove from hotelSet
             
            }
            if(cancelIndex!== -1){
              this.cancelledHotels.splice(cancelIndex,1)
            }
          }
        }
      }
    }
    console.log(this.sectorArray);
    console.log(this.cancelledHotels);
    console.log(this.hotelSet);
  }
  
  

  
  

  onCancelClick() {
    console.log('Request Type:', this.selectedRequestType);
    console.log('Cancellation Type:', this.selectedCancellationType);

    console.log('Remarks:', this.remarks);

    if(this.isPartial){
      this.partialFlightCancellation()
      this.partialHotelCancellation()

    }else{
      this.flightCancellation()
      this.hotelCancellation()
    }
  }

  
  async hotelCancellation(){
    const payload={
      token:localStorage.getItem('authenticateToken'),
      requestType:this.selectedRequestType,
      remarks:this.remarks
    }
    console.log(payload)
    try{
      const data=await this.hotels.hotelCancellation(this.remarks)
      if(data){
        console.log(data)
      }
    }catch(error){
      console.log('something went wrong ',error.message)
    }
  }

  async partialHotelCancellation(){
    
    try{
      const {data}=await this.hotels.partialHotelCancellation(this.remarks,this.hotelSet)
      if(data){
        console.log(data)
      }
    }catch(error){
      console.log('something went wrong ',error.message)
    }

  }

  async flightCancellation(){
    const payload={
      flightToken:localStorage.getItem('authenticateToken'),
      requestType:this.selectedRequestType,
      remarks:this.remarks,
      cancellationType:this.selectedCancellationType
    }
    console.log(payload)
    try{
      const {data}=await this.flights.flightCancellation(this.selectedRequestType,this.remarks,this.selectedCancellationType)
      if(data){
        console.log(data)
      }
    }catch(error){
      console.log('something went wrong ',error.message)
    }
  }

  async partialFlightCancellation(){
    const payload={
      flightToken:localStorage.getItem('authenticateToken'),
      requestType:this.selectedRequestType,
      remarks:this.remarks,
      cancellationType:this.selectedCancellationType,
      sectors:this.sectorArray
    }
    console.log(payload)
    try{
      const {data}=await this.flights.partialFlightCancellation(this.selectedRequestType,this.remarks,this.selectedCancellationType,this.sectorArray)
      if(data){
        console.log(data)
      }
    }catch(error){
      console.log('something went wrong ',error.message)
    }

  }
 
  // async getData(){
  //   try {
  //     const res = await this.pack.getAllData();
  //     console.log(res);
  //     if(res){
  //       this.travelData=flightSegments.segments;
  //       this.travelData.map((item)=>{
  //         item.map((sectors)=>{
  //           this.cities.push({Origin:sectors.Origin.Airport.AirportCode,Destination:sectors.Destination.Airport.AirportCode,cityName:sectors.Destination.Airport.CityName})
  //         })
  //       })
  //       // this.cities.push({cityCode:this.travelData.trip.departure_airport,cityName:this.travelData.trip.departureCity})
  //       // for(let item of this.travelData.cities){
  //       //   this.cities.push({cityCode:item.cityCode,cityName:item.cityName})
  //       // }
  //       // this.cities.push({cityCode:this.travelData.trip.departure_airport,cityName:this.travelData.trip.departureCity})
  //       console.log(this.cities)
  //       // this.sectorsArrange()
  //       this.sectors=this.cities
  //     }
  //   }catch(error){
  //     console.log(error.message)
  //   }
  // }

  async getFlightDetails(){
    try{
      const res=await this.flightBook.getFlightDetails(localStorage.getItem('uid'))
      console.log(res)
      this.travelData=res
      this.travelData.segments.map((item)=>{
        item.map((sectors)=>{
        this.cities.push({Origin:sectors.Origin.Airport.AirportCode,Destination:sectors.Destination.Airport.AirportCode,cityName:sectors.Destination.Airport.CityName})
        })
      })

      console.log(this.cities)
      this.sectors=this.cities
    }catch(error){
      console.log(error.message)
    }
  }
  sectorsArrange(){
    for(let i=0;i<this.cities.length-1;i++){
      this.sectors.push({Origin:this.cities[i].cityCode,Destination:this.cities[i+1].cityCode,cityName:this.cities[i+1].cityName})
    }
    console.log(this.sectors)
  }


  async getHotelDetails(){
    try{
      const res=await this.hotelBook.getAllDetails(localStorage.getItem('hotel_uid'));
      console.log(res)
      this.hotelDetails=res;
    }catch(error){
      console.log(error.message)
    }
  }

  async singleHotelCancel(token:string){
    const payload={
      token:token,
      requestType:1,
      remarks:this.remarks,
      collection:'hotel_bookings',
      uid:localStorage.getItem('hotel_uid')

    }
    try{
      const res=await axios.post('http://localhost:4000/hotel/singleSendChangeRequest',payload);
      console.log(res)
      await this.singleHotelChangeRequestId(token)
    }catch(error){
      console.log(error.message)
    }
  }

  async singleHotelChangeRequestId(token){
    const payload={
      token:token,
      
      collection:'hotel_bookings',
      uid:localStorage.getItem('hotel_uid')

    }
    try{
      const res=await axios.post('http://localhost:4000/hotel/singleGetChangeRequest',payload);
      console.log(res)
    }catch(error){
      console.log(error.message)
    }
  }
  async singleFlightCancel(token:string){
    const payload={
      flightToken:token,
      requestType:this.selectedRequestType,
      remarks:this.remarks,
      cancellationType:this.selectedCancellationType,
      collection:'flight_bookings',
      uid:localStorage.getItem('uid')

    }
    try{
      const res=await axios.post('http://localhost:4000/flight/singleSendChangeRequest',payload);
      console.log(res)
      await this.singleFlightChangeRequestId(token)
    }catch(error){
      console.log(error.message)
    }
  }
  async singlePartialFlightCancel(token:string){
    const payload={
      flightToken:token,
      requestType:this.selectedRequestType,
      remarks:this.remarks,
      cancellationType:this.selectedCancellationType,
      sectors:this.sectorArray,
      collection:'flight_bookings',
      uid:localStorage.getItem('uid')

    }
    console.log(payload)
    try{
      const res=await axios.post('http://localhost:4000/flight/singleSendChangeRequestPartial',payload);
      console.log(res)
      await this.singleFlightChangeRequestId(token)
    }catch(error){
      console.log(error.message)
    }
  }

  async singleFlightChangeRequestId(token){
    const payload={
      flightToken:token,
      collection:'flight_bookings',
      uid:localStorage.getItem('uid')

    }
    try{
      const res=await axios.post('http://localhost:4000/flight/getChangeRequest',payload);
      console.log(res)
    }catch(error){
      console.log(error.message)
    }
  }
}
