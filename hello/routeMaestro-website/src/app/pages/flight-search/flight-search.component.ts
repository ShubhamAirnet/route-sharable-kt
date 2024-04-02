import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightBookingService } from 'src/app/Services/flight_booking/flight-booking.service';
import * as CryptoJS from 'crypto-js';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from 'src/app/Services/global/global.service';
@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
})
export class FlightSearchComponent implements OnInit {
  trips:any;
  response:any;
  JourneyType:number;
  source:string;
  destination:string;
  adults: any;
  child: any;
  infant: any;
  trip:string;
  trip1:string;
  trip2:string;
  isSelected:boolean;
  isSelected1:boolean;
  isSelected2:boolean;
  // Define selectedFlightIndex in your component
selectedFlightIndex: number = -1;
selectedFlightIndex1: number = -1;
selectedFlightIndex2: number = -1;
isLCC:boolean;

segments:any;
airlineLogos:any;

segments1:any;
airlineLogos1:any;
segments2:any;
airlineLogos2:any;
  isLCC1: boolean;
  isLCC2: boolean;
  segmentIndicator:number=null;
  segmentIndicator1:number=null;
  segmentIndicator2:number=null;

  isFilter:boolean=false;


  // filters
  isRefundable:boolean=false;
  isNonRefundable:boolean=false;
  isFilterLCC:boolean=false;
  isFilterNonLCC:boolean=false;
  isFiltered:boolean=true;
  filteredFlights:any;
  filteredFlights1:any;
  filteredFlights2:any;
  numberOfStopsFilter: number=null;
  airline=[];
  layoffs=[];
  airlineNames: Set<string> = new Set();
  layoffNames: Set<string> = new Set();
 
  selectedRefundable: string | null = null;
  selectedNonRefundable: string | null = null;
  selectedLCC: string | null = null;
  selectedNonLCC: string | null = null;
  selectedCabin: number=1;
  allFlights=[] as any;
  allFlights1=[] as any;
  allFlights2=[] as any;
  fareType:number;

  endDate1:string;
  endDate2:string;

  calendarFare:any;
  refundableFlights: any;
  tripData: any;

  selectedFlight:any;
  selectedFlight1:any;
  selectedFlight2:any;
  @Input() isToggle:boolean;
  private key: string = 'ABCD1234';

  constructor(private router: Router,public global:GlobalService,private cdr: ChangeDetectorRef,private pack:FlightBookingService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    console.log('search')
    // global toggle is asscoiated with the sidebar component , when the sidebar is open then the filters should not be visible
    console.log(this.global.isToggle)
    if(sessionStorage.getItem('flights')){
      const response=this.decryptObject(sessionStorage.getItem('flights'))
      this.handleDecryptData(response);

  
    }
    
  }

  // the overall search request for the flight call recieved from the flight input sidebar component
  handleTripsData(trips: any) {
   
    console.log('Received trips data in parent component:', trips);
    this.trips=trips
  }

  
// the response from the api ,which is recieved from the flight input sidebar component or flight header when clicking on a ceratin calendar fare
  handleResponseData(response: any) {
 
    console.log('Received response data in parent component:', response);
    this.response=response
    console.log(this.response.flightsData)
    if(this.JourneyType===2){
      this.allFlights1=this.response?.flightsData1
      this.allFlights2=this.response?.flightsData2
    }else{
      this.allFlights=this.response?.flightsData
    }
    
    // initialize the filteredFlights
    this.applyFilters()
    const payload={response:response,trip:this.tripData,calendar:this.calendarFare}
  // to store the flight response in the session storage
    sessionStorage.setItem('flights',this.encryptObject(payload))
  }

