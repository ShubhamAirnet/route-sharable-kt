import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { HotelsService } from 'src/app/Services/hotels_api/hotels.service';
import { FlightsService } from 'src/app/Services/flights_api/flights.service';
import { PackageService } from 'src/app/Services/package/package.service';
import { FlightBookingService } from 'src/app/Services/flight_booking/flight-booking.service';
import { HotelBookingService } from 'src/app/Services/hotels_booking/hotel-booking.service';

@Component({
  selector: 'app-payment-breakdown',
  templateUrl: './payment-breakdown.component.html',
  styleUrls: ['./payment-breakdown.component.scss']
})
export class PaymentBreakdownComponent implements OnInit {
  
  @Input() travelData:any;
  @Input() price:any;
  @Input() hotelCost:number;
  @Input() flightCost:number;
  @Input() ssrCost:number;
  @Input() gst:number;
  @Input() taxes:number;
  @Input() incentiveEarned:number;
  @Input() initialCost:number;
  @Input() netPayable:number;
  @Input() transactionFee:number;

  
  @Output() privacyDialogbox: EventEmitter<void> = new EventEmitter<void>();
  @Output() termsDialogBox: EventEmitter<void> = new EventEmitter<void>();
  @Output() refundDialogBox: EventEmitter<void> = new EventEmitter<void>();
  @Output() packageDailogBox: EventEmitter<void> = new EventEmitter<void>();
  @Output() costData: EventEmitter<any> = new EventEmitter<any>();
  arrowTermDirection = 'down';
  arrowDirection = 'down';
  arrowDateDirection = 'down';
  arrowExclusionDirection = 'down';
  taxesSectionExpanded: boolean = false;

  totalCost: number;
  merchantShare:number=0;
 
  merchantGst: any;
  localStorageData:any;
  resultIndex:string;
  resultIndex1:string;
  resultIndex2:string;
  traceId:string;
  token:string;
  journeyType:number;

  fareQuote:any;
 
 
 
  otherCharge:number=0;
 
  isPanRequired:boolean;
  isPassportRequired:boolean;
  fareQuote1: any;
  flightCost1: any;
  incentiveEarned1: any;
  taxes1: any;
  otherCharge1: any;
  netPayable1: number;
  initialCost1: number;
  totalCost1: number;
  fareQuote2: any;
  flightCost2: any;
  incentiveEarned2: any;
  taxes2: any;
  otherCharge2: any;
  netPayable2: number;
  initialCost2: number;
  ssr2: any;
  ssr1: any;
  uid:string;
  flightData:any;
  ssr: any;

  childs:number;
  infants:number;
  adults:number;
  hotelData:any
 
netPayableFixed:number=0
  constructor( private hotels:HotelsService,private hotelBook:HotelBookingService,private flights:FlightsService,private pack:FlightBookingService) { }

  ngOnInit(): void {
    console.log(this.hotelCost)
    console.log(this.taxes)
    console.log(this.gst)
    console.log(this.incentiveEarned)
    
   
    
    // this.getData()
    // console.log(this.travelData)
    // this.getFlightDetails()
    // this.getRoomData()
   
    // this.localStorageData=localStorage.getItem('key')
    // console.log(this.localStorageData)
    // this.traceId=JSON.parse(this.localStorageData).traceId
    this.token=localStorage.getItem('authenticateToken')
    // this.journeyType=JSON.parse(this.localStorageData).journeyType
    // this.uid=localStorage.getItem('uid')
    // this.adults=JSON.parse(this.localStorageData).adults
    // this.childs=JSON.parse(this.localStorageData).child
    // this.infants=JSON.parse(this.localStorageData).infant

    // for round trip
    // if(this.journeyType===2){
    //   this.resultIndex1=JSON.parse(this.localStorageData).resultIndex1
    //   this.resultIndex2=JSON.parse(this.localStorageData).resultIndex2
    //   this.fareRuleCall1(this.resultIndex1,this.token,this.traceId)
    //   this.fareRuleCall2(this.resultIndex2,this.token,this.traceId)
    // }else{
    //   this.resultIndex=JSON.parse(this.localStorageData).resultIndex
    //   this.fareRuleCall(this.resultIndex,this.token,this.traceId)
    // }
    // this.calculateSsrCost()
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check which input property changed and recalculate ssrCost accordingly
    if (
      changes.price ||
      changes.meal ||
      changes.baggage ||
      changes.seat
    ) {
      this.calculateSsrCost();
    }


if (this.hotelCost) {

  this.totalCost = this.hotelCost + this.taxes + this.gst -this.incentiveEarned;
  this.transactionFee = this.totalCost * 0.0175; 
  this.totalCost += this.transactionFee; 


  this.netPayable = this.hotelCost + this.taxes + this.gst - this.incentiveEarned;


  this.gst = +this.gst.toFixed(2);
} else if (this.flightCost) {

  this.totalCost = this.flightCost + this.taxes - this.incentiveEarned + this.ssrCost;
  this.transactionFee = this.totalCost * 0.0175; 
  this.totalCost += this.transactionFee; 

 
  this.netPayable = this.flightCost + this.taxes - this.incentiveEarned + this.ssrCost;
}
console.log(this.totalCost)
console.log(this.transactionFee)

this.taxes = +this.taxes.toFixed(2);
this.netPayableFixed = +this.netPayable.toFixed(2);
this.transactionFee = +this.transactionFee.toFixed(2);
this.incentiveEarned = +this.incentiveEarned.toFixed(2);
this.totalCost = +this.totalCost.toFixed(2);

    
  }

