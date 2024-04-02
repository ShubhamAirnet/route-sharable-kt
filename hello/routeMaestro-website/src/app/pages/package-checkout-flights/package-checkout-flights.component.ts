import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { Cashfree } from 'cashfree-pg';
import { HotelsService } from 'src/app/Services/hotels_api/hotels.service';
import { PackageService } from 'src/app/Services/package/package.service';
import { TransactionsService } from 'src/app/Services/transactions.service';
import { cashfree } from '../checkout/util';
import { TravelDataFlightsComponent } from 'src/app/components/travel-data-flights/travel-data-flights.component';
import { FlightBookingService } from 'src/app/Services/flight_booking/flight-booking.service';
import { FlightsService } from 'src/app/Services/flights_api/flights.service';
import { HotelBookingService } from 'src/app/Services/hotels_booking/hotel-booking.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-package-checkout-flights',
  templateUrl: './package-checkout-flights.component.html',
  styleUrls: ['./package-checkout-flights.component.scss']
})
export class PackageCheckoutFlightsComponent implements OnInit {
 
  editIndex:number
  dialog:boolean=false;
  contactForm: FormGroup;
  
  merchantShare:number=0;
  travelers=[]as any;
  fareRuleResponse:any
  fareRuleResponse1:any
  fareRuleResponse2:any

  transactionFee:number;
  totalCost:any;
  initialCost:any;
  loading:boolean;
  sessionId:string;
  version:string;
  pay:boolean=false;
  gst:number=0;
  ssrPrice:any;
  baggagePrice:number;
  seatPrice:number;
  mealPrice:number;
  ssr:any;
  isToggle:boolean=true;
  isCollapsed:boolean=true;
  isDateCollapsed:boolean=true;
  isExclusionCollapsed:boolean=true;
  arrowTermDirection = 'down';
  arrowDirection = 'down';
  arrowDateDirection = 'down';
  arrowExclusionDirection = 'down';
  taxesSectionExpanded: boolean = false;
  // sample data


// checkbox
checkBox1: boolean = false;
checkBox2: boolean = false;




// dialog box variables
privacyDialog:boolean=false;
termsDialog:boolean=false;
refundibleDialog:boolean=false;

// cancel variables
hotelData:any;
minLastCancellationDate:any;
LastCancelPolicy=[]
 
  formattedLastCancellationDate: any;
  packageDialog: boolean;
  NoOfTravellers: number;
  RoomGuest: any;
  Travellers: boolean;
  taxes: any;
  flightCost: any;
  incentiveEarned: any;
  localStorageData: string;
  adults: any;
  child: any;
  infants: any;

  travelData:any

  isPanRequired:boolean;
  isPassportRequired:boolean;
  journeyType: any;
  ssr1: any;
  ssr2: any;
  price=[] as any;
  childComponent:TravelDataFlightsComponent;
  ssrCost: number;
  netPayable: any;
  flightData: any;
  traceId: string;
  token: string;
  resultIndex: string;
  resultIndex1: string;
  resultIndex2: string;
  otherCharge: number;
  fareQuote: any;
  otherCharge1: number;
  fareQuote1: any;
  flightCost1: any;
  incentiveEarned1: any;
  taxes1: any;
  netPayable1: number;
  initialCost1: number;
  otherCharge2: number;
  fareQuote2: any;
  flightCost2: any;
  incentiveEarned2: any;
  taxes2: any;
  netPayable2: number;
  initialCost2: number;
  uid:string;
  childs:number=0;
  tooltipStates: boolean[] = [false, false, false];
  tooltipCloseTimeout: any;

  isLCC:boolean;
  isLCC1:boolean;
  isLCC2:boolean;
  segments: { airlineLogos: any; segments: any; journeyType: any; } | { airlineLogos1: any; airlineLogos2: any; segments1: any; segments2: any; journeyType: any; };

  constructor(private hotels:HotelsService,private spinner: NgxSpinnerService,private hotelBook:HotelBookingService,private flights:FlightsService,private datePipe: DatePipe,private zone: NgZone,private fb: FormBuilder,private cdr: ChangeDetectorRef,private transact:TransactionsService,private pack:FlightBookingService) {
  
    
   }