  // to decrypt the data from the session storage
  handleDecryptData(response: any) {
    console.log( response);
    this.response=response.response
    const journey=response.trip
   
    this.tripData=journey
    this.JourneyType=journey.JourneyType
    this.source=journey.Segments[0].Origin;
    this.destination=journey.Segments[journey.Segments.length-1].Destination;
  
    this.adults=journey.AdultCount
    this.child=journey.ChildCount
    this.infant=journey.InfantCount
    this.fareType=journey.ResultFareType
    this.endDate1=journey.Segments[0].PreferredArrivalTime;
    this.endDate2=journey.Segments[journey.Segments.length-1].PreferredArrivalTime
    // this.handleJourney(response.trip)
    // this.handleResponseData(this.response)
    console.log(this.response.flightsData)
    console.log(journey)
    if(this.JourneyType===2){
      this.allFlights1=this.response?.flightsData1
      this.allFlights2=this.response?.flightsData2
    }else{
      this.allFlights=this.response?.flightsData
    }
    console.log(this.allFlights)
    console.log(this.allFlights1)
    console.log(this.allFlights2)
   if(this.JourneyType===1){
    this.calendarFare=response.calendar

   }
    
    this.applyFilters()
    this.spinner.hide()
 
    
  }
//  to encrypt the data
  encryptObject(obj: any): string {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(obj), this.key).toString();
    return encrypted;
  }
  //  to  decrypt the data
  decryptObject(encryptedData: string): any {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  }

  // handle flight journey data of the search response according to the journey type
  handleJourney(journey:any){
    console.log(journey)
    this.tripData=journey
    this.JourneyType=journey.JourneyType
    // for journey type roundtrip
   if(this.JourneyType===2){
    this.source=journey.Segments[0].Origin;
    this.destination=journey.Segments[0].Destination;
   }else{
    // for multicity or one way
    this.source=journey.Segments[0].Origin;
    this.destination=journey.Segments[journey.Segments.length-1].Destination;
   }
  
    this.adults=journey.AdultCount
    this.child=journey.ChildCount
    this.infant=journey.InfantCount
    this.fareType=journey.ResultFareType
    this.endDate1=journey.Segments[0].PreferredArrivalTime;
    this.endDate2=journey.Segments[journey.Segments.length-1].PreferredArrivalTime
    // show spinner
    this.spinner.show()

  }

  // handle flight card click
  handleClick(index: string, i: number,isLCC:boolean,airlineLogos:any,segments:any,flight:any): void {
    this.trip = index;
    this.selectedFlightIndex = i;
    this.isSelected = true;
    this.isLCC=isLCC;
    this.airlineLogos=airlineLogos;
    this.segments=segments;
    this.selectedFlight=flight
    console.log(airlineLogos)
    console.log(segments)

    // this.router.navigate(['/package-checkout-flight']);
  }
  
// handle the booking scenario according to the journey type
  async handleBook(){
    // when the journey type is multicity or one way
    if(this.isSelected){
      const value={
        resultIndex:this.trip,
        traceId:this.response.TraceId,
        adults:this.adults,
        child:this.child,
        infant:this.infant,
        journeyType:this.JourneyType,
        isLCC:this.isLCC
      }
      // store the payload parameters in the session storage
      sessionStorage.setItem('key', JSON.stringify(value));
      // to store the selected flights in the db
      await this.createPackage(this.airlineLogos,this.segments,this.JourneyType,this.tripData,this.isLCC)
      this.router.navigate(['/package-checkout-flight']);
    }
    // for round trip
    if(this.isSelected1 && this.isSelected2){
      const value={
        resultIndex1:this.trip1,
        resultIndex2:this.trip2,
        traceId:this.response.TraceId,
        adults:this.adults,
        child:this.child,
        infant:this.infant,
        journeyType:this.JourneyType,
        isLCC1:this.isLCC1,
        isLCC2:this.isLCC2
      }
      sessionStorage.setItem('key', JSON.stringify(value));
      await this.createRoundTripPackage(this.airlineLogos1,this.segments1,this.airlineLogos2,this.segments2,this.JourneyType,this.tripData,this.isLCC1,this.isLCC2)
      this.router.navigate(['/package-checkout-flight']);

    }
  }

  // to select 1st  flight in the round trip
  handleRoundTripClick1(index:string,i:number,isLCC:boolean,airlineLogos:any,segments:any,flight:any){
    this.trip1=index;
    this.selectedFlightIndex1 = i;
    this.isLCC2=isLCC
    this.airlineLogos1=airlineLogos
    this.segments1=segments
    this.isSelected1=true
    this.selectedFlight1=flight
    
  }
  // to select 2nd flight in the round trip
  handleRoundTripClick2(index:string,i:number,isLCC:boolean,airlineLogos:any,segments:any,flight:any){
    this.trip2=index;
    this.selectedFlightIndex2 = i;
    this.isLCC1=isLCC
    this.airlineLogos2=airlineLogos
    this.segments2=segments
    this.isSelected2=true
    this.selectedFlight2=flight

  }
