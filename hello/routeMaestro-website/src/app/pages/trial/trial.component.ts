// trial.component.ts
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Firestore, Timestamp, collection, doc, getDoc } from 'firebase/firestore';
import { TripCity } from 'src/app/classes/resForm';
import * as utils from 'src/utils';
import { DatePipe } from '@angular/common';
import { Countries } from 'src/app/classes/countries';
import { CountriesService } from 'src/app/Services/countries.service';
import { Subscription, combineLatest } from 'rxjs';
import { PackageService } from 'src/app/Services/package/package.service';
import { Papa } from 'ngx-papaparse';
import axios from 'axios';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trial',
  templateUrl: './trial.component.html',
  styleUrls: ['./trial.component.scss']
})
export class TrialComponent implements OnInit {
  name='rahul'
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  // Define a property to store the selected item
  selectedItem: any;
  selectedDay: string ='';
selectedMonth: string ='';
selectedYear: string = '';
  // Add any other necessary properties
//   // In your component.ts
// daysInMonthArray: (number | string)[] = ['DD', ...Array.from({ length: 31 }, (_, i) => i + 1)];
// monthsArray: (string | number)[] = ['MM', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// yearsArray: (number | string)[] = ['YYYY', ...Array.from({ length: new Date().getFullYear() - 1900 + 10 }, (_, i) => 1900 + i)];

responseFormGroup:FormGroup;
  responseId: any;
  responseData: any;
  loading: boolean;
  isPreviewMode: boolean;
  updateMode: boolean;
  activitiesByCity: { [city: string]: any[] } = {};
  selectedCountry: string = '';
  numberFormControl = new FormControl(0);
  numberFormControl1 = new FormControl(0);
  ageInputValue: number;
  numberFormControl2: FormArray;
  filteredData: any;
  searchText: any;
  selectedAirport: any;
  selectedDays: any;
  selectedNature: any;
  selectedStar: any;
  selectedPrice: any;
  selectedProperty: any;
  selectedTravelers: any;
  selectedCities: any;
  selectedRecommendedMonths: any;
  selectedVisaType: any;
  visaTypeData: string;

 
  selectedDate: NgbDateStruct;
  showDatepicker = false;
  minDate: NgbDateStruct;
  
  constructor(private datePipe: DatePipe,
    //  private countryService: CountriesService,
    //  private fb: FormBuilder,
    //   private route: ActivatedRoute, 
    //   private firestore: Firestore,
    private pack:PackageService,
      private papa: Papa) {
    console.log('ftech')
    // this.convertCSVToJson()
    const currentDate = new Date();
    this.selectedDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };

    // Set the minDate to today
    this.minDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
  }
  

  ngOnInit(): void {
    // this.convertCSVToJson()
  }

  logSelectedItem() {
    console.log(this.selectedItem);
  }
  onDateChanged(event: NgbDateStruct) {
    // 'event' contains the selected date
    console.log('Selected Date:', event);

    // Close the datepicker dialog
    this.showDatepicker = false;
  }
  toggleDatepicker(dp: any) {
    this.showDatepicker = !this.showDatepicker;
    if (this.showDatepicker) {
      dp.open();
    } else {
      dp.close();
    }
  }
// getting file

// async convertCSVToJson() {
//   // const res = await fetch('http://localhost:4000/hotel/getCsvData');
//   const res=await this.pack.getCsvData();
//   const csvData = await res.text();

//   // Now you can parse the CSV data and work with it
//   this.papa.parse(csvData, {
//     header: true,
//     dynamicTyping: true,
//     complete: (result) => {
//       // The parsed CSV data is available in the 'result.data' array
//       const jsonData = result.data;
//       console.log('JSON data:', jsonData);
//       this.updateCityId(jsonData,'4LNQFdJhRjiMmBwN8pCI')
//     },
//     error: (error) => {
//       console.error('CSV parsing error:', error);
//     }
//   });

// }

// async updateCityId(jsonData:any,responseId:string){
//   try{
//     const res=await this.pack.updateCityId(jsonData,responseId)
//     if(res){
//       console.log(res)
//       console.log('updated successfully')
//     }
//   }catch(error){
//     console.log(error.message)
//   }
// }



// Inside your component class
// Inside your component class
shareOnGmail() {
  const recipient = 'recipient@example.com';  // Replace with the actual recipient email address
  const subject = 'Check out this link';
  const body = 'Hi,\n\nI found this interesting link: https://your-website.com'; // Replace with your actual website URL

  const gmailLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = gmailLink;
}

// Inside your component class
shareOnWhatsApp() {
  const message = 'Check out this link: ';
  const url = 'https://your-website.com'; // Replace with your actual website URL
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message + url)}`;

  window.open(whatsappLink, '_blank');
}



}
