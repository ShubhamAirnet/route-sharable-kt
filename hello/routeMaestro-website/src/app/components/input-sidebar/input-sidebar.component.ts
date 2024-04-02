import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CountriesService } from 'src/app/Services/countries.service';
import { Countries } from 'src/app/classes/countries';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Airports } from 'src/app/classes/airport';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription, combineLatest } from 'rxjs';
import { CityDetail } from 'src/app/classes/city';
import { CITY_JSON } from 'src/app/classes/citiesJson';
import { CITY_DETAIL } from 'src/app/classes/cityDetail';
import { Papa } from 'ngx-papaparse';
import { FlightsService } from 'src/app/Services/flights_api/flights.service';


@Component({
  selector: 'app-input-sidebar',
  templateUrl: './input-sidebar.component.html',
  styleUrls: ['./input-sidebar.component.scss']
})
export class InputSidebarComponent implements OnInit {
 
  selectedCountry: string = '';
  searchText: string = '';
  filteredData: string[] = [];
  selectedStartDate: string = ''; 
  selectedEndDate: string = '';   
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  dateModel: NgbDateStruct = this.calendar.getToday();
  @ViewChild('collapseTwoElement') collapseTwoElement: ElementRef;
  selectedAirport: string = '';
  active = 1;
  searchText1: string = '';
  searchText2: string = '';
  filteredAirports: any;
  selectedNature: string = '';
  numberFormControl = new FormControl(0);
  numberFormControl1 = new FormControl(0);
  adultsValue = 0;
  childrenValue = 0;
  selectedMonth: string = '';
  selectedDate: string = '';
  selectedDays: string = '';
  selectedTravelers: string = '';
  selectedStar: string = '';
  selectedPrice: string = '';
  selectedProperty: string = '';
  selectedCities: string[] = [];
  ageInputValue: number;
  visaTypeData!: string;
  numberFormControl2: FormArray;
  selectedTravelersSubscription!: Subscription;
  noOfChildren: number = 0;
  filteredCities: string[] = [];
  citiesWithDetails: { cityName: string; cityDetails: CityDetail }[] = [];
  selectedRecommendedMonths: string[] = [];
  selectedVisaType: string = '';
  cities: any[];
  hoveredDate: NgbDate | null = null;

  journeyType:number=1;
  fareType:number=2;

  airportCodes:any;
  constructor( private countryService: CountriesService,
      private calendar: NgbCalendar,
      public formatter: NgbDateParserFormatter,
      private papa:Papa,
      private fb: FormBuilder,
      private flights:FlightsService) { 
        this.fromDate = calendar.getToday();
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
        this.selectedTravelersSubscription = this.countryService
          .getSelectedTravelers()
          .subscribe((travelers: string) => {
            console.log(travelers)
            this.selectedTravelers = travelers;
          });
          this.numberFormControl2 = new FormArray([]);
  }

  ngOnInit(): void {
    
    this.convertCSVToJson()

    combineLatest([this.countryService.getSelectedCountry(),
    this.countryService.getSelectedMonth(),
    this.countryService.getSelectedDate(),
    this.countryService.getSelectedAirport(),
    this.countryService.getSelectedDays(),
    this.countryService.getSelectedNature(),
    this.countryService.getSelectedStar(),
    this.countryService.getSelectedPrice(),
    this.countryService.getSelectedProperty(),
    this.countryService.getSelectedTravelers(),
    this.countryService.getSelectedCities()
    ]).subscribe(([country, month, date, airport, days, nature, star, price, property, travelers, city]) => {
      this.selectedCountry = country;
      this.selectedMonth = month;
      this.selectedDate = date;
      this.selectedAirport = airport;
      this.selectedDays = days;
      this.selectedNature = nature;
      this.selectedStar = star;
      this.selectedPrice = price;
      this.selectedProperty = property;
      this.selectedTravelers = travelers;
      this.selectedCities = city;

    
    })

    this.countryService.getSelectedVisaType().subscribe(visaType => {
      this.visaTypeData = visaType;
    })
  }

  filterData(): void {
    console.log(this.searchText)
    this.filteredData = this.airportCodes.filter((data) =>
      data?.cityName?.toLowerCase().includes(this.searchText.toLowerCase())
    );
    console.log('filtered', this.filteredData);
  }
  

