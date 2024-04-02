import { Component,ViewEncapsulation , ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PackageService } from 'src/app/Services/package/package.service';
import { Papa } from 'ngx-papaparse';
import { json } from 'stream/consumers';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FlightsService } from 'src/app/Services/flights_api/flights.service';
import { HotelBookingService } from 'src/app/Services/hotels_booking/hotel-booking.service';
import axios from 'axios';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { HotelsService } from 'src/app/Services/hotels_api/hotels.service';
@Component({
  selector: 'app-hotel-input-sidebar',
  templateUrl: './hotel-input-sidebar.component.html',
  styleUrls: ['./hotel-input-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HotelInputSidebarComponent implements OnInit {
  selectedCity:string;
  cityCodes:any;
  searchText1:string;
  searchText2:string;
  filteredCities:any;

  selectedEndDate:string;
  selectedStartDate:string;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  childAge=[] as any;
  adultsValue = 0;
  childrenValue = 0;
  ageInputValue: number;

  numberFormControl = new FormControl(0);
  numberFormControl1 = new FormControl(0);
  
  noOfChildren: number = 0;

  dateModel: NgbDateStruct = this.calendar.getToday();


  cityId:number;
  cityName:string;
  countryCode:string;
  showDatepicker1 = false;
  showDatepicker2 = false;
  minDate: NgbDateStruct;
  minDate2: NgbDateStruct;
  selectedDate1: NgbDateStruct;
  selectedDate2: NgbDateStruct;

  Rooms=[] as any;
  totalTravelers:number=0;
  NoOfRooms:number=1;

  countryCodes:any;
  filteredCountries:any;
  resultCount:number=5;
  hotelUid:string;
  

  @ViewChild('collapseTwoElement') collapseTwoElement: ElementRef;
  response: any;
  guestNationality: any;

  private key='ABCD1234'

  @Output() responseData: EventEmitter<any> = new EventEmitter<any>();
  @Output() roomGuests: EventEmitter<any> = new EventEmitter<any>();
  @Output() payloadData: EventEmitter<any> = new EventEmitter<any>();


  constructor(private pack:PackageService,private hotels:HotelsService,private datePipe: DatePipe,private hotelBook:HotelBookingService,public formatter: NgbDateParserFormatter,private papa:Papa, private calendar: NgbCalendar, private flights:FlightsService,private fb: FormBuilder,) { 
    const currentDate = new Date();
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
 
    this.minDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
  }

  ngOnInit(): void {
    this.hotelUid=sessionStorage.getItem('hotel_uid')
   
    this.convertCSVToJsonCity()
    this.convertCSVToJsonCountry()
    // if(this.hotelUid){
    //   this.getAllDetails()
    // }
    // if(sessionStorage.getItem('hotelPayload')){
    //   const decrypt=this.decryptObject(sessionStorage.getItem('hotelPayload'))
    //   console.log(decrypt)
    //   this.handleDecryptData(decrypt)
    // }
  }


  formatSingleDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
// to calculate no of nights according to checkin and checkout date
  calculateNights(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Calculate the time difference in milliseconds
    const timeDifference = end.getTime() - start.getTime();
  
    // Calculate the number of nights (1 day = 24 hours)
    const nights = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  
    return nights;
  }
// csv to json countrycodes conversion
  async convertCSVToJsonCountry() {
    console.log()
    // const res = await fetch('http://localhost:4000/hotel/getCsvData');
    const res=await this.flights.getCountryData();
    const csvData = await res.text();
  
    // Now you can parse the CSV data and work with it
    this.papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        // The parsed CSV data is available in the 'result.data' array
        const jsonData = result.data;
        console.log('JSON data:', jsonData);
        this.countryCodes=jsonData;
        console.log(this.countryCodes)
        // this.filterData();
      
        
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
      }
    });
  
  }

  // csv to json citycode conversion
  async convertCSVToJsonCity() {
    // const res = await fetch('http://localhost:4000/hotel/getCsvData');
    const res=await this.pack.getCsvData();
    const csvData = await res.text();
  
    // Now you can parse the CSV data and work with it
    this.papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        // The parsed CSV data is available in the 'result.data' array
        const jsonData = result.data;
        console.log('JSON data:', jsonData);
        this.cityCodes=jsonData;
        console.log(this.cityCodes)
        console.log(typeof(this.cityCodes[0].COUNTRY))
        console.log(typeof(this.cityCodes[0].CITYID))
        console.log(typeof(this.cityCodes[0].COUNTRYCODE))
        console.log(typeof(this.cityCodes[0].DESTINATION))
        console.log(typeof(this.cityCodes[0]))
        console.log(typeof(this.cityCodes))
        
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
      }
    });
  
  }

  // to filter cities according to the search input
  onSearchChange1(): void {
    console.log('search called')
    this.filterCities();
  }
  // filter cities according  to the input text for destination 
  filterCities(): void {
    const searchTextLower = this.searchText1.toLowerCase();
  
    this.filteredCities = this.cityCodes.filter(city =>
      (typeof city?.DESTINATION === 'string' && city?.DESTINATION.toLowerCase().includes(searchTextLower)) ||
      (typeof city?.COUNTRY === 'string' && city?.COUNTRY.toLowerCase().includes(searchTextLower))
    );
  
    console.log('filtered airports', this.filteredCities);
  }
  
  // to filter nationality according to the input
  onSearchCountry(): void {
    console.log('country search called')
    this.filterCountry();
  }
  filterCountry(): void {
    console.log('filter city');
    
    this.filteredCountries = this.countryCodes.filter(airport =>
      airport?.name?.toLowerCase().includes(this.searchText2.toLowerCase()) ||
      airport?.alpha2?.toLowerCase().includes(this.searchText2.toLowerCase())
    );
    console.log('filtered city',this.filteredCountries)
  
    
  }
