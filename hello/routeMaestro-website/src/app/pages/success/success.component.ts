import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionsService } from 'src/app/Services/transactions.service';
import axios from 'axios';
import { FlightBookingService } from 'src/app/Services/flight_booking/flight-booking.service';
import { DatePipe } from '@angular/common';
import { HotelBookingService } from 'src/app/Services/hotels_booking/hotel-booking.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HotelsService } from 'src/app/Services/hotels_api/hotels.service';
import { FlightsService } from 'src/app/Services/flights_api/flights.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  form:any | null=null;
  id:string='';
 resultIndex:string;
 resultIndex1:string;
 resultIndex2:string;
  traceId:any;
  isLCC:boolean;
  isLCC1:boolean;
  isLCC2:boolean;
  journeyType:number;
  token:string;
  localStorageData:any;
  fareQuote:any;

  uid:string;
  

  sectionStates: { [key: string]: boolean } = {
    flightDetails: true, // Default open state
    hotelDetails: false,
    travellers: false,
    contactInfo: false,
    ssr:false
  };
  fareQuote1: any;
  fareQuote2: any;
  flightData:any;
  flightBookingDetails:any=null;
  flightTicketDetails:any=null;

  isFlight:string;

  hotelData:any=null;

  primaryInfo:any;
  segments:any;
  totalCost: any;
  flightCost: any;
  hotelCost: any;
  taxes: any;
  otherCharges: any;
  isCancel: boolean;
  flightResponse: import("@angular/fire/firestore").DocumentData;
  constructor(private route: ActivatedRoute,private flights:FlightsService,private spinner:NgxSpinnerService,private hotels:HotelsService,private hotelBook:HotelBookingService,private datePipe: DatePipe,private transact:TransactionsService,private flightBook:FlightBookingService) { }

  async ngOnInit(): Promise<void>  {
    this.getPaymentInfo()
  
    this.id = this.route.snapshot.paramMap.get('id');
    this.isFlight = this.route.snapshot.paramMap.get('isFlight');
    // console.log(this.id);

    this.token = localStorage.getItem('authenticateToken');
    
   if(this.isFlight==='1'){
    this.localStorageData = sessionStorage.getItem('key'); // Fix here
    this.resultIndex=JSON.parse(this.localStorageData).resultIndex
    this.isLCC = JSON.parse(this.localStorageData).isLCC;
    this.traceId =JSON.parse(this.localStorageData).traceId;
    this.journeyType=JSON.parse(this.localStorageData).journeyType;
    this.uid=sessionStorage.getItem('uid')
    this.getFlightDetails()
    this.storeTransactionUidFlight(sessionStorage.getItem('uid'),sessionStorage.getItem('transact'))
    this.getSegmentDetails()
    // this.uid=this.id
    if(this.journeyType===2){
      this.spinner.show()
      this.resultIndex1=JSON.parse(this.localStorageData).resultIndex1
      this.resultIndex2=JSON.parse(this.localStorageData).resultIndex2
      this.isLCC1=JSON.parse(this.localStorageData).isLCC1
      this.isLCC2=JSON.parse(this.localStorageData).isLCC2
      await this.getFareQuote1(this.resultIndex1)
      await this.getFareQuote2(this.resultIndex2)
      this.spinner.hide()
    }else {
      this.spinner.show()
      this.resultIndex=JSON.parse(this.localStorageData).resultIndex
      this.isLCC=JSON.parse(this.localStorageData).isLCC;
      await this.getFareQuote(this.resultIndex)
      this.spinner.hide()
    }
   }else if(this.isFlight==='0'){
    this.spinner.show()
    this.sectionStates.hotelDetails=true
    this.sectionStates.flightDetails=false
    await this.storeTransactionUidHotel(sessionStorage.getItem('hotel_uid'),sessionStorage.getItem('transact'))
    await this.hotelBooking()
    
    this.spinner.hide()
   }
    
    console.log(this.localStorageData);
}
transformDate(dateString: string): string {
  return this.datePipe.transform(dateString, 'yyyy-MM-dd');
}
async storeTransactionUidFlight(uid:string,transactuid:string){
  try{
    const res=await this.flightBook.storeTransactId(uid,transactuid)
    console.log(res)
  }catch(error){
    console.log(error.message)
  }
}
async storeTransactionUidHotel(uid:string,transactuid:string){
  try{
    const res=await this.hotelBook.storeTransactId(uid,transactuid)
    console.log(res)
  }catch(error){
    console.log(error.message)
  }
}

  async getFareQuote(resultIndex:string){
    // try{
      const res=await this.flightBook.getFareQuote(this.uid);
      console.log(res)
      this.fareQuote=res;
      if(this.isLCC){
        this.flightBookingDetails= await this.ticketLCC('flight_bookings',resultIndex,this.fareQuote,this.flightData?.segments[0][0]?.Origin?.Airport?.CityCode,this.flightData?.segments[0][this.flightData?.segments[0]?.length-1].Destination?.Airport?.CityCode,0)
      }else{
        this.flightBookingDetails=await this.FlightBook('flight_bookings',resultIndex,this.fareQuote,this.flightData?.segments[0][0]?.Origin?.Airport?.CityCode,this.flightData?.segments[0][this.flightData?.segments[0]?.length-1].Destination?.Airport?.CityCode,0)
      }
      console.log(this.flightBookingDetails)

    // }catch(error){
    //   console.log(error.message)
    // }

  }
  async getFareQuote1(resultIndex:string){
    // try{
      const res=await this.flightBook.getFareQuote1(this.uid);
      console.log(res)
      
      this.fareQuote1=res;
      if(this.isLCC1){
         await this.ticketLCC('flight_bookings', resultIndex,this.fareQuote1,this.flightData?.segments1[0][0]?.Origin?.Airport?.CityCode,this.flightData?.segments1[0][this.flightData?.segments1[0]?.length-1].Destination?.Airport?.CityCode,1)
      }else{
        await this.FlightBook('flight_bookings',resultIndex,this.fareQuote1,this.flightData?.segments1[0][0]?.Origin?.Airport?.CityCode,this.flightData?.segments1[0][this.flightData?.segments1[0]?.length-1].Destination?.Airport?.CityCode,1)
      }
     
    // }catch(error){
    //   console.log(error.message)
    // }

  }
  async getFareQuote2(resultIndex:string){
    // try{
      const res=await this.flightBook.getFareQuote2(this.uid);
      console.log(res)
      this.fareQuote2=res;
      if(this.isLCC2){
         await this.ticketLCC('flight_bookings',resultIndex,this.fareQuote2,this.flightData?.segments2[0][0]?.Origin?.Airport?.CityCode,this.flightData?.segments2[0][this.flightData?.segments2[0]?.length-1].Destination?.Airport?.CityCode,2)
      }else{
        await this.FlightBook('flight_bookings',resultIndex,this.fareQuote2,this.flightData?.segments2[0][0]?.Origin?.Airport?.CityCode,this.flightData?.segments2[0][this.flightData?.segments2[0]?.length-1].Destination?.Airport?.CityCode,2)
      }
      

    // }catch(error){
    //   console.log(error.message)
    // }

  }
 

  async getFlightDetails(){
    try{
      const res=await this.flightBook.getFlightDetails(this.uid);
      console.log(res)
      this.flightData=res
      console.log(this.flightData.segments[0])
      console.log(this.flightData.segments[0][0])
      console.log(this.flightData.segments[0][0].Origin.Airport.CityCode)
      console.log(this.flightData.segments[0].length)
      console.log(this.flightData.segments[0][this.flightData.segments[0].length-1].Destination.Airport.CityCode)
    }catch(error){
      console.log(error.message)
    }
  }
  toggleSection(sectionId: string) {
    console.log(sectionId)
    this.sectionStates[sectionId] = !this.sectionStates[sectionId];
  }

  async hotelBooking(){
    const payload={
      token:this.token,
      uid:sessionStorage.getItem('hotel_uid'),
      collection:'hotel_bookings',
      traceId:sessionStorage.getItem('hotel_traceId'),
      voucher:true
    }

    try{
      const res=await this.hotels.singleHotelBookRoom(payload);
      console.log(res)
      await this.getAllHotelDetails()
    }catch(error){
      console.log('something went wrong',error.message)
      // await this.getAllHotelDetails()
    }
  }
  async FlightBook(collection:string,resultIndex:string,fareQuote:any,Origin:string,Destination:string,ssr:number){
    const payload={
      flightToken:this.token,
      traceId:this.traceId,
      resultIndex:resultIndex,
      fareQuote:fareQuote,
      uid:this.uid,
      Origin:Origin,
      Destination:Destination,
      ssr:ssr,
      collection:collection
    }
    console.log(payload)
    try{
      const res=await this.flights.flightBooking(payload);
      if(res){
        console.log(res);
        const tickets=await this.ticketNonLCC(collection,Origin,Destination)
        await this.getAllFlightDetails()
        return ({res,tickets})

      }
    }catch(error){
      console.log('something went wrong',error.message)
    }
  }

  async ticketLCC(collection:string,resultIndex:string,fareQuote:any,Origin:string,Destination:string,ssr:number){
    const payload={
      flightToken:this.token,
      traceId:this.traceId,
      resultIndex:resultIndex,
      fareQuote:fareQuote,
      uid:this.uid,
      Origin:Origin,
      Destination:Destination,
      ssr:ssr,
      collection:collection
    }
    console.log(payload)
    try{
      const res=await this.flights.ticketLCC(payload);
      console.log(res);
      await this.getAllFlightDetails()
      return res
      // await this.getFlightBookingDetails()
    }catch(error){
      console.log('something went wrong ',error.message)
    }
  }
  async ticketNonLCC(collection:string,Origin:string,Destination:string){
    const payload={
      flightToken:localStorage.getItem('authenticateToken'),
      traceId:this.traceId,
      uid:this.uid,
      Origin:Origin,
      Destination:Destination,
      collection:collection
    
    }
    try{
      const res=await this.flights.ticketNonLCC(payload);
      console.log(res);
      return res
      // await this.getFlightBookingDetails()
    }catch(error){
      console.log('something went wrong ',error.message)
    }
  }
  

  async getFlightBookingDetails(){
    const payload={
      flightToken:localStorage.getItem('authenticateToken'),
      uid:this.uid,
      collection:'flight_bookings'
    }
    try{
      const data=await this.flights.getFlightBookingDetails(payload)
      console.log(data)
    }catch(error){
      console.log(error.message)
    }
  }

  async getHotelBookingDetails(){
    const payload={
      uid:sessionStorage.getItem('hotel_uid'),
      collection:'hotel_bookings',
      token:localStorage.getItem('token')
    }
    try{
      const res=await this.hotels.hotelBookingDetails(payload);
      console.log(res)

    }catch(error){
      console.log(error.message)
    }
  }


  async getUserData(id:string){
    const res=await this.transact.getUserDetails(id);
    console.log(res)
    this.form=res;


  }
  async updateStatus(id:string){
   try{
    const res=await this.transact.updateStatus(id);
    console.log('updated')
   }catch(error){
    console.log(error)
   }

  }

  calculateAge(dateString: string): number {
    const birthdate = new Date(dateString);
    const today = new Date();
  
    const formattedBirthdate = this.datePipe.transform(birthdate, 'yyyy-MM-dd');
    const formattedToday = this.datePipe.transform(today, 'yyyy-MM-dd');
  
    const age = today.getFullYear() - birthdate.getFullYear();
    const birthdateThisYear = new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate());
  
    if (birthdateThisYear > today) {
      return age - 1;
    } else {
      return age;
    }
  }

 
  async getSegmentDetails(){
    try{
      const res=await this.flightBook.getFlightDetails(sessionStorage.getItem('uid'))
      console.log(res)
      this.segments=res;


    }catch(error){
      console.log(error.message)
    }
  }

  async  getAllFlightDetails(){
    try{
      const res=await this.flightBook.getAllDetails(sessionStorage.getItem('uid'))
      console.log(res)
      this.flightResponse=res
      
    }catch(error){
      console.log(error.message)
    }
  }
  async  getAllHotelDetails(){
    try{
      const res=await this.hotelBook.getAllDetails(sessionStorage.getItem('hotel_uid'))
      console.log(res)
      this.hotelData=res;
     
    }catch(error){
      console.log(error.message)
    }
  }


  async getPaymentInfo(){
    try{
      const res=await this.transact.getUserDetails(sessionStorage.getItem('transact'))
      console.log(res)
      this.totalCost=res.totalCost+res.incentiveEarned
      if(this.isFlight==='1'){
        this.flightCost=res.flightCost
        this.taxes=res.taxes
        this.otherCharges=res.transactionFee+res.merchantShare+res.merchantGst

      }else if(this.isFlight==='0'){
        this.hotelCost=res.hotelCost
        this.taxes=res.taxes
        this.otherCharges=res.transactionFee+res.merchantShare+res.merchantGst
      }
      console.log(this.totalCost)
      console.log(this.taxes)
      this.totalCost=+this.totalCost.toFixed(2)
    }catch(error){
      console.log(error.message)
    }
  }
 
  handleCancel(event){
    this.isCancel=!this.isCancel
  }
  
}
