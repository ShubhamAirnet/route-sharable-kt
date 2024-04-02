import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItineraryServiceService } from 'src/app/Services/itinerary-service/itinerary-service.service';
import { PackageService } from 'src/app/Services/package/package.service';
import { hotel_details } from 'src/app/components/package-cancellation/hotel_details';
import { flightData } from './flight_segments';

@Component({
  selector: 'app-package-preview',
  templateUrl: './package-preview.component.html',
  styleUrls: ['./package-preview.component.scss']
})
export class PackagePreviewComponent implements OnInit {
  responseId: any;
  travelData:any;
  flightData=flightData;
  hotelData=hotel_details;
  openIndex: number | null = null;
  travellers=[{},{}]

  checkBox1: boolean = false;
checkBox2: boolean = false;




// dialog box variables
privacyDialog:boolean=false;
termsDialog:boolean=false;
refundibleDialog:boolean=false;
packageDialog:boolean=false;
  constructor(private itinerary:ItineraryServiceService, private route: ActivatedRoute,private pack:PackageService) { }

  ngOnInit(): void {
  
    // this.getFlightData()
    this.route.params.subscribe((params) => {
      this.responseId = params.id;
      if(this.responseId){
        this.getData(this.responseId)
      }
    })
  }
  toggleDetails(index: number): void {
    console.log(index)
    this.openIndex = this.openIndex === index ? null : index;
  }

  async getData(responseId:string){
    try{
      const res=await this.itinerary.getAllData(responseId);
      console.log(res)
      this.travelData=res
    }catch(error){
      console.log(error)
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

  // async getFlightData(){
  //   try{
  //     const res=await this.pack.getAllData();
  //     console.log(res);
  //     this.flightData=res
  //   }catch(error){
  //     console.log(error)
  //   }
  // }
  getHotelData(index: number): any {
    return this.hotelData[`hotel${index}`]; // Adjust this based on your actual property names
  }
  areAllCheckboxesChecked(): boolean {
    return this.checkBox1 && this.checkBox2 ;
  }


}