  ngOnInit(): void {
    
    this.initializeForm();
    this.localStorageData=sessionStorage.getItem('key')
   
   
    // this.NoOfTravellers=this.adults+this.child+this.infants;
    // this.initializePrice()
    // this.intializeTravelers()
    this.getTripData();
    console.log(this.travelData)
    this.getFlightDetails()
    
   
    this.localStorageData=sessionStorage.getItem('key')
    console.log(this.localStorageData)
    this.traceId=JSON.parse(this.localStorageData).traceId
    this.token=localStorage.getItem('authenticateToken')
    this.journeyType=JSON.parse(this.localStorageData).journeyType
    this.uid=sessionStorage.getItem('uid')
    this.adults=JSON.parse(this.localStorageData).adults
    this.childs=JSON.parse(this.localStorageData).child
    this.infants=JSON.parse(this.localStorageData).infant
    this.isLCC=JSON.parse(this.localStorageData).isLCC

    // for round trip
    if(this.journeyType===2){
      this.resultIndex1=JSON.parse(this.localStorageData).resultIndex1
      this.resultIndex2=JSON.parse(this.localStorageData).resultIndex2
      this.isLCC1=JSON.parse(this.localStorageData).isLCC1
      this.isLCC2=JSON.parse(this.localStorageData).isLCC2
      
      this.fareRuleCall1(this.resultIndex1,this.token,this.traceId)
      this.fareRuleCall2(this.resultIndex2,this.token,this.traceId)
    }else{
      this.resultIndex=JSON.parse(this.localStorageData).resultIndex
      this.isLCC=JSON.parse(this.localStorageData).isLCC
      
      this.fareRuleCall(this.resultIndex,this.token,this.traceId)
    }
    this.calculateSsrCost()

    console.log(this.flightCost)
    console.log(this.taxes)
    console.log(this.incentiveEarned)
    console.log(this.netPayable)
   
   
  }

  mouseEntered(index: number): void {
    // Set the tooltip state at the specified index to true
    this.tooltipStates = this.tooltipStates.map((state, i) => i === index);

    // console.log(this.tooltipStates)
  }

  mouseLeft(index: number): void {
    // Delay closing the tooltip to allow the cursor to move from trigger to tooltip
    this.setTooltipCloseTimeout(index);
  }


  setTooltipCloseTimeout(index: number): void {
    // Close the tooltip after a delay
    console.log("outside timeout")

    this.tooltipCloseTimeout = setTimeout(() => {
      console.log("in timeout")
      this.tooltipStates[index] = false;
    }, 2000); // Adjust the delay as needed
  }


  mouseOnTooltip(index: number): void {
    clearTimeout(this.tooltipCloseTimeout);
  }
  
  mouseLeftTooltip(index:number){
    this.setTooltipCloseTimeout(index);
  }
  closeFareRuleOnX(index){
    this.tooltipStates[index] = false;
  }




  async getTripData(){
    try{
      const res=await this.pack.getTripDetails(sessionStorage.getItem('uid'))
      console.log(res)
      this.adults=res.tripData.AdultCount;
      this.child=res.tripData.ChildCount;
      this.infants=res.tripData.InfantCount
      this.NoOfTravellers=this.adults+this.child+this.infants
      console.log(this.NoOfTravellers)
      this.initializePrice()
    this.intializeTravelers()
      
    }catch(error){
      console.log(error.message)
    }
  }

  async handleHoldBook(){
    this.localStorageData = sessionStorage.getItem('key'); // Fix here
    this.resultIndex=JSON.parse(this.localStorageData).resultIndex
    this.isLCC = JSON.parse(this.localStorageData).isLCC;
    this.traceId =JSON.parse(this.localStorageData).traceId;
    this.journeyType=JSON.parse(this.localStorageData).journeyType;
    this.uid=sessionStorage.getItem('uid')
    this.getFlightDetails()
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
  }

