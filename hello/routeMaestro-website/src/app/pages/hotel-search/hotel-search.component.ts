import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HotelInputSidebarComponent } from 'src/app/components/hotel-input-sidebar/hotel-input-sidebar.component';
import { NgxSpinnerService } from 'ngx-spinner';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { GlobalService } from 'src/app/Services/global/global.service';
@Component({
  selector: 'app-hotel-search',
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.scss']
})
export class HotelSearchComponent implements OnInit {
  threeStarRating:number=null
  fourStarRating:number=null
  fiveStarRating:number=null;
  count:number=20;

  // user rating
  threeUserRating:number=null
  fourUserRating:number=null
  fourPointTwoUserRating:number=null
  selectedFlightIndex:number;
  filteredHotels:any;
  allHotels:any;
  roomGuests:any;
  nationality:string;
  response:any;
  @ViewChild(HotelInputSidebarComponent, { static: false }) childComponent: HotelInputSidebarComponent;
  checkOutDate: any;
  countryCode: any;
  cityId: any;
  ascending:boolean=false;
  descending:boolean=false;
  selectedSortOrder:string='lowToHigh';
  payloadData:any;
  resultCount:number;
  tripData: any;
  underCancellation:boolean=null;
  private key:string="ABCD1234"
  constructor(private spinner: NgxSpinnerService,public global:GlobalService) { }

  ngOnInit(): void {
    // to get already search hotel if there is any
    if(sessionStorage.getItem('hotels')){
      const decrypt=sessionStorage.getItem('hotels')
      this.handleDecryptData(decrypt)

    }
   
  }
// decrypt the encrypted object
  handleDecryptData(decrypt:any){
    console.log(decrypt)
    this.allHotels=decrypt.hotels;
    this.tripData=decrypt.trip
    this.payloadData=decrypt.payload
    console.log(this.allHotels)
    this.filterHotels()

    this.roomGuests=this.tripData.RoomGuests
    this.checkOutDate=this.tripData.CheckOutDate
    this.nationality=this.tripData.nationality
    this.countryCode=this.tripData.countryCode
    this.cityId=this.tripData.cityId
  }

// handling the search payload data
  handlePayloadData(event:any){
    console.log(event)
    this.payloadData=event
    this.resultCount=event.ResultCount
  }

  async loadMore(){
    this.spinner.show()
    this.count+=20;
    this.spinner.hide()
  
    
  }

  // to encrypt the data
  encryptObject(obj: any): string {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(obj), this.key).toString();
    return encrypted;
  }

  // to decrypt the data
  decryptObject(encryptedData: string): any {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  }
  
// filters
  onStarCheckboxChange(control: string, rating: number) {
    this[control] = this[control] === null ? rating : null;
    setTimeout(() => this.filterHotels()); // Use setTimeout to trigger change detection
  }
  
  onUserCheckboxChange(control: string, rating: number) {
    this[control] = this[control] === null ? rating : null;
    setTimeout(() => this.filterHotels()); // Use setTimeout to trigger change detection
  }
  

  // handle the response data from the input sidebar 
  handleResponseChange(event:any){
    console.log(event)
    this.allHotels=event.data;
    console.log(this.allHotels)
    this.filterHotels()
    this.IsUnderCancellation()
    const payload={hotels:this.allHotels,trip:this.tripData,payload:this.payloadData}
    sessionStorage.setItem('hotels',this.encryptObject(payload))

  }

  // to get the search trip data
  handleRoomGuests(event:any){
    this.tripData=event
    this.roomGuests=event.roomGuests
    this.checkOutDate=event.checkOutDate
    this.nationality=event.nationality
    this.countryCode=event.countryCode
    this.cityId=event.cityId
    console.log(this.roomGuests)
    this.spinner.show()
  }

  // to filter hotels on certain conditions
  filterHotels() {
    console.log('filtering');
  
    const shouldFilter = (
      this.threeStarRating !== null ||
      this.fourStarRating !== null ||
      this.fiveStarRating !== null ||
      this.threeUserRating !== null ||
      this.fourUserRating !== null ||
      this.fourPointTwoUserRating !== null 
    );
  
    if (shouldFilter) {
      this.filteredHotels = this.allHotels.map(item => ({
        ...item,
        Response: item.Response.filter(hotel => {
          // trip advisor is for user rating
          const tripAdvisorRating = hotel.search.TripAdvisor?.Rating;
  
          return (
            (this.threeStarRating !== null && hotel.search.StarRating === 3) ||
            (this.fourStarRating !== null && hotel.search.StarRating === 4) ||
            (this.fiveStarRating !== null && hotel.search.StarRating === 5) ||
            (this.threeUserRating !== null && tripAdvisorRating !== undefined && tripAdvisorRating >= 3) ||
            (this.fourUserRating !== null && tripAdvisorRating !== undefined && tripAdvisorRating >= 4) ||
            (this.fourPointTwoUserRating !== null && tripAdvisorRating !== undefined && tripAdvisorRating >= 4.2  )
          );
        })
      }));
    } else {
      // No filtering conditions specified, return the original data
      this.filteredHotels = this.allHotels.slice();
    }
  
    console.log(this.filteredHotels);
    this.spinner.hide()
    
  }

  

