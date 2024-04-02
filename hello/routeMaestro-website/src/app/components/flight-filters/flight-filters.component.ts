import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-flight-filters',
  templateUrl: './flight-filters.component.html',
  styleUrls: ['./flight-filters.component.scss']
})
export class FlightFiltersComponent implements OnInit {

  @Output() responseChanges: EventEmitter<any> = new EventEmitter<any>();
  @Input() journey:number;
  @Input() response:any;
  isRefundable:boolean=false;
  isNonRefundable:boolean=true;
  isLCC:boolean=false;
  isNonLCC:boolean=true;
  isFiltered:boolean=true;
  filteredFlights:any;
  filteredFlights1:any;
  filteredFlights2:any;
  numberOfStopsFilter: number=1;
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
  constructor() { }

  ngOnInit(): void {
    // this.applyFilters()
    console.log(this.journey)
    console.log(this.response)
    if(this.journey!==2){
      this.allFlights=this.response?.flightsData
    }else{
      this.allFlights1=this.response?.flightsData1
      this.allFlights2=this.response?.flightsData2
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
      this.isLCC=true;
    }else{
      this.isLCC=false;
    }
    this.applyFilters()
  }
  toggleNonLCC(isChecked: string) {
 
    if(isChecked){
      this.isNonLCC=true;
    }else{
      this.isNonLCC=false;
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
    console.log(this.allFlights)
    console.log(this.allFlights2)
    console.log(this.allFlights1)

    console.log(this.isLCC)
    console.log(this.isNonLCC)
    console.log(this.isRefundable)
    console.log(this.isNonRefundable)
    console.log(this.airline)
    console.log(this.layoffs)
    console.log(this.numberOfStopsFilter)
    console.log(this.selectedCabin)
    if (this.isFiltered && this.journey!==2) {
      console.log('first')
      
      this.filteredFlights = this.allFlights.filter((item) => {
        const refundableCondition = !this.isRefundable || item.isRefundable === this.isRefundable;
        const nonRefundable = !this.isNonRefundable || item.isRefundable === false;
        const nonLccCondition = !this.isNonLCC || item.isLCC === false;
        const lccCondition = !this.isLCC || item.isLCC === this.isLCC;
        const airlineCondition =
          this.airline.length === 0 ||
          item.segments.some((sector) =>
            sector.some((key) => this.airline.includes(key.Airline.AirlineName))
          );
        const stopsCondition =
          this.numberOfStopsFilter === null ||
          item.segments.some((sector) => sector.length - 1 === this.numberOfStopsFilter);
        const cabinClassCondition =
          this.selectedCabin === 1 || // Change from === to !==
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
                // Missing return statement
              })
            );
  
        // Combine conditions using logical AND
        const combinedCondition =
          refundableCondition &&
          lccCondition &&
          airlineCondition &&
          stopsCondition &&
          nonLccCondition &&
          nonRefundable &&
          cabinClassCondition && layoffsCondition;
  
        return combinedCondition;
      });

      console.log('filtered',this.filteredFlights)
      this.getAirlineNames(this.filteredFlights);
    this.getLayoffsNames(this.filteredFlights);
    } else if(this.isFiltered && this.journey===2) {
      console.log('second')
      // Include all data when no filters are active
      this.filteredFlights1 = this.allFlights1.filter((item) => {
        const refundableCondition = !this.isRefundable || item.isRefundable === this.isRefundable;
        const nonRefundable = !this.isNonRefundable || item.isRefundable === false;
        const nonLccCondition = !this.isNonLCC || item.isLCC === false;
        const lccCondition = !this.isLCC || item.isLCC === this.isLCC;
        const airlineCondition =
          this.airline.length === 0 ||
          item.segments.some((sector) =>
            sector.some((key) => this.airline.includes(key.Airline.AirlineName))
          );
        const stopsCondition =
          this.numberOfStopsFilter === null ||
          item.segments.some((sector) => sector.length - 1 === this.numberOfStopsFilter);
        const cabinClassCondition =
          this.selectedCabin === 1 || // Change from === to !==
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
                // Missing return statement
              })
            );
  
        // Combine conditions using logical AND
        const combinedCondition =
          refundableCondition &&
          lccCondition &&
          airlineCondition &&
          stopsCondition &&
          nonLccCondition &&
          nonRefundable &&
          cabinClassCondition && layoffsCondition;
  
        return combinedCondition;
      });
      this.filteredFlights2 = this.allFlights2.filter((item) => {
        const refundableCondition = !this.isRefundable || item.isRefundable === this.isRefundable;
        const nonRefundable = !this.isNonRefundable || item.isRefundable === false;
        const nonLccCondition = !this.isNonLCC || item.isLCC === false;
        const lccCondition = !this.isLCC || item.isLCC === this.isLCC;
        const airlineCondition =
          this.airline.length === 0 ||
          item.segments.some((sector) =>
            sector.some((key) => this.airline.includes(key.Airline.AirlineName))
          );
        const stopsCondition =
          this.numberOfStopsFilter === null ||
          item.segments.some((sector) => sector.length - 1 === this.numberOfStopsFilter);
        const cabinClassCondition =
          this.selectedCabin === 1 || // Change from === to !==
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
                // Missing return statement
              })
            );
  
        // Combine conditions using logical AND
        const combinedCondition =
          refundableCondition &&
          lccCondition &&
          airlineCondition &&
          stopsCondition &&
          nonLccCondition &&
          nonRefundable &&
          cabinClassCondition && layoffsCondition;
  
        return combinedCondition;
      });
  
      this.getAirlineNames(this.filteredFlights1);
      this.getAirlineNames(this.filteredFlights2);
      this.getLayoffsNames(this.filteredFlights1);
      this.getLayoffsNames(this.filteredFlights2);
    }else if(!this.isFiltered && this.journey!==2){
      console.log('third')
      this.filteredFlights = this.response?.flightsData;
      this.getAirlineNames(this.filteredFlights);
    this.getLayoffsNames(this.filteredFlights);
    }else if(!this.isFiltered && this.journey===2){
      console.log('fourth')
      this.filteredFlights1 = this.response?.flightsData1;
      this.filteredFlights2 = this.response?.flightsData2;
      this.getAirlineNames(this.filteredFlights1);
      this.getAirlineNames(this.filteredFlights2);
      this.getLayoffsNames(this.filteredFlights1);
      this.getLayoffsNames(this.filteredFlights2);
    }

   
    this.responseChanges.emit(this.filteredFlights)
  
  
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
  


}