  // fare quote calls
  async getFareQuote(resultIndex:string){
    // try{
      const res=await this.pack.getFareQuote(this.uid);
      console.log(res)
      this.fareQuote=res;
      if(this.isLCC){
      
        await this.flightBook('flight_bookings',resultIndex,this.fareQuote,this.flightData?.segments[0][0]?.Origin?.Airport?.CityCode,this.flightData?.segments[0][this.flightData?.segments[0]?.length-1].Destination?.Airport?.CityCode,0)
      }
      

    // }catch(error){
    //   console.log(error.message)
    // }

  }
  async getFareQuote1(resultIndex:string){
    // try{
      const res=await this.pack.getFareQuote1(this.uid);
      console.log(res)
      
      this.fareQuote1=res;
      if(this.isLCC1){
     
        await this.flightBook('flight_bookings',resultIndex,this.fareQuote1,this.flightData?.segments1[0][0]?.Origin?.Airport?.CityCode,this.flightData?.segments1[0][this.flightData?.segments1[0]?.length-1].Destination?.Airport?.CityCode,1)
      }
     
    // }catch(error){
    //   console.log(error.message)
    // }

  }
  async getFareQuote2(resultIndex:string){
    // try{
      const res=await this.pack.getFareQuote2(this.uid);
      console.log(res)
      this.fareQuote2=res;
      if(this.isLCC2){
     
        await this.flightBook('flight_bookings',resultIndex,this.fareQuote2,this.flightData?.segments2[0][0]?.Origin?.Airport?.CityCode,this.flightData?.segments2[0][this.flightData?.segments2[0]?.length-1].Destination?.Airport?.CityCode,2)
      }
      

    // }catch(error){
    //   console.log(error.message)
    // }

  }

  // getSegment Details
  async getSegmentDetails(){
    try{
      const res=await this.pack.getFlightDetails(sessionStorage.getItem('uid'))
      console.log(res)
      this.segments=res;


    }catch(error){
      console.log(error.message)
    }
  }
  async flightBook(collection:string,resultIndex:string,fareQuote:any,Origin:string,Destination:string,ssr:number){
    const payload={
      flightToken:localStorage.getItem('authenticateToken'),
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
      const data=await this.flights.flightBooking(payload);
      if(data){
        console.log(data);
        
        return ({data})

      }
    }catch(error){
      console.log('something went wrong',error.message)
    }
  }
  handlePriceChange(event:any){
    console.log(event)
    this.price=event
    this.calculateSsrCost()
  }
  handleTravelerArrayChange(event:any){
    console.log(event)
    this.travelers=event;
    console.log(this.travelers)
    this.cdr.detectChanges();
  }
  initializePrice(){
    for(let i=0;i<this.NoOfTravellers;i++){
      this.price.push({seat:0,meal:0,baggage:0})
    }
    console.log(this.price)
  }

  calculateSsrCost(){
    this.ssrCost=0;
    this.price.map((item)=>{
      this.ssrCost+=item.meal+item.baggage+item.seat
    })
    console.log(this.ssrCost)
    this.netPayable=this.initialCost;
    this.netPayable+=this.ssrCost;
    this.totalCost=this.netPayable;
    this.transactionFee=this.totalCost*0.0175;
    this.transactionFee = +this.transactionFee.toFixed(2);
    this.totalCost += this.transactionFee;
    this.totalCost = +this.totalCost.toFixed(2);

    
  }


  async getFlightDetails(){
    try{
      const res=await this.pack.getFlightDetails(sessionStorage.getItem('uid'));
      console.log(res)
      this.flightData=res
    }catch(error){
      console.log(error.message)
    }
  }


  async fareRuleCall(resultIndex: string, token: string, traceId: string) {
    this.spinner.show()
    const payload = {
      resultIndex: resultIndex,
      flightToken: token,
      traceId: traceId
    };
  
    try {
      const res = await this.flights.fareRule(payload);
      this.fareRuleResponse=res
      
      if (this.fareRuleResponse) {
        console.log('Fare Quote Response:', this.fareRuleResponse);
        
        // Assuming that this.resultIndex, this.token, and this.traceId are properties of the current class
        await this.fareQuoteCall(this.resultIndex, this.token, this.traceId);
        this.spinner.hide()
      }
  
    } catch (error) {
      console.error('An error occurred in fareQuoteCall:', error.message);
      // Handle the error appropriately, e.g., show a user-friendly message
    }
  }

