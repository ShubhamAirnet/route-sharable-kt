import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlightBookingService } from 'src/app/Services/flight_booking/flight-booking.service';
import { FlightsService } from 'src/app/Services/flights_api/flights.service';
import { HotelBookingService } from 'src/app/Services/hotels_booking/hotel-booking.service';

@Component({
  selector: 'app-reissue-checkout',
  templateUrl: './reissue-checkout.component.html',
  styleUrls: ['./reissue-checkout.component.scss']
})
export class ReissueCheckoutComponent implements OnInit {
  ssr:any;
  fareQuote: any;
  localStorageData: string;
  traceId: any;
  token: string;
  journeyType: any;
  uid: string;
  resultIndex: any;
  flightData: any;
  packageDialog:any;
  refundibleDialog:any;
  termsDialog:any;
  privacyDialog:any;
  Travellers:boolean;
  travelers: any;
  primaryInfo: any;
  checkBox1: boolean = false;
checkBox2: boolean = false;
  pay: boolean=false;
  isExclusionCollapsed:boolean=true;
  arrowExclusionDirection = 'down';

  constructor(private hotelBook:HotelBookingService,private flightBook:FlightBookingService,private flights:FlightsService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.getFlightDetails()
    this.localStorageData=localStorage.getItem('key')
    console.log(this.localStorageData)
    this.traceId=JSON.parse(this.localStorageData).traceId
    this.token=localStorage.getItem('authenticateToken')
    this.journeyType=JSON.parse(this.localStorageData).journeyType
    this.uid=localStorage.getItem('uid')
    this.resultIndex=JSON.parse(this.localStorageData).resultIndex

    this.fareQuoteCall(this.resultIndex,this.token,this.traceId)
  }
  async getFlightDetails(){
    try{
      const res=await this.flightBook.getAllDetails(localStorage.getItem('uid'))
      console.log(res)
      this.flightData=res
      this.travelers=this.flightData.passengers;
      this.primaryInfo=this.flightData?.primary_details
    }catch(error){
      console.log(error)
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
   
        console.log('Fare Quote Response:', fareQuoteResponse);
        this.fareQuote=fareQuoteResponse?.fareQuote?.Response?.Results
        // await this.flightBook.saveFareQuote(this.fareQuote.FareBreakdown,localStorage.getItem('uid'),this.fareQuote.Source)
        // this.flightCost=this.fareQuote?.Fare?.PublishedFare
        // this.incentiveEarned=this.fareQuote?.Fare?.CommissionEarned+this.fareQuote?.Fare?.IncentiveEarned +
        // this.fareQuote?.Fare?.PLBEarned +this.fareQuote?.Fare?.AdditionalTxnFeePub;
        // this.taxes=this.fareQuote?.Fare?.TdsOnCommission + this.fareQuote?.Fare?.TdsOnIncentive + this.fareQuote?.Fare?.TdsOnPLB
        // this.fareQuote?.Fare?.ChargeBU.map((item)=>{
        //   this.otherCharge+=item.value
        // })

        // this.otherCharge+=this.otherCharge*0.18;
        // this.taxes+=this.otherCharge;
        // this.netPayable=this.taxes+this.flightCost-this.incentiveEarned;
        // this.initialCost=this.netPayable

        // this.totalCost=this.initialCost;
        // this.transactionFee=this.totalCost*0.0175;
        // this.transactionFee = +this.transactionFee.toFixed(2);
        // this.totalCost += this.transactionFee;
        // this.totalCost = +this.totalCost.toFixed(2);
        // this.isPanRequired=this.fareQuote?.IsPanRequiredAtBook || this.fareQuote?.IsPanRequiredAtTicket;
        // this.isPassportRequired=this.fareQuote?.IsPassportRequiredAtTicket || this.fareQuote?.IsPassportRequiredAtBook || this.fareQuote?.IsPassportFullDetailRequiredAtBook
        // // Assuming that this.resultIndex, this.token, and this.traceId are properties of the current class
        // await this.ssrCall(this.resultIndex, this.token, this.traceId,this.flightData.segments[0][0].Origin.Airport.CityCode,this.flightData.segments[0][this.flightData.segments[0].length-1].Destination.Airport.CityCode);
      }
  
    } catch (error) {
      console.error('An error occurred in fareQuoteCall:', error.message);
      // Handle the error appropriately, e.g., show a user-friendly message
    }
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

  getArray(length: number): any[] {
    return new Array(length);
  }
  areAllCheckboxesChecked(): boolean {
    return this.checkBox1 && this.checkBox2 ;
  }

  async submit(){
    this.pay=true
   
  
  }

  toggleExclusionCollapse() {
    this.isExclusionCollapsed = !this.isExclusionCollapsed;
    this.arrowExclusionDirection = this.isExclusionCollapsed ? 'down' : 'up';
  }
}