  // getCountryDetails(countryName: string): { recommendedMonths: string[]; visaType: string } {
  //   const cityData = .find(
  //     (city) =>
  //       city.Continent === countryName ||
  //       city.countries.some(
  //         (country: { Country: string; Cities: any }) =>
  //           country.Country === countryName || country.Cities.includes(countryName)
  //       )
  //   );
  //   let countryData: { Country: string; 'Recommended Months': string[]; 'Visa Types': string } | undefined;
  //   if (cityData && cityData.Continent === countryName) {
  //     // If the selectedCountry is a continent, get the data for the first country within that continent
  //     const countriesInContinent = cityData.countries;
  //     if (countriesInContinent.length > 0) {
  //       countryData = countriesInContinent[0];
  //     }
  //   } else if (cityData) {
  //     // If the selectedCountry is a city or a country, find the corresponding country data
  //     countryData = cityData.countries.find(
  //       (country: { Country: string; Cities: any }) =>
  //         country.Country === countryName || country.Cities.includes(countryName)
  //     );
  //   }
  //   const recommendedMonths = countryData?.['Recommended Months'] || [];
  //   const visaType = countryData?.['Visa Types'] || '';
  //   return { recommendedMonths, visaType };
  // }
  // getCitiesByCountryOrContinent(): void {
  //   this.citiesWithDetails = []; // Reset the array
  //   this.cities = []; // Clear the cities array

  //   if (!this.selectedCountry) {
  //     // No country or continent selected, return early
  //     // this.toastr.error('Please Select Country.', 'Warning')
  //     return;
  //   }

  //   const selectedCountryData = this.airportCodes.find((city) =>
  //     city.countries.some((country: { Country: string }) => country.Country === this.selectedCountry)
  //   );

  //   if (selectedCountryData) {
  //     // Get cities for the selected country
  //     this.cities = selectedCountryData.countries
  //       .filter((country: { Country: string }) => country.Country === this.selectedCountry)
  //       .flatMap((country: { Cities: any }) => country.Cities);
  //   } else {
  //     // No matching country data found, check for matching continent
  //     const selectedContinentData = CITY_JSON.find((city) => city.Continent === this.selectedCountry);

  //     if (selectedContinentData) {
  //       // Get cities for the selected continent
  //       this.cities = selectedContinentData.countries.flatMap((country: { Cities: any }) => country.Cities);
  //     } else {
  //       // Treat selectedCountry as a single city and get cities for the matching country
  //       for (const continent of CITY_JSON) {
  //         for (const country of continent.countries) {
  //           for (const city of country.Cities) {
  //             if (city === this.selectedCountry) {
  //               this.cities = country.Cities;
  //               break; // Exit the loop since we found a match
  //             }
  //           }
  //           if (this.cities.length > 0) {
  //             break; // Exit the loop since we found cities for the matching country
  //           }
  //         }
  //         if (this.cities.length > 0) {
  //           break; // Exit the loop since we found cities for the matching country
  //         }
  //       }
  //     }
  //   }

  //   // Retrieve additional city details from CITY_DETAIL using the city name
  //   this.citiesWithDetails = this.cities.map((cityName: string) => ({
  //     cityName: cityName,
  //     cityDetails: this.getCityDetails(cityName),
  //   }));
  // }

  // getCityDetails(cityName: string): CityDetail {
  //   const cityDetail = this.airportCodes.find((city) => city?.cityName === cityName);
  //   // console.log('City Detail:', cityDetail);
  //   return cityDetail?.[cityName] || {} as CityDetail;
  // }
  onSearchChange(): void {
    this.filterData();
  }
  // onCountrySelect(data: string): void {
  //   this.countryService.setSelectedCountry(data);
  // }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.toggleCollapse();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.selectedStartDate = `${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`;
    this.selectedEndDate = this.toDate ? `${this.toDate.year}-${this.toDate.month}-${this.toDate.day}` : '';
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