  // round trip
  async fareRuleCall1(resultIndex: string, token: string, traceId: string) {
    this.spinner.show()
    const payload = {
      resultIndex: resultIndex,
      flightToken: token,
      traceId: traceId
    };
  
    try {
      const res = await this.flights.fareRule(payload);
      this.fareRuleResponse1=res.fareQuote.Response.Results.FareRules
      
      if (this.fareRuleResponse1) {
        console.log('Fare Quote Response:', this.fareRuleResponse1);
        
        // Assuming that this.resultIndex, this.token, and this.traceId are properties of the current class
        await this.fareQuoteCall1(this.resultIndex1, this.token, this.traceId);
        this.spinner.hide()
      }
  
    } catch (error) {
      console.error('An error occurred in fareQuoteCall:', error.message);
      // Handle the error appropriately, e.g., show a user-friendly message
    }
  }
  async fareRuleCall2(resultIndex: string, token: string, traceId: string) {
    this.spinner.show()
    const payload = {
      resultIndex: resultIndex,
      flightToken: token,
      traceId: traceId
    };
  
    try {
      const res = await this.flights.fareRule(payload);
      this.fareRuleResponse2=res.fareQuote.Response.Results.FareRules
      if (this.fareRuleResponse) {
        console.log('Fare Quote Response:', this.fareRuleResponse2);
        
        // Assuming that this.resultIndex, this.token, and this.traceId are properties of the current class
        await this.fareQuoteCall2(this.resultIndex2, this.token, this.traceId);
        this.spinner.hide()
      }
  
    } catch (error) {
      console.error('An error occurred in fareQuoteCall:', error.message);
      // Handle the error appropriately, e.g., show a user-friendly message
    }
  }