// function to  store the flights data in the db for one way and multicity
  async createPackage(airlineLogos:any,segments:any,journeyType:number,tripData:any,isLCC:boolean){
    console.log('creating')
    console.log(airlineLogos)
    try{
      const res=await this.pack.createNewPackage(airlineLogos,segments,journeyType,tripData,isLCC);
      console.log(res)
      sessionStorage.setItem('uid',res)
    }catch(error){
      console.log(error)
    }
  }

  // funtion to store the flights data in db in case of round trip
  async createRoundTripPackage(airlineLogos1:any,segments1:any,airlineLogos2:any,segments2:any,journeyType:number,tripData:any,isLCC1:boolean,isLCC2:boolean){
    console.log('creating')

    try{
      const res=await this.pack.createNewRoundTripPackage(airlineLogos1,segments1,airlineLogos2,segments2,journeyType,tripData,isLCC1,isLCC2);
      console.log(res)
      sessionStorage.setItem('uid',res)
    }catch(error){
      console.log(error)
    }
  }


  flightDialog(){
    this.isFilter=!this.isFilter
  }

  responseChanges(event:any){
    console.log(event)
  }

  handleCalendarFare(event:any){
    console.log(event)
  }


  // filter functions

  
  
  toggleRefundable(isChecked: string) {
    if(isChecked){
      this.isRefundable=true;
    }else{
      this.isRefundable=false;
    }
    
   
    this.applyFilters()
  }
  toggleNonRefundable(isChecked: string) {
    
    if(isChecked){
      this.isNonRefundable=true;
    }else{
      this.isNonRefundable=false;
    }
    this.applyFilters()
  }

  toggleLCC(isChecked: string) {
   
    if(isChecked){
      this.isFilterLCC=true;
    }else{
      this.isFilterLCC=false;
    }
    this.applyFilters()
  }
  toggleNonLCC(isChecked: string) {
 
    if(isChecked){
      this.isFilterNonLCC=true;
    }else{
      this.isFilterNonLCC=false;
    }
    this.applyFilters()
  }
  toggleStops(value:number,isChecked:boolean){
    if(isChecked){
      this.numberOfStopsFilter=value;
    }else{
      this.numberOfStopsFilter=null;
    }
    console.log(this.numberOfStopsFilter)
    this.applyFilters()
  }

  toggleCabin(cabin: number, isChecked: boolean) {
   
      if (isChecked) {
        this.selectedCabin = cabin; 
     
      }else{
        this.selectedCabin=1;
      }
      this.applyFilters()
   
  }

  filterFlights() {
    
  // when journy is one way or multicity
    if (this.isFiltered && this.JourneyType !== 2) {
      console.log('first');
  
      this.filteredFlights = this.allFlights.filter((item) => {
        // console.log(item)
        const refundableCondition = !this.isRefundable || item.isRefundable === this.isRefundable;
        const nonRefundable = !this.isNonRefundable || item.isRefundable === false;
        const nonLccCondition = !this.isFilterNonLCC || item.isLCC === false;
        const lccCondition = !this.isFilterLCC || item.isLCC === this.isFilterLCC;
        const airlineCondition =
          this.airline.length === 0 ||
          item.segments.some((sector) =>
            sector.some((key) => this.airline.includes(key.Airline.AirlineName))
          );
        const stopsCondition =
          this.numberOfStopsFilter === null ||
          item.segments.some((sector) => sector.length - 1 === this.numberOfStopsFilter);
        const cabinClassCondition =
          this.selectedCabin === 1 ||
          item.segments.some((sector) =>
            sector.some((flightClass) => flightClass.CabinClass === this.selectedCabin)
          );
  
        const layoffsCondition =
          this.layoffs.length === 0 ||
          item.segments.some((sector) =>
            sector.some((flightClass, index) => {
              if (index !== 0) {
                return this.layoffs.includes(flightClass.Origin.Airport.CityName);
              }
            })
          );
  
        const combinedCondition =
          refundableCondition &&
          lccCondition &&
          airlineCondition &&
          stopsCondition &&
          nonLccCondition &&
          nonRefundable &&
          cabinClassCondition &&
          layoffsCondition;

          // console.log(combinedCondition)
  
        return combinedCondition;
      });
  
      console.log('filtered', this.filteredFlights);
      this.getAirlineNames(this.filteredFlights);
      this.getLayoffsNames(this.filteredFlights);
    } else if (this.isFiltered && this.JourneyType === 2) {
      // when journey type is round trip
      console.log('second');
  // for first flight
      this.filteredFlights1 = this.allFlights1.filter((item) => {
        const refundableCondition = !this.isRefundable || item.isRefundable === this.isRefundable;
        const nonRefundable = !this.isNonRefundable || item.isRefundable === false;
        const nonLccCondition = !this.isFilterNonLCC || item.isLCC === false;
        const lccCondition = !this.isFilterLCC || item.isLCC === this.isFilterLCC;
        const airlineCondition =
          this.airline.length === 0 ||
          item.segments.some((sector) =>
            sector.some((key) => this.airline.includes(key.Airline.AirlineName))
          );
        const stopsCondition =
          this.numberOfStopsFilter === null ||
          item.segments.some((sector) => sector.length - 1 === this.numberOfStopsFilter);
        const cabinClassCondition =
          this.selectedCabin === 1 ||
          item.segments.some((sector) =>
            sector.some((flightClass) => flightClass.CabinClass === this.selectedCabin)
          );
  
        const layoffsCondition =
          this.layoffs.length === 0 ||
          item.segments.some((sector) =>
            sector.some((flightClass, index) => {
              if (index !== 0) {
                return this.layoffs.includes(flightClass.Origin.Airport.CityName);
              }
            })
          );
  
        const combinedCondition =
          refundableCondition &&
          lccCondition &&
          airlineCondition &&
          stopsCondition &&
          nonLccCondition &&
          nonRefundable &&
          cabinClassCondition &&
          layoffsCondition;
  
        return combinedCondition;
      });
  // for secnd fliht
      this.filteredFlights2 = this.allFlights2.filter((item) => {
        const refundableCondition = !this.isRefundable || item.isRefundable === this.isRefundable;
        const nonRefundable = !this.isNonRefundable || item.isRefundable === false;
        const nonLccCondition = !this.isFilterNonLCC || item.isLCC === false;
        const lccCondition = !this.isFilterLCC || item.isLCC === this.isFilterLCC;
        const airlineCondition =
          this.airline.length === 0 ||
          item.segments.some((sector) =>
            sector.some((key) => this.airline.includes(key.Airline.AirlineName))
          );
        const stopsCondition =
          this.numberOfStopsFilter === null ||
          item.segments.some((sector) => sector.length - 1 === this.numberOfStopsFilter);
        const cabinClassCondition =
          this.selectedCabin === 1 ||
          item.segments.some((sector) =>
            sector.some((flightClass) => flightClass.CabinClass === this.selectedCabin)
          );
  
        const layoffsCondition =
          this.layoffs.length === 0 ||
          item.segments.some((sector) =>
            sector.some((flightClass, index) => {
              if (index !== 0) {
                return this.layoffs.includes(flightClass.Origin.Airport.CityName);
              }
            })
          );
  
        const combinedCondition =
          refundableCondition &&
          lccCondition &&
          airlineCondition &&
          stopsCondition &&
          nonLccCondition &&
          nonRefundable &&
          cabinClassCondition &&
          layoffsCondition;
  
        return combinedCondition;
      });
  // for first flight
      this.getAirlineNames(this.filteredFlights1);
      this.getAirlineNames(this.filteredFlights2);
      // for second flight
      this.getLayoffsNames(this.filteredFlights1);
      this.getLayoffsNames(this.filteredFlights2);
    } else if (!this.isFiltered && this.JourneyType !== 2) {
      // for one way or multicity when no filters are applied
      console.log('third');
      this.filteredFlights = this.response?.flightsData;
      this.getAirlineNames(this.filteredFlights);
      this.getLayoffsNames(this.filteredFlights);
    } else if (!this.isFiltered && this.JourneyType === 2) {
      // for one way or multicity when no filters are applied

      console.log('fourth');
      this.filteredFlights1 = this.response?.flightsData1;
      this.filteredFlights2 = this.response?.flightsData2;
      this.getAirlineNames(this.filteredFlights1);
      this.getAirlineNames(this.filteredFlights2);
      this.getLayoffsNames(this.filteredFlights1);
      this.getLayoffsNames(this.filteredFlights2);
    }

    this.spinner.hide()
  }
 
  
  
  
  
  
  
  // Call this function whenever any of the filter conditions change
  applyFilters() {
    console.log('apply')
    this.isFiltered=true;
    this.filterFlights();
  }
  
  //  to get all unique airline Names
  
  getAirlineNames( flights:any){
    console.log(flights)

    flights.map((item)=>{
      item.segments.map((sectors)=>{
        sectors.map((key)=>{
          this.airlineNames.add(key.Airline.AirlineName)
        })
      })
    })
    console.log('names',this.airlineNames)
  }

  // to get all the layover names
  getLayoffsNames( flights:any){
    console.log(flights)
    flights.map((item)=>{
      item.segments.map((sectors)=>{
        
          sectors.map((key,index)=>{
            // console.log(index)
            if(index!==0){
            this.layoffNames.add(key.Origin.Airport.CityName)
            }
          })
        
      })
    })
    console.log('layoffs',this.layoffNames)
  }
  
  // update the filtered flight according to the airline name selected
  updateNamesArray(sector: any, isChecked: boolean){
    if (isChecked) {
      this.airline.push(sector);
     
    } else {
      // Remove the sector from the array
      const index = this.airline.findIndex(s => s === sector);
      if (index !== -1) {
        this.airline.splice(index, 1);
      }
      
    }
    console.log(this.airline)
      this.applyFilters()
  }
  // update the filtered flight according to the layouvers selected
  updateLayoffArray(sector: any, isChecked: boolean){
    if (isChecked) {
      this.layoffs.push(sector);
     
    } else {
      // Remove the sector from the array
      const index = this.layoffs.findIndex(s => s === sector);
      if (index !== -1) {
        this.layoffs.splice(index, 1);
      }
      
    }
    console.log(this.layoffs)
      this.applyFilters()
  }


  // to update the calendarfare  recieved from the flight input sidebar for a one way trip
  handleCalendarData(event:any){
    console.log(event.data.Response)
    this.calendarFare=event.data.Response
  }

  handleTravellerCounts(event:any){
    console.log(event)

  }

  // reset all the filters
  handleFilterReset(){
    this.isRefundable=false;
    this.isNonRefundable=false;
    this.isFilterLCC=false;
    this.isFilterNonLCC=false;
    this.selectedCabin=1
    this.numberOfStopsFilter=null;
    this.airline=[]
    this.layoffs=[]
    this.applyFilters()

    this.cdr.detectChanges();
  

  }
}