// to get the guest nationality
  onCountrySelect(event:any){
    this.guestNationality=event.alpha2;
    console.log(this.guestNationality)
    console.log(event)
  }
  
// when selecting the city from the list
  onCitySelect(event:any){
    console.log(event)
    this.cityName=event.DESTINATION
    this.cityId=event.CITYID
    this.countryCode=event.COUNTRYCODE

  }
// when selecting checkin date
  onDateChangesCheckIn(event: any) {
    // 'event' contains the selected date
    console.log('Selected Date:', event);


    this.selectedStartDate=event;
    console.log(this.selectedStartDate)
    this.minDate2=this.selectedDate1;

  }
  // when selecting checkout date
  onDateChangesCheckOut(event: any) {
    // 'event' contains the selected date
    console.log('Selected Date:', event);

    

    this.selectedEndDate=event;
    console.log(this.selectedEndDate)
  }


  // handle no of travellers
  
  noOfTraveler(value: string): void {
    const adults = this.numberFormControl.value || 0;
    const children = this.numberFormControl1.value || 0;

 

  

    this.adultsValue = adults;
    this.childrenValue = children;

  }

  
  incAdultCount() {
    const currentValue = this.numberFormControl.value;
    if (currentValue !== null) {
      const newValue = currentValue + 1;
      this.numberFormControl.setValue(newValue);
      // const formGroup = this.addTripModelFormGroup(); 
      // formGroup.controls['travellers'].setValue(newValue);
    }
  }
  
  decAdultCount() {
    const currentValue = this.numberFormControl.value;
    if (currentValue !== null) {
      const newValue = currentValue - 1;
      this.numberFormControl.setValue(newValue);
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

  incChildCount() {
    const currentValue2 = this.ageInputValue; 
    if (currentValue2 !== null) {
      this.noOfChildren = this.childAge.length + 1;
      // Create a new child form group
      this.childAge.push((Number)(currentValue2)); // Add the child form group to the FormArray
      console.log(currentValue2);
      console.log(this.childAge);
      this.ageInputValue = null; 
    }
  }

  // create child age array according to the age input for the child
  createChildFormGroup(index: number, age: number): FormGroup {
    return this.fb.group({
      index: this.fb.control(index), // Set the index value
      age: this.fb.control(age) // Set the age value
    });
  }

  // encrypt the object
  encryptObject(obj: any): string {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(obj), this.key).toString();
    return encrypted;
  }
  // decrypt the object
  decryptObject(encryptedData: string): any {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  }
  
  authenticateFlightApi() {
    this.flights.authenticate().subscribe(
      (data: { token: string }) => {
        console.log(data.token);
        localStorage.setItem("authenticateToken", data.token);
        this.sendRequest(data.token)
        this.roomGuests.emit({countryCode:this.countryCode,cityId:this.cityId,roomGuests:this.Rooms,checkOutDate:this.selectedEndDate,nationality:this.guestNationality})
       
        
      },
      (err) => {
        console.log(err, "error aa gya");
      }
    );
  }

  // to decrypt the respone data recived from session storage and display it
  handleDecryptData(payload:any){
    this.selectedStartDate=this.convertDateFormat(this.transformDateFormat(payload.CheckInDate))
      console.log(this.selectedStartDate)
      this.selectedEndDate=this.convertDateFormat(this.transformDateFormat(payload?.CheckOutDate))
      // console.log(this.selectedEndDate)
      this.cityName=payload.CityName
      this.Rooms=payload.RoomGuests
      this.cityId=payload.CityId
      this.countryCode=payload.CountryCode;
      this.guestNationality=payload.Nationality
      payload.RoomGuests.map((item)=>{
        this.adultsValue+=item.NoOfAdults
        this.childrenValue+=item.NoOfChild
      })
      this.authenticateFlightApi()
  }
  async sendRequest(token:string) {
    console.log('in send')
    try {
      const payload={
        TokenId:token,
       
        NoOfNights:this.calculateNights(this.selectedStartDate,this.selectedEndDate),
        CheckInDate:this.selectedStartDate,
        RoomGuests:this.Rooms,
        CountryCode:this.countryCode,
        CityId:this.cityId,
        GuestNationality:this.guestNationality,
        CityName:this.cityName,

         NoOfRooms:this.Rooms.length,
         ResultCount:this.resultCount,

      }
      this.payloadData.emit(payload)

      sessionStorage.setItem('hotelPayload',this.encryptObject(payload))
    
      console.log(payload);
      
  
      const res = await this.hotels.hotelSearch(payload);
  
      if (res) {
        console.log(res)
        // console.log(res.data.data.data.Response);
        this.response=res.data;
        this.responseData.emit(this.response)
        
        
      
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // to push room in the rooms array and reset all the values for the input 
  addRoom(){
    this.Rooms.push({NoOfAdults:this.numberFormControl.value,NoOfChild:this.numberFormControl1.value,ChildAge:this.childAge})
    this.totalTravelers+=this.numberFormControl.value+this.numberFormControl1.value
    this.adultsValue+=this.numberFormControl.value
    this.childrenValue+=this.numberFormControl1.value
    this.noOfChildren=0;
    this.numberFormControl.setValue(0)
    this.numberFormControl1.setValue(0)
    this.childAge=[]
    this.NoOfRooms+=1
    console.log(this.Rooms)
  }

  // convert 2022/04/04 --> 2022-04-04
  transformDateFormat(originalDate: string): string {
    // Replace '/' with '-' in the originalDate string
    return originalDate.replace(/\//g, '-');
  }

  // convert  2022-04-04 ---> 2022/04/04 
  convertDateFormat(originalDate: string): string {
    // Split the original date string by '-'
    const parts = originalDate.split('-');
  
    // Rearrange the parts to match the desired format
    const rearrangedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  
    return rearrangedDate;
  }
  




  // to reset all the room input values such as no of adults , no of child and no of rooms
  handleReset(){
   
    this.adultsValue=0;
    this.childrenValue=0;
    this.Rooms=[];
    
  }

}