  async fareQuoteCall(resultIndex: string, token: string, traceId: string) {
    const payload = {
      resultIndex: resultIndex,
      flightToken: token,
      traceId: traceId
    };
  
    try {
      const fareQuoteResponse = await this.flights.fareQuote(payload);
      
      if (fareQuoteResponse) {
        this.otherCharge=0
        console.log('Fare Quote Response:', fareQuoteResponse);
        this.fareQuote=fareQuoteResponse?.fareQuote?.Response?.Results
        await this.pack.saveFareQuote(this.fareQuote.FareBreakdown,sessionStorage.getItem('uid'),this.fareQuote.Source)
        this.flightCost=this.fareQuote?.Fare?.PublishedFare
        this.incentiveEarned=this.fareQuote?.Fare?.CommissionEarned+this.fareQuote?.Fare?.IncentiveEarned +
        this.fareQuote?.Fare?.PLBEarned +this.fareQuote?.Fare?.AdditionalTxnFeePub;
        this.taxes=this.fareQuote?.Fare?.TdsOnCommission + this.fareQuote?.Fare?.TdsOnIncentive + this.fareQuote?.Fare?.TdsOnPLB
        this.fareQuote?.Fare?.ChargeBU.map((item)=>{
          this.otherCharge+=item.value
        })

        this.otherCharge+=this.otherCharge*0.18;
        this.taxes+=this.otherCharge;
        this.netPayable=this.taxes+this.flightCost-this.incentiveEarned;
        this.initialCost=this.netPayable

        this.totalCost=this.initialCost;
        this.transactionFee=this.totalCost*0.0175;
        this.transactionFee = +this.transactionFee.toFixed(2);
        this.totalCost += this.transactionFee;
        this.totalCost = +this.totalCost.toFixed(2);
        this.isPanRequired=this.fareQuote?.IsPanRequiredAtBook || this.fareQuote?.IsPanRequiredAtTicket;
        this.isPassportRequired=this.fareQuote?.IsPassportRequiredAtTicket || this.fareQuote?.IsPassportRequiredAtBook || this.fareQuote?.IsPassportFullDetailRequiredAtBook
        // Assuming that this.resultIndex, this.token, and this.traceId are properties of the current class
        await this.ssrCall(this.resultIndex, this.token, this.traceId,this.flightData.segments[0][0].Origin.Airport.CityCode,this.flightData.segments[0][this.flightData.segments[0].length-1].Destination.Airport.CityCode);
      }
  
    } catch (error) {
      console.error('An error occurred in fareQuoteCall:', error.message);
      // Handle the error appropriately, e.g., show a user-friendly message
    }
  }
// round trip

async fareQuoteCall1(resultIndex: string, token: string, traceId: string) {
  const payload = {
    resultIndex: resultIndex,
    flightToken: token,
    traceId: traceId
  };

  try {
    const fareQuoteResponse = await this.flights.fareQuote(payload);

    if (fareQuoteResponse) {
      this.otherCharge1 = 0;
      console.log('Fare Quote Response:', fareQuoteResponse);
      this.fareQuote1 = fareQuoteResponse?.fareQuote?.Response?.Results;
      await this.pack.saveFareQuote1(this.fareQuote1?.FareBreakdown,sessionStorage.getItem('uid'),this.fareQuote1?.Source)
      // Ensure proper initialization
      this.flightCost1 = this.fareQuote1?.Fare?.PublishedFare || 0;
      this.incentiveEarned1 = this.fareQuote1?.Fare?.CommissionEarned + this.fareQuote1?.Fare?.IncentiveEarned +
        this.fareQuote1?.Fare?.PLBEarned + this.fareQuote1?.Fare?.AdditionalTxnFeePub || 0;
      this.taxes1 = this.fareQuote1?.Fare?.TdsOnCommission + this.fareQuote1?.Fare?.TdsOnIncentive +
        this.fareQuote1?.Fare?.TdsOnPLB || 0;

      this.fareQuote1?.Fare?.ChargeBU.map((item) => {
        this.otherCharge1 += item.value;
      });

      this.otherCharge1 += this.otherCharge1 * 0.18;
      this.taxes1 += this.otherCharge1;
      this.netPayable1 = this.taxes1 + this.flightCost1 - this.incentiveEarned1;
      this.initialCost1 = this.netPayable1;

      this.isPanRequired = this.fareQuote1?.IsPanRequiredAtBook || this.fareQuote1?.IsPanRequiredAtTicket;
      this.isPassportRequired = this.fareQuote1?.IsPassportRequiredAtTicket || this.fareQuote1?.IsPassportRequiredAtBook || this.fareQuote1?.IsPassportFullDetailRequiredAtBook;

      // Assuming that this.resultIndex, this.token, and this.traceId are properties of the current class
      this.finalCostAddUp();

      await this.ssrCall1(this.resultIndex1, this.token, this.traceId,this.flightData.segments1[0][0].Origin.Airport.CityCode,this.flightData.segments1[0][this.flightData.segments1[0].length-1].Destination.Airport.CityCode);
    }

  } catch (error) {
    console.error('An error occurred in fareQuoteCall1:', error.message);
    // Handle the error appropriately, e.g., show a user-friendly message
  }
}

async fareQuoteCall2(resultIndex: string, token: string, traceId: string) {
  const payload = {
    resultIndex: resultIndex,
    flightToken: token,
    traceId: traceId
  };

  try {
    const fareQuoteResponse = await this.flights.fareQuote(payload);

    if (fareQuoteResponse) {
      this.otherCharge2 = 0;
      console.log('Fare Quote Response:', fareQuoteResponse);
      this.fareQuote2 = fareQuoteResponse?.fareQuote?.Response?.Results;
      await this.pack.saveFareQuote2(this.fareQuote2?.FareBreakdown,sessionStorage.getItem('uid'),this.fareQuote2?.Source)

      // Ensure proper initialization
      this.flightCost2 = this.fareQuote2?.Fare?.PublishedFare || 0;
      this.incentiveEarned2 = this.fareQuote2?.Fare?.CommissionEarned + this.fareQuote2?.Fare?.IncentiveEarned +
        this.fareQuote2?.Fare?.PLBEarned + this.fareQuote2?.Fare?.AdditionalTxnFeePub || 0;
      this.taxes2 = this.fareQuote2?.Fare?.TdsOnCommission + this.fareQuote2?.Fare?.TdsOnIncentive +
        this.fareQuote2?.Fare?.TdsOnPLB || 0;

      this.fareQuote2?.Fare?.ChargeBU.map((item) => {
        this.otherCharge2 += item.value;
      });

      this.otherCharge2 += this.otherCharge2 * 0.18;
      this.taxes2 += this.otherCharge2;
      this.netPayable2 = this.taxes2 + this.flightCost2 - this.incentiveEarned2;
      this.initialCost2 = this.netPayable2;

      this.isPanRequired = this.fareQuote2?.IsPanRequiredAtBook || this.fareQuote2?.IsPanRequiredAtTicket;
      this.isPassportRequired = this.fareQuote2?.IsPassportRequiredAtTicket || this.fareQuote2?.IsPassportRequiredAtBook || this.fareQuote2?.IsPassportFullDetailRequiredAtBook;

      // Assuming that this.resultIndex, this.token, and this.traceId are properties of the current class
      this.finalCostAddUp();
      await this.ssrCall2(this.resultIndex2, this.token, this.traceId,this.flightData.segments2[0][0].Origin.Airport.CityCode,this.flightData.segments2[0][this.flightData.segments2[0].length-1].Destination.Airport.CityCode);

    }

  } catch (error) {
    console.error('An error occurred in fareQuoteCall2:', error.message);
    // Handle the error appropriately, e.g., show a user-friendly message
  }
}


 
  