  // flights function
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
    this.costData.emit({totalCost:this.totalCost,flightCost:this.flightCost,txes:this.taxes,incentiveEarned:this.incentiveEarned,isPanReuired:this.isPanRequired,isPassportReuired:this.isPassportRequired})

    
  }


  async getFlightDetails(){
    try{
      const res=await this.pack.getFlightDetails(localStorage.getItem('uid'));
      console.log(res)
      this.flightData=res
      console.log(this.flightData?.segments[0])
      console.log(this.flightData?.segments[0][0])
      console.log(this.flightData.segments[0][0].Origin.Airport.CityCode)
      console.log(this.flightData.segments[0].length)
      console.log(this.flightData.segments[0][this.flightData.segments[0].length-1].Destination.Airport.CityCode)
    }catch(error){
      console.log(error.message)
    }
  }


  async fareRuleCall(resultIndex: string, token: string, traceId: string) {
    const payload = {
      resultIndex: resultIndex,
      flightToken: token,
      traceId: traceId
    };
  
    try {
      const fareRuleResponse = await this.flights.fareRule(payload);
      
      if (fareRuleResponse) {
        console.log('Fare Quote Response:', fareRuleResponse);
        
        // Assuming that this.resultIndex, this.token, and this.traceId are properties of the current class
        await this.fareQuoteCall(this.resultIndex, this.token, this.traceId);
      }
  
    } catch (error) {
      console.error('An error occurred in fareQuoteCall:', error.message);
      // Handle the error appropriately, e.g., show a user-friendly message
    }
  }

  // round trip
  async fareRuleCall1(resultIndex: string, token: string, traceId: string) {
    const payload = {
      resultIndex: resultIndex,
      flightToken: token,
      traceId: traceId
    };
  
    try {
      const fareRuleResponse = await this.flights.fareRule(payload);
      
      if (fareRuleResponse) {
        console.log('Fare Quote Response:', fareRuleResponse);
        
        // Assuming that this.resultIndex, this.token, and this.traceId are properties of the current class
        await this.fareQuoteCall1(this.resultIndex1, this.token, this.traceId);
      }
  
    } catch (error) {
      console.error('An error occurred in fareQuoteCall:', error.message);
      // Handle the error appropriately, e.g., show a user-friendly message
    }
  }
  async fareRuleCall2(resultIndex: string, token: string, traceId: string) {
    const payload = {
      resultIndex: resultIndex,
      flightToken: token,
      traceId: traceId
    };
  
    try {
      const fareRuleResponse = await this.flights.fareRule(payload);
      
      if (fareRuleResponse) {
        console.log('Fare Quote Response:', fareRuleResponse);
        
        // Assuming that this.resultIndex, this.token, and this.traceId are properties of the current class
        await this.fareQuoteCall2(this.resultIndex2, this.token, this.traceId);
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
        await this.pack.saveFareQuote(this.fareQuote.FareBreakdown,localStorage.getItem('uid'),this.fareQuote.Source)
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
        this.costData.emit({totalCost:this.totalCost,flightCost:this.flightCost,txes:this.taxes,incentiveEarned:this.incentiveEarned,isPanReuired:this.isPanRequired,isPassportReuired:this.isPassportRequired})
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
      await this.pack.saveFareQuote1(this.fareQuote1?.FareBreakdown,localStorage.getItem('uid'),this.fareQuote1.Source)
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
      await this.pack.saveFareQuote2(this.fareQuote2?.FareBreakdown,localStorage.getItem('uid'),this.fareQuote2.Source)

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
      this.costData.emit({totalCost:this.totalCost,flightCost:this.flightCost,txes:this.taxes,incentiveEarned:this.incentiveEarned,isPanReuired:this.isPanRequired,isPassportReuired:this.isPassportRequired,ssr:this.ssr})

  
      // Additional logic based on ssrResponse if needed
  
    } catch (error) {
      console.error('An error occurred in ssrCall:', error.message);
      // Handle the error appropriately, e.g., show a user-friendly message
    }
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
    this.costData.emit({totalCost:this.totalCost,flightCost:this.flightCost,txes:this.taxes,incentiveEarned:this.incentiveEarned,isPanReuired:this.isPanRequired,isPassportReuired:this.isPassportRequired,ssr1:this.ssr1,ssr2:this.ssr2})

  }
  


  // hotel functions

  async getRoomData(){
    try{
      const res=await this.hotelBook.getRoomData(localStorage.getItem('hotel_uid'))
      console.log(res)
      this.hotelData=res
    }catch(error){
      console.log(error.message)
    }
  }

  async hotelBlockRoom(){
    const payload={
      ResultIndex:this.hotelData?.hotel_details?.resultIndex,
      HotelName:this.hotelData?.hotel_details?.hotelName,
      HotelCode:this.hotelData?.hotel_details?.hotelCode,
      NoOfRooms:this.hotelData?.trip?.noOfRooms,
      IsVoucherBooking:true,
      GuestNationality:this.hotelData?.trip?.nationality,
      HotelRoomsDetails:this.hotelData?.hotel_details?.rooms.map((item)=>{ return item.room}),
      TraceId:localStorage.getItem('traceId'),
      TokenId:localStorage.getItem('authenticateToken'),

    }
    try{
      const res=await this.hotels
    }catch(error){
      console.log(error.message)
    }
  }

  toggleTaxesSection() {
    this.taxesSectionExpanded = !this.taxesSectionExpanded;
  }

  package(){
    console.log('package')
    this.packageDailogBox.emit()
  }
  privacy(){
    console.log('privacy')

    this.privacyDialogbox.emit()
  }
  refundible(){
    console.log('refundible')
    this.refundDialogBox.emit()
  }
  terms(){
    console.log('terms')
    this.termsDialogBox.emit()
  }

  async getData() {
    console.log('fetching');
    
    try {
      const res = await this.hotels.getSearchInfo();
      console.log(res);
  
      if (res) {
        this.travelData = res;
        
        this.totalCost = this.travelData.cost.flightCost+this.travelData.cost.hotelCost+this.travelData.cost.taxes
        this.initialCost=this.totalCost;
        this.transactionFee=this.totalCost*0.0175;
        this.transactionFee = +this.transactionFee.toFixed(2);
        this.totalCost += this.transactionFee;
        this.totalCost = +this.totalCost.toFixed(2);

        
        console.log(this.travelData);
        
        
      } else {
        console.log("No data received from getSearchInfo");
      }
    } catch (error) {
      console.log(error);
    }
  }

  onMerchantShareChange() {
    console.log('Merchant Share changed:', this.merchantShare);
  
    // Ensure that this.merchantShare is a number before proceeding
    if (isNaN(this.merchantShare) || this.merchantShare < 0) {
      console.error('Invalid merchantShare value:', this.merchantShare);
      return;
    }
  
    // Calculate the change in cost
    const costChange = this.totalCost - this.initialCost;
  
    // Calculate GST based on the merchant share
    this.merchantGst = this.merchantShare * 0.18;
    this.merchantGst = +this.merchantGst.toFixed(2);
  
    // Update totalCost with the new merchant share and GST
    this.totalCost = this.initialCost + this.merchantShare + this.merchantGst;
  
    // Calculate the transaction fee based on the updated totalCost
    this.transactionFee = 0.0175 * this.totalCost;
  
    // Round the transaction fee to two decimal places
    this.transactionFee = +this.transactionFee.toFixed(2);
  
    // Update totalCost with the transaction fee
    this.totalCost += this.transactionFee;
  
    // If merchantShare is null or 0, reset totalCost to the initialCost
    if (this.merchantShare == null || this.merchantShare === 0) {
      this.totalCost = this.initialCost+this.transactionFee;
    }
  
    // Round totalCost to two decimal places
    this.totalCost = +this.totalCost.toFixed(2);
    this.costData.emit({totalCost:this.totalCost,flightCost:this.flightCost,taxes:this.taxes,incentiveEarned:this.incentiveEarned})

  }
  
}