  toggleCollapse() {
    const collapseElement: HTMLElement = this.collapseTwoElement.nativeElement;
    if (collapseElement.classList.contains('show')) {
      // Collapse is currently open, close it.
      collapseElement.classList.remove('show');
    } else {
      // Collapse is currently closed, open it.
      collapseElement.classList.add('show');
    }
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  filterAirports(): void {
    this.filteredAirports = this.airportCodes.filter(airport =>
      airport?.cityName?.includes(this.searchText1) ||
      airport?.cityCode?.includes(this.searchText1)
    );
    console.log('filtered airports',this.filteredAirports)
  }

  incAdultCount() {
    const currentValue = this.numberFormControl.value;
    console.log(currentValue)
    if (currentValue !== null) {
      const newValue = currentValue + 1;
      this.numberFormControl.setValue(newValue);
      // const formGroup = this.addTripModelFormGroup(); 
      // formGroup.controls['travellers'].setValue(newValue);
     
    }
    console.log(this.numberFormControl)
  }
  
  decAdultCount() {
    const currentValue = this.numberFormControl.value;
    console.log(currentValue)
    if (currentValue !== null) {
      const newValue = currentValue - 1;
      this.numberFormControl.setValue(newValue);

    }
    console.log(this.numberFormControl)
  }

  
  incChildCount() {
    const currentValue2 = this.ageInputValue; 
    if (currentValue2 !== null) {
      this.noOfChildren = this.numberFormControl2.length + 1;
      const index = this.numberFormControl2.length + 1; 
      const childFormGroup = this.createChildFormGroup(index, currentValue2); // Create a new child form group
      this.numberFormControl2.push(childFormGroup); // Add the child form group to the FormArray
      console.log(currentValue2);
      console.log(this.numberFormControl2.value);
      this.ageInputValue = null; 
    }
  }

  incInfantCount() {
    const currentValue1 = this.numberFormControl1.value;
    if (currentValue1 !== null) {
      this.numberFormControl1.setValue(currentValue1 + 1);
    }
  }

  decInfantCount() {
    const currentValue1 = this.numberFormControl1.value;
    if (currentValue1 !== null) {
      this.numberFormControl1.setValue(currentValue1 - 1);
    }
  }

  onAirportSelect(airport: any): void {
    // this.countryService.setSelectedAirport(airport?.cityName);
    this.selectedAirport = airport?.cityName;
    this.active = 4;
  }

  onSearchChange1(): void {
    console.log('search called')
    this.filterAirports();
  }

  // selectNature(nature: string): void {
  //   this.countryService.setSelectedNature(nature);
  //   this.selectedNature = nature;
  // }

  noOfTraveler(value: string): void {
    const adults = this.numberFormControl.value || 0;
    const children = this.numberFormControl1.value || 0;

    // Convert adults and children values to strings
    const adultsStr = adults.toString();
    const childrenStr = children.toString();

    // Save adults and children separately as strings
    this.countryService.setSelectedAdults(adultsStr);
    this.countryService.setSelectedChildren(childrenStr);

    this.adultsValue = adults;
    this.childrenValue = children;
    this.active = 6;
  }

  
  onCitySelect(cityName: string): void {
    const index = this.selectedCities.indexOf(cityName);
    if (index > -1) {
      this.selectedCities.splice(index, 1); // Remove the city if already selected
    } else {
      this.selectedCities.push(cityName); // Add the city name if not already selected
    }
  }
  onSearchCity(): void {
    console.log('city search called')
    this.filterCities();
  }
filterCities(): void {
  console.log('filter city');
  
  if (this.searchText2.trim() === '') {
    this.filteredCities = this.airportCodes.slice(0, 4).map(city => city?.cityName);
  } else {
    this.filteredCities = this.airportCodes
      .filter(city => city?.cityName.toLowerCase().includes(this.searchText2.toLowerCase()))
      .map(city => city?.cityName);
  }

  console.log('filteredCities', this.filteredCities);
}

  createChildFormGroup(index: number, age: number): FormGroup {
    return this.fb.group({
      index: this.fb.control(index), // Set the index value
      age: this.fb.control(age) // Set the age value
    });
  }

  createDocument() {
    const data = {
      selectedCountry: this.selectedCountry,
      selectedMonth: this.selectedMonth,
      selectedAirport: this.selectedAirport,
      selectedStartDate: this.selectedStartDate,
      selectedEndDate: this.selectedEndDate,
      // selectedDate: this.selectedDate,
      selectedDays: this.selectedDays,
      selectedNature: this.selectedNature,
      selectedTravelers: this.selectedTravelers,
      adultsValue: this.numberFormControl.value,
      childrenValue: this.numberFormControl1.value,
      selectedCities: this.selectedCities,
      selectedPrice: this.selectedPrice,
      selectedStar: this.selectedStar,
      selectedProperty: this.selectedProperty,
      JourneyType:this.journeyType,
      FareType:this.fareType
    };
    window.sessionStorage.setItem('myData', JSON.stringify(data));
    console.log(data);
    // setDoc(doc(this.db, collectionName, documentId), data)
    const storedData = window.sessionStorage.getItem('myData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("session Data:", parsedData);
    }

  }

  buildItinerary(): void {
    console.log('building')
    this.countryService.setSelectedCities(this.selectedCities);
    this.createDocument();

  }

  toggleJourney(cabin: number, isChecked: boolean) {
   
    if (isChecked) {
      this.journeyType = cabin; 
   
    }else{
      this.journeyType=1;
    }

    console.log(this.journeyType)
}

selectFareType(index:number,isChecked: boolean){
  if(isChecked){
    this.fareType=index
  }else{
    this.fareType=2;
  }
  console.log(this.fareType)
}

async convertCSVToJson() {
  console.log()
  // const res = await fetch('http://localhost:4000/hotel/getCsvData');
  const res=await this.flights.getCsvData();
  const csvData = await res.text();

  // Now you can parse the CSV data and work with it
  this.papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
    complete: (result) => {
      // The parsed CSV data is available in the 'result.data' array
      const jsonData = result.data;
      console.log('JSON data:', jsonData);
      this.airportCodes=jsonData;
      console.log(this.airportCodes)
      this.filterData();
    this.filterAirports();
      
    },
    error: (error) => {
      console.error('CSV parsing error:', error);
    }
  });

}
}