  async ssrCall(resultIndex: string, token: string, traceId: string,Origin:string,Destination:string) {
    const ssrPayload = {
      resultIndex: resultIndex,
      flightToken: token,
      traceId: traceId
    };
  
    try {
      const ssrResponse = await this.flights.ssrCall(ssrPayload);
      console.log('SSR Response:', ssrResponse);
      this.ssr={ssr:ssrResponse.ssr.Response,Origin:Origin,Destination:Destination}

  
      // Additional logic based on ssrResponse if needed
  
    } catch (error) {
      console.error('An error occurred in ssrCall:', error.message);
      // Handle the error appropriately, e.g., show a user-friendly message
    }
    this.spinner.hide()
  }
  async ssrCall1(resultIndex: string, token: string, traceId: string,Origin:string,Destination:string) {
    const ssrPayload = {
      resultIndex: resultIndex,
      flightToken: token,
      traceId: traceId
    };
  
    try {
      const ssrResponse = await this.flights.ssrCall(ssrPayload);
      console.log('SSR Response:', ssrResponse);
      this.ssr1={ssr:ssrResponse.ssr.Response,Origin:Origin,Destination:Destination}
      this.finalCostAddUp()

  
      // Additional logic based on ssrResponse if needed
  
    } catch (error) {
      console.error('An error occurred in ssrCall:', error.message);
      // Handle the error appropriately, e.g., show a user-friendly message
    }
  }
  async ssrCall2(resultIndex: string, token: string, traceId: string,Origin:string,Destination:string) {
    const ssrPayload = {
      resultIndex: resultIndex,
      flightToken: token,
      traceId: traceId
    };
  
    try {
      const ssrResponse = await this.flights.ssrCall(ssrPayload);
      console.log('SSR Response:', ssrResponse);
      this.ssr2={ssr:ssrResponse.ssr.Response,Origin:Origin,Destination:Destination}
      this.finalCostAddUp()
  
      // Additional logic based on ssrResponse if needed
  
    } catch (error) {
      console.error('An error occurred in ssrCall:', error.message);
      // Handle the error appropriately, e.g., show a user-friendly message
    }
    this.spinner.hide()
  }
  finalCostAddUp(){
    console.log(this.netPayable)
    console.log(this.netPayable1)
    console.log(this.netPayable2)
    console.log(this.totalCost)
    console.log(this.initialCost)
    console.log(this.initialCost1)
    console.log(this.initialCost2)
    this.netPayable=this.netPayable1+this.netPayable2;
    this.initialCost=this.initialCost1+this.initialCost2;
    this.totalCost=this.initialCost;
    this.transactionFee=this.totalCost*0.0175;
    this.transactionFee = +this.transactionFee.toFixed(2);
    this.totalCost += this.transactionFee;
    this.totalCost = +this.totalCost.toFixed(2);
    this.flightCost=this.flightCost1+this.flightCost2
    this.taxes=this.taxes1+this.taxes2
    this.incentiveEarned=this.incentiveEarned1+this.incentiveEarned2
    this.totalCost=this.flightCost+this.taxes+this.incentiveEarned;
    this.transactionFee=this.totalCost*0.0175;
    this.totalCost+=this.totalCost+this.transactionFee;
    this.totalCost=+this.totalCost.toFixed(2)

  }
  

// hotel functions


  handleCostChanges(event:any){
    this.flightCost=event.flightCost;
    this.totalCost=event.totalCost;
    this.taxes=event.taxes;
    this.incentiveEarned=event.incentiveEarned;
    this.isPanRequired=event.isPanReuired;
    this.isPassportRequired=event.isPassportRequired
    console.log(event)
    if(this.journeyType===2){
      this.ssr1=event.ssr1
      this.ssr2=event.ssr2
      console.log(this.ssr1)
      console.log(this.ssr2)
    }else{
      this.ssr=event.ssr
    }
   
  }

  toggle() {
    this.isToggle = !this.isToggle;
    this.arrowTermDirection = this.isToggle ? 'down' : 'up';
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.arrowDirection = this.isCollapsed ? 'down' : 'up';
  }
  toggleDateCollapse() {
    this.isDateCollapsed = !this.isDateCollapsed;
    this.arrowDateDirection = this.isDateCollapsed ? 'down' : 'up';
  }
  toggleExclusionCollapse() {
    this.isExclusionCollapsed = !this.isExclusionCollapsed;
    this.arrowExclusionDirection = this.isExclusionCollapsed ? 'down' : 'up';
  }