//  sorting filters accroding to price


// sort ascebding order
  sort() {
    this.filteredHotels[0].Response.sort((a, b) => {
      const priceA = a.search.Price.PublishedPriceRoundedOff;
      const priceB = b.search.Price.PublishedPriceRoundedOff;
      
      // Compare prices and return a value to determine sorting order
      if (priceA < priceB) {
        return -1; // a should come before b
      } else if (priceA > priceB) {
        return 1; // a should come after b
      } else {
        return 0; // prices are equal, maintain order
      }
    });
  }

  // sort in descending order
  sortDescending() {
    this.filteredHotels[0].Response.sort((a, b) => {
      const priceA = a.search.Price.PublishedPriceRoundedOff;
      const priceB = b.search.Price.PublishedPriceRoundedOff;
      
      // Compare prices in descending order
      if (priceA > priceB) {
        return -1; // a should come before b
      } else if (priceA < priceB) {
        return 1; // a should come after b
      } else {
        return 0; // prices are equal, maintain order
      }
    });
  }
  
  
  sortItems() {
    if (this.selectedSortOrder === 'lowToHigh') {
    
      this.sort()
    } else if (this.selectedSortOrder === 'highToLow') {
      // Sort items high to low
     this.sortDescending()
    }

    console.log(this.filteredHotels)
  }

  // to console the hotels which are IsUnderCancellationALlowed=false
  
  IsUnderCancellation() {
    const hotel = this.allHotels.map(item => ({
      ...item,
      Response: item.Response.filter(hotel => {
        // Check if IsUnderCancellationAllowed is false for the room
        return (
          hotel?.room?.GetHotelRoomResult?.IsUnderCancellationAllowed === false
        );
      })
    }));
  
    console.log(hotel);
  
    // Convert the filtered hotel data to a JSON string
    const jsonString = JSON.stringify(hotel, null, 2);
    
    // Create a Blob containing the JSON string
    const blob = new Blob([jsonString], { type: "text/plain" });
    
    // Create a link element
    const link = document.createElement("a");
    
    // Set the download attribute and create a URL pointing to the Blob
    link.download = "filteredHotels.json";
    link.href = window.URL.createObjectURL(blob);
    console.log(link)
    // Append the link to the document body and trigger a click event to download
    document.body.appendChild(link);
    link.click();
  }
  
//  to reset all the filters
  handleFilterReset(){
    this.threeStarRating = null 
      this.fourStarRating = null
      this.fiveStarRating = null
      this.threeUserRating = null
      this.fourUserRating = null 
      this.fourPointTwoUserRating = null
      this.filterHotels()
  }
}

