import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alternate-flight-options',
  templateUrl: './alternate-flight-options.component.html',
  styleUrls: ['./alternate-flight-options.component.scss']
})
export class AlternateFlightOptionsComponent implements OnInit {
 
  isOpen = true;

  @Input() allFlightSets :any;
  @Input() currentFlightSetResultIdx :string;

 // filters variable
 isRefundable:boolean=false;
 isNonRefundable:boolean=true;
 isLCC:boolean=false;
 isNonLCC:boolean=true;
 isFiltered:boolean=false;
 filteredFlights:any;
 numberOfStopsFilter: number=1;
 airline=[];
 layoffs=[];
 airlineNames: Set<string> = new Set();
 layoffNames: Set<string> = new Set();

 selectedRefundable: string | null = null;
 selectedNonRefundable: string | null = null;
 selectedLCC: string | null = null;
 selectedNonLCC: string | null = null;

  @Output() highlightedFlightSetIdxChange = new EventEmitter<string>();
  hightlightedFlightSetIdx:string;
  selectedCabin: number=1;

  constructor() { }

  ngOnInit(): void {
   


    this.applyFilters()


    this.settingHighlightedFlightSet(this.currentFlightSetResultIdx);

  }
// toggles for filters
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

  settingHighlightedFlightSet(resultIdx: string) {
    this.filteredFlights.forEach(flightSet => {
      flightSet.isSelected = flightSet.resultIndex === resultIdx;

      if(flightSet.isSelected){
        this.hightlightedFlightSetIdx=flightSet.resultIndex;
        // console.log(flightSet.resultIndex)
        // console.log(this.hightlightedFlightSetIdx);
      }
    });
  }
  
  getIdxValue(flightSet: any) {
    return flightSet.resultIndex;
  }
  
  showValue(flightSet: any) {
    this.settingHighlightedFlightSet(this.getIdxValue(flightSet));
  }

  sendHighlightedFlightSetIdx(){
     // Emit the value to the parent component
     this.highlightedFlightSetIdxChange.emit(this.hightlightedFlightSetIdx);

    this.closeModal()
  }



// filtering functions

filterFlights() {
  if (this.isFiltered) {
    this.filteredFlights = this.allFlightSets.filter((item) => {
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
  } else {
    // Include all data when no filters are active
    this.filteredFlights = this.allFlightSets;
  }

  console.log('filtered ', this.filteredFlights);
  this.getAirlineNames(this.filteredFlights);
  this.getLayoffsNames(this.filteredFlights);
}





// Call this function whenever any of the filter conditions change
applyFilters() {
  this.isFiltered=true;
  this.filterFlights();
}

//  to get all unique airline Names

getAirlineNames( flights:any){
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
  flights.map((item)=>{
    item.segments.map((sectors)=>{
      
        sectors.map((key,index)=>{
          console.log(index)
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


// filter functions ended



  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }



  

  
}