  toggleTaxesSection() {
    this.taxesSectionExpanded = !this.taxesSectionExpanded;
  }
  

  areAllCheckboxesChecked(): boolean {
    return this.checkBox1 && this.checkBox2 ;
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      gst: [''],
      companyName: [''],
      companyNumber: [''],
      companyAddress: [''],
    });

   
  }

//  dialogBox functions

  dialogBox(index:number){
    this.dialog=!this.dialog
    this.editIndex=index
  }
  privacyDialogBox(){
    console.log('privacy')
    this.privacyDialog=!this.privacyDialog
  }
  termsDialogBox(){
    console.log('terms')
    this.termsDialog=!this.termsDialog
  }
  refundibleDialogBox(){
    console.log('refundible')
    this.refundibleDialog=!this.refundibleDialog
  }
  packageDialogBox(){
    console.log('package')
    this.packageDialog=!this.packageDialog
  }

  async submit(){
    this.pay=true
    console.log(this.contactForm.value)
 
    await this.pack.updatePrimaryContact(this.contactForm.value,sessionStorage.getItem('uid')) 
  
  }

  // async getData() {
  //   console.log('fetching');
    
  //   try {
  //     const res = await this.hotels.getSearchInfo();
  //     console.log(res);
  
  //     if (res) {
  //       this.travelData = res;
  //       this.NoOfRooms = this.travelData.trip.RoomGuests.length;
  //       this.RoomGuest=this.travelData.trip.RoomGuests;
  //       for(let i=0;i<this.travelData.trip.RoomGuests.length;i++){
  //         this.NoOfAdults+=this.travelData.trip.RoomGuests[i].NoOfAdults;
  //         this.NoOfChild+=this.travelData.trip.RoomGuests[i].NoOfChild;
  //       }
  //       this.totalCost = this.travelData.cost.flightCost+this.travelData.cost.hotelCost+this.travelData.cost.taxes
  //       this.initialCost=this.totalCost;
  //       this.transactionFee=this.totalCost*0.0175;
  //       this.transactionFee = +this.transactionFee.toFixed(2);
  //       this.totalCost += this.transactionFee;
  //       this.totalCost = +this.totalCost.toFixed(2);
  //       this.NoOfTravellers=this.NoOfAdults+this.NoOfChild;

        
        
  //     } else {
  //       console.log("No passenger data received from getPassengerDetails");
  //     }

        
      
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  
  

  toggleTerms() {
    const termsContainer = document.querySelector('.terms');
    const arrowDown = document.getElementById('arrowDown');
    const arrowUp = document.getElementById('arrowUp');

    termsContainer.classList.toggle('terms-expanded');
    arrowDown.classList.toggle('arrow-hidden');
    arrowUp.classList.toggle('arrow-hidden');
  }

  updateContainerHeight() {
    const container = document.getElementById('dynamicContainer');
    const boxCount = container.querySelectorAll('.box1').length;
    const newHeight = 180 + (boxCount * 40); // Adjust the value based on your styling
    container.style.height = `${newHeight}px`;
}
  addBox() {
    this.Travellers=!this.Travellers;
}
getArray(length: number): any[] {
  return new Array(length);
}

intializeTravelers() {
  console.log('intialize')
  for (let j = 0; j < this.adults + this.child + this.infants; j++) {
    const traveler: any = {
      personalInfo: {
        FirstName: '',
        Title: '',
        LastName: '',
        DateOfBirth: '',
        Gender: '',
        Nationality: '',
        AddressLine1: '',
        AddressLine2: '',
        Email: '',
        ContactNo: '',
        Age: '',
        PaxType: j < this.adults ? 1 : 2,
        CountryCode: '',
        City: '',
        CountryName: '',
        LeadPassenger: j === 0, // Only true for the first traveler
      },
     
      guardianDetails: {
        Title: '',
        FirstName: '',
        LastName: '',
      },
      ssr: {
        extraBaggage: '',
        meal: '',
        seat: '',
      },
      ssr1: {
        extraBaggage: '',
        meal: '',
        seat: '',
      },
      ssr2: {
        extraBaggage: '',
        meal: '',
        seat: '',
      },
    };

    // Conditionally add PAN and Passport properties
    if (this.isPanRequired) {
      traveler.personalInfo.PAN = '';
    }

    if (this.isPassportRequired) {
      traveler.personalInfo.PassportNo = '';
      traveler.personalInfo.PassportIssueDate = '';
      traveler.personalInfo.PassportExpiryDate = '';
    }

    this.travelers.push(traveler);
    
  }
  console.log(this.travelers)
}


