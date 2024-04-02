import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { FlightBookingService } from 'src/app/Services/flight_booking/flight-booking.service';
import { FlightsService } from 'src/app/Services/flights_api/flights.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reissuance',
  templateUrl: './reissuance.component.html',
  styleUrls: ['./reissuance.component.scss']
})
export class ReissuanceComponent implements OnInit {

  selectedDate: string;
  showDatepicker = false;
  tripDate:string=''
  minDate: NgbDateStruct;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  calendarFare: any;
  journeyType: any;
  response: any;
  reissueId:string;

  filteredFlights:any;
 
  isSelected:boolean;
  payload:any;

  isRefundable:boolean=false;
  isNonRefundable:boolean=false;
  isFilterLCC:boolean=false;
  isFilterNonLCC:boolean=false;
  isFiltered:boolean=true;

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
  trip: string;
  selectedFlightIndex: number;
  isLCC: boolean;
  airlineLogos: any;
  segments: any;
  flightData: any;

  constructor(private flights:FlightsService,private router:Router,private spinner:NgxSpinnerService,private flightBook:FlightBookingService,private route:ActivatedRoute) { 

     
  }

  ngOnInit(): void {
    this.selectedDate = this.route.snapshot.paramMap.get('date');
    console.log(this.selectedDate)
    this.reissueId=localStorage.getItem('uid')
    this.getTripDetails(this.reissueId)
  }

  
  handleClick(index: string, i: number,isLCC:boolean,airlineLogos:any,segments:any): void {
    this.trip = index;
    this.selectedFlightIndex = i;
    this.isSelected = true;
    this.isLCC=isLCC;
    this.airlineLogos=airlineLogos;
    this.segments=segments
    console.log(airlineLogos)
    console.log(segments)

    // this.router.navigate(['/package-checkout-flight']);
  }
  async handleBook(){
    if(this.isSelected){
      const value={
        resultIndex:this.trip,
        traceId:this.response.TraceId,
      
        isLCC:this.isLCC
      }
      localStorage.setItem('key', JSON.stringify(value));
      await this.updateReissue(this.airlineLogos,this.segments,this.payload,this.isLCC)
      this.router.navigate(['/reissue-checkout'])
    }
   
  }
  async updateReissue(airlineLogos:any,segments:any,tripData:any,isLCC:boolean){
    console.log('creating')
    console.log(airlineLogos)
    try{
      const res=await this.flightBook.updateReissuePackage(airlineLogos,segments,tripData,isLCC,this.reissueId);
      
    }catch(error){
      console.log(error)
    }
  }

  onDateChanges(event: NgbDateStruct) {
    // 'event' contains the selected date
    console.log('Selected Date:', event);

    // Close the datepicker dialog
    this.showDatepicker = false;

    this.tripDate=`${event.year}-${event.month}-${event.day}`;
    console.log(this.tripDate)
  }

  toggleDatepicker(dp: any) {
    this.showDatepicker = !this.showDatepicker;
    if (this.showDatepicker) {
      dp.open();
    } else {
      dp.close();
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }
  
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }
  
  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  async getTripDetails(uid:string){
    try{
      const res=await this.flightBook.getAllDetails(uid);
      console.log(res)
      this.flightData=res.flight_details
      this.payload=res.trip.tripData
      this.payload.Segments = this.payload.Segments.map((item) => {
        return {
          ...item,
          PreferredArrivalTime: this.selectedDate,
          PreferredDepartureTime: this.selectedDate
        };
      });
      await this.authenticateFlightApi()
      console.log(this.payload)
    }catch(error){
      console.log(error.message)
    }
  }
  async authenticateFlightApi() {
    this.spinner.show()
    this.flights.authenticate().subscribe(
      async (data: { token: string }) => { // Mark the callback function as async
        console.log(data.token);
        localStorage.setItem("authenticateToken", data.token);
        this.payload = {
          ...this.payload,
          TokenId: data.token
        };
        await this.sendRequest(this.payload);
        await this.getCalendarFare(this.payload)
        this.spinner.hide() // Use await inside the async function
        // this.getCalendarFare(data.token)
      },
      (err) => {
        console.log(err, "error aa gya");
      }
    );
  }
  
  
  async sendRequest(payload:any) {
    console.log('in send')
    payload={
      ...payload,
      BookingId:this.flightData.bookingDetails[0].BookingId,
      PNR:this.flightData.bookingDetails[0].PNR
    }
    console.log(payload)
    try {
      
    
  
      const res = await axios.post('http://localhost:4000/flight/searchFlightReissuance', payload);
  
      if (res) {
        console.log(res)
        // console.log(res.data.data.data.Response);
        this.response=res.data;
        console.log(this.response)
        this.allFlights=this.response?.flightsData
        this.applyFilters()
      
      }
    } catch (error) {
      console.log(error.message);
    }
  }

    
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
    console.log(this.allFlights);
  
  
    console.log(this.isFilterLCC);
    console.log(this.isFilterNonLCC);
    console.log(this.isRefundable);
    console.log(this.isNonRefundable);
    console.log(this.airline);
    console.log(this.layoffs);
    console.log(this.numberOfStopsFilter);
    console.log(this.selectedCabin);
  
    if (this.isFiltered) {
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
    }  else if (!this.isFiltered ) {
      console.log('third');
      this.filteredFlights = this.response?.flightsData;
      this.getAirlineNames(this.filteredFlights);
      this.getLayoffsNames(this.filteredFlights);
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

  
  // createFlightPayload(token:string) {
  //   const commonPayload = {
  //     TokenId: token,
  //     AdultCount: this.numberFormControl.value,
  //     ChildCount: this.numberFormControl1.value,
  //     InfantCount:this.numberFormControl3.value,
    
  //     ResultFareType: this.fareType,
  //   };
  //   console.log(commonPayload)
  
  //   if (this.journeyType === 1) {
  //     return {
  //       ...commonPayload,
  //       JourneyType: this.journeyType,
  //       Segments: [
  //         {
  //           Origin: this.source,
  //           Destination: this.destination,
  //           FlightCabinClass: '1',
  //           PreferredDepartureTime: this.tripDate,
  //           PreferredArrivalTime: this.tripDate,
  //         },
  //       ],
  //       Sources: null,
  //     };
  //   } else if (this.journeyType === 2) {
  //     return {
  //       ...commonPayload,
  //       JourneyType: this.journeyType,
  //       Segments: [
  //         {
  //           Origin: this.source,
  //           Destination: this.destination,
  //           FlightCabinClass: '1',
  //           PreferredDepartureTime: this.selectedStartDate,
  //           PreferredArrivalTime: this.selectedStartDate,
  //         },
  //         {
  //           Origin: this.destination,
  //           Destination: this.source,
  //           FlightCabinClass: '1',
  //           PreferredDepartureTime: this.selectedEndDate,
  //           PreferredArrivalTime: this.selectedEndDate
  //         },
  //       ],
  //       Sources: null,
  //     };
  //   } 
    
  // }
  
  
  async getCalendarFare(payload:any){
  
      
    try{
      const res=await axios.post('http://localhost:4000/flight/calendarFare',payload)
      console.log(res.data)
      this.calendarFare=res.data.data.data
      console.log(this.calendarFare)
     
    }catch(error){
      console.log(error.message)
    }
  }
  
}