onMerchantShareChange() {
  console.log('Merchant Share changed:', this.merchantShare);

  const costChange = this.totalCost - this.initialCost;
  this.gst=this.merchantShare*0.18;
  this.gst = +this.gst.toFixed(2);
  this.totalCost = this.initialCost + this.merchantShare+this.gst;
  this.transactionFee = 0.0175 * this.totalCost;

  // Round to two decimal places
  this.transactionFee = +this.transactionFee.toFixed(2);

  // Update totalCost with the transaction fee
  this.totalCost += this.transactionFee;

  // Update initialTotalCost to the latest totalCost
  if(this.merchantShare==null || this.merchantShare===0){
    this.totalCost=this.initialCost+this.transactionFee
  }

  // Round totalCost to two decimal places
  this.totalCost = +this.totalCost.toFixed(2);

}


// Pay Now flow
getPaymentLink(){
  const formValues=this.contactForm.value;
  formValues.totalCost=this.totalCost;
  formValues.transactionFee=this.transactionFee;
  formValues.merchantShare=this.merchantShare;
  formValues.merchantGst=this.gst;
  formValues.flightCost=this.flightCost
  formValues.incentiveEarned=this.incentiveEarned
  
  formValues.taxes=this.taxes

  this.saveUserDetails(formValues);

}



async saveUserDetails(formValues:any){
  console.log('saving')
  try{
    const res=await this.transact.saveUserPaymentDetails(formValues);
    console.log(res)
    sessionStorage.setItem('transact',res)
   // Assuming 'this.router' is an instance of the Angular Router service
    this.getSessionId(res,formValues)




  }catch(error){
    console.log(error)
  }
}
 



async initializeCashfree(): Promise<void>  {
  try {
    const cashfree: Cashfree = await load({ mode: 'sandbox' }); // Adjust the initialization based on the actual structure of your Cashfree library
  // Assuming a default version
  } catch (error) {
    console.error('Error initializing Cashfree:', error);
  }
}

async getSessionId(order_id:string,form:any): Promise<void> {
  this.loading = true;

  try {
    const res = await axios.post('http://localhost:4000/createOrder', { version: this.version,form:form,order_id:order_id });
    this.loading = false;
    this.sessionId = res.data;
    if(res.data.success){
      // const redirectUrl = res.data.data.payments.url;
      // window.location.href = redirectUrl;
      // console.log(res.data.data)
      const sessionId=res.data.data.payment_session_id
      this.handlePayment(sessionId,order_id)
    }
  } catch (err) {
    this.loading = false;
    console.error('Error fetching sessionId:', err);
  }
}
handlePayment(sessionId:string,order_id:string): void {
  const checkoutOptions = {
    paymentSessionId: sessionId,
    returnUrl: `http://localhost:4200/success/${sessionStorage.getItem('uid')}/1`,
  };

  cashfree.then((cf) => {
    cf.checkout(checkoutOptions).then(function(result){
      if (result.error) {
        alert(result.error.message);
      }
      if (result.redirect) {
        console.log("Redirection");
        console.log(result);
      }
    });
  });
}


// generate payment link flow


async saveUserData(formValues:any){
  console.log('saving')
  try{
    const res=await this.transact.saveUserPaymentDetails(formValues);
    console.log(res)
   // Assuming 'this.router' is an instance of the Angular Router service
    this.generateLink(formValues,res)




  }catch(error){
    console.log(error)
  }
}

async generateLink(form:any,link_id:string){
  try{
    const res=await axios.post('http://localhost:4000/getPaymentLink',{form:form,version:this.version,link_id:link_id});
    const linkUrl = res.data.link_url;
    console.log(linkUrl)
    console.log(res.data)
    // Navigate to the generated URL
    // window.location.href = linkUrl;
  }catch(error){
    console.log(error)
  }
}



}
function load(arg0: { mode: string; }): Cashfree | PromiseLike<Cashfree> {
  throw new Error('Function not implemented.');
}

