import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, combineLatest } from 'rxjs';
import { CountriesService } from 'src/app/Services/countries.service';
import { MonthData, monthsData } from 'src/app/classes/MonthData';
import { CityDetail } from 'src/app/classes/city';
import { Countries } from 'src/app/classes/countries';
import { Trip } from 'src/app/model/trip.model';
import { PostReqService } from 'src/app/Services/post-req.service';
import { HttpClient } from '@angular/common/http';
import { CITY_DETAIL } from 'src/app/classes/cityDetail';
import { CITY_JSON } from 'src/app/classes/citiesJson';
import { City } from 'src/app/model/city.model';
import { Airports } from 'src/app/classes/airport';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CityData, ItineraryActivity, ItineraryDay, TripCity, TripData } from 'src/app/classes/resForm';
import { Firestore, Timestamp, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import * as utils from 'src/utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PackageService } from 'src/app/Services/package/package.service';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  searchText: string = '';
  filteredData: string[] = [];
  phoneNumber!: string;
  otp!: string;
  verificationInProgress = false;
  dateForm!: FormGroup;
  startDate!: NgbDateStruct;
  numberFormControl = new FormControl(0);
  numberFormControl1 = new FormControl(0);

  ageInputValue: number;
  numberFormControl2: FormArray;

  active = 1;
  searchText1: string = '';
  searchText2: string = '';
  searchCity: string = '';
  filteredAirports: string[] = [];
  filteredCities: string[] = [];
  monthsData: MonthData[] = monthsData;
  selectedCountry: string = '';
  cities: string[] = [];
  selectedMonth: string = '';
  selectedAirport: string = '';
  selectedDate: string = '';
  selectedDays: string = '';
  selectedNature: string = '';
  selectedTravelers: string = '';
  selectedStar: string = '';
  selectedPrice: string = '';
  selectedProperty: string = '';
  selectedCities: string[] = [];
  selectedTravelersSubscription!: Subscription;
  adultsValue = 0;
  childrenValue = 0;
  selectedStartDate: string = ''; 
  selectedEndDate: string = '';   
  citiesWithDetails: { cityName: string; cityDetails: CityDetail }[] = [];
  activeItem: number = 1;
  model!: NgbDateStruct;
  dateModel: NgbDateStruct = this.calendar.getToday();
  date!: { year: number; month: number; };
  tripList: Trip[] = [];
  tripForm!: FormGroup;
  show: boolean = false;
  cityList: any;
  selectedRecommendedMonths: string[] = [];
  selectedVisaType: string = '';
  sortedCities: string[] = [];
  activitiesByCity: { [city: string]: any[] } = {};
  responseData: any;
  departureAirport!: string;
  arrivalAirport!: string;
  loading: boolean = false;
  visasForm!: FormGroup;
  visaTypeData!: string;
  responseFormGroup: FormGroup;
  citiesFormGroup: FormGroup;
  responseId: string;
  updateMode: boolean = false;
  isLoaded: boolean = true;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  @ViewChild('collapseTwoElement') collapseTwoElement: ElementRef;
  isInitialMode = true;
  isEditMode = false;
  isPreviewMode = false;
  isPreviewBtn = false;
  noOfChildren: number = 0;
  public dateOptions = { year: 2023, month: 6 };

  constructor(
    private router: Router,
    private countryService: CountriesService,
    private elementRef: ElementRef,
    private calendar: NgbCalendar,
    private authService: AuthService,
    private postreq: PostReqService,
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private toast: ToastrService,
    public formatter: NgbDateParserFormatter,
    private firestore: Firestore,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private pack:PackageService,
    private papa:Papa
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.selectedTravelersSubscription = this.countryService
      .getSelectedTravelers()
      .subscribe((travelers: string) => {
        this.selectedTravelers = travelers;
      });
      this.numberFormControl2 = new FormArray([]);
  }

  ngOnDestroy() {
    this.selectedTravelersSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.responseId = params.responseId;
      if (this.responseId) {
        this.fetchResponseDataFromFirestore(this.responseId);
      } else {
        this.generateResponseData()
      }
    });

    this.filterData();
    this.filterAirports();

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

      const { recommendedMonths, visaType } = this.getCountryDetails(this.selectedCountry);
      // Set the values in the component properties
      this.selectedRecommendedMonths = recommendedMonths;
      this.selectedVisaType = visaType;
      this.countryService.setSelectedVisaType(visaType);
      this.getCitiesByCountryOrContinent();
    })

    this.countryService.getSelectedVisaType().subscribe(visaType => {
      this.visaTypeData = visaType;
    })
  }

  handleCreatePackageBtn(){
    if(this.responseId){
      this.router.navigate(['/itinerary',this.responseId]);
      this.convertCSVToJson(this.responseId)

    }

  }

  async convertCSVToJson(responseId:string) {
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
        this.updateCityId(jsonData,responseId)
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
      }
    });
  
  }
  
  async updateCityId(jsonData:any,responseId:string){
    try{
      const res=await this.pack.updateCityId(jsonData,responseId)
      if(res){
        console.log(res)
        console.log('updated successfully')
      }
    }catch(error){
      console.log(error.message)
    }
  }


// share on whatsapp
shareOnWhatsApp() {
  const message = 'Check out this link: ';
  const url = `https://localhost:4200/itinerary-preview/${this.responseId}`; // Replace with your actual website URL
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message + url)}`;

  window.open(whatsappLink, '_blank');
}

  async fetchResponseDataFromFirestore(responseId: string) {
    try {
      const docRef = doc(collection(this.firestore, utils.RESPONSE_COLLECTION), responseId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        this.responseData = docSnap.data() as any;
        this.loading = false;
        this.isPreviewMode = true;
        this.initialiseFormGroup(this.responseData);
      }
    } catch (error) {
      console.error('Error fetching response data from Firestore:', error);
    }
  }
  
  initialiseFormGroup(responseModel: TripCity | null = null) {
    if (responseModel === null) {
      this.updateMode = false;
      this.responseFormGroup = this.fb.group({
        responseId: [doc(collection(this.firestore, utils.RESPONSE_COLLECTION)).id],
        itineraryName: ["", Validators.required],
        companyName: ["", Validators.required],
        createdOn: [Timestamp.now()],
        cities: this.fb.array(Object.values(this.activitiesByCity)
        .map(({ cityName, days }: any) => this.buildCitiesFormControl(cityName, days))),
        trip: this.addTripModelFormGroup(),
      });
    } else {
      this.updateMode = true;
      const adultCount = this.numberFormControl.value;
      const infantCount = this.numberFormControl1.value;
      const childCount = this.numberFormControl2.value;
      this.responseFormGroup = this.fb.group({
        responseId: [responseModel?.responseId ?? ""],
        itineraryName: [responseModel?.itineraryName ?? "", Validators.required],
        companyName: [responseModel?.companyName ?? "", Validators.required],
        createdOn: [responseModel?.createdOn],
        cities: this.fb.array(Array.from(responseModel?.cities ?? [])
          .map(({cityName, days}: any) => this.buildCitiesFormControl(cityName, days))),
        trip: this.addTripModelFormGroup(responseModel.trip, adultCount, infantCount, childCount),
      });
    }    
  }
  
  private buildCitiesFormControl(cityName: string, cityActivities: any[]): FormGroup {
    const cityControls: FormGroup[] = [];
    const propertyControls: FormGroup[] = [];
    const allDates: string[] = [];
    for (const activity of cityActivities) {
      const formattedDate = this.datePipe.transform(activity.date, 'yyyy-MM-dd');
      allDates.push(formattedDate);
      // console.log('Activity Connections:', activity.connections); 
      const activityFormGroup = this.fb.group({
        date: [formattedDate],
        suggested_duration: [activity.suggested_duration],
        suggested_hotelname: [activity.suggested_hotelname],
        cityCode: [activity.cityCode],
        cityId: [activity.cityId],
        countryCode: [activity.countryCode],
        connections: this.buildConnectionsFormControl(activity.connections),
        activities: this.buildActivitiesFormControl(activity.activities),
      });
      cityControls.push(activityFormGroup);
    }

    const cityDetailsFormGroup = this.fb.group({
      cityName: [cityName],
      cityCode: [cityActivities[0].cityCode], 
      cityId: [cityActivities[0].cityId], 
      countryCode: [cityActivities[0].countryCode], 
    });

    // for (const activity of cityActivities) {
      const propertyFormGroup = this.fb.group({
        date: [allDates],
        // suggested_duration: [activity.suggested_duration],
        // suggested_hotelname: [activity.suggested_hotelname],
      });
      propertyControls.push(propertyFormGroup);
    // }
    return this.fb.group({
      cityName: [cityName],
      // cityCode: [cityActivities[0].cityCode], 
      // cityId: [cityActivities[0].cityId], 
      // countryCode: [cityActivities[0].countryCode], 
      cityDetails: cityDetailsFormGroup,
      noOfNights: [cityControls.length],
      noOfDays: [cityControls.length],
      noOfProperties: [propertyControls.length],
      days: this.fb.array(cityControls),
      Properties: this.fb.array(propertyControls),
    });
  }
  
  private buildActivitiesFormControl(activities: any[]): FormArray {
    const activityControls: FormGroup[] = [];
    for (const activity of activities) {
      const timeSlot = this.mapTimeSlot(activity.activity_timeperiod);
      const activityFormGroup = this.fb.group({
        activity_timeperiod: [activity.activity_timeperiod],
        activity_timestamp: [timeSlot],
        activity_name: [activity.activity_name],
        image: [activity.image],
        location: [activity.location],
      });
  
      activityControls.push(activityFormGroup);
    }
  
    return this.fb.array(activityControls);
  }

  private mapTimeSlot(activityTimePeriod: string): string {
    switch (activityTimePeriod.toLowerCase()) {
      case 'morning':
        return '05:00am - 11:00am';
      case 'afternoon':
        return '12:00pm - 15:59pm';
      case 'evening':
        return '16:00pm - 20:59pm';
      case 'night':
        return '21:00pm - 05:00am';
      default:
        return '';
    }
  }

  private buildConnectionsFormControl(connections: any[]): FormArray {
    const connectionsControls: FormGroup[] = [];
    for (const activity of connections) {
      const activityFormGroup = this.fb.group({
        from_city: [activity.from_city],
        mode_of_transport: [activity. mode_of_transport],
        to_city: [activity.to_city],
        total_duration: [activity.total_duration],
      });
      connectionsControls.push(activityFormGroup);
    }
    return this.fb.array(connectionsControls);
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

  // incChildCount() {
  //   const currentValue2 = this.numberFormControl2.value;
  //   if (currentValue2 !== null) {
  //     const formGroup = this.addTripModelFormGroup();
  //     const childCountArray = formGroup.get('travellers.childCount') as FormArray;
  //     childCountArray.push(this.fb.group({
  //       index: childCountArray.length, // Assign an index for reference
  //       age: currentValue2 // Set the age value
  //     }));
  //     // this.numberFormControl2.setValue(null); // Reset the input field after adding the child
  //     console.log(currentValue2)
  //     console.log(childCountArray)
  //   }
  // }

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

  createChildFormGroup(index: number, age: number): FormGroup {
    return this.fb.group({
      index: this.fb.control(index), // Set the index value
      age: this.fb.control(age) // Set the age value
    });
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

  addTripModelFormGroup(trip: any = null, adultCount: number = null, infantCount: number = null , childCount: FormControl[] = []): FormGroup {
    return this.fb.group({
      departure_airport: [trip?.departure_airport ?? null],
      mode_of_transport: [trip?.origin_mode_of_transport ?? null],
      arrival_airport: [trip?.arrival_airport ?? null],
      start_date: [trip?.start_date ?? null],
      end_date: [trip?.end_date ?? null],
      numbers_of_days: [trip?.numbers_of_days ?? null],
      travellers: this.fb.group({
        adultCount: [adultCount ?? trip?.travellers ?? null],
        infantCount: [infantCount ?? trip?.travellers?? null],
        childCount: this.fb.array(childCount)
      }),
      trip_duration: [trip?.trip_duration ?? null],
      nature_of_trip: [trip?.nature_of_trip ?? null],
    });
  }

  generateResponseData() {
  this.countryService.getResponseData().subscribe(responseData => {
    if (Object.keys(responseData).length !== 0 && responseData !== '') {
      this.responseData = responseData;
      // Access the cities array within the trip object
      const citiesArray = responseData.trip.cities;
      this.activitiesByCity = this.groupActivitiesByCity(responseData);
      this.sortedCities = Object.keys(this.activitiesByCity).sort((a, b) => {
        const dateA = new Date(this.activitiesByCity[a][0].date);
        const dateB = new Date(this.activitiesByCity[b][0].date);
        return dateA.getTime() - dateB.getTime();
      });
      this.loading = false;
      this.initialiseFormGroup({
        cities: Object.entries(this.activitiesByCity).reduce((prev, [cityName, days]) => ([...prev, { cityName, days }]), []),
        trip: responseData.trip,
        companyName: "",
        responseId: "",
        itineraryName: "",
        createdOn: ""
      } as any);

    }
  });
  }

  saveResponseDataToFirestore() {
    let formValues = { ...this.responseFormGroup.value };
    let docRef;

    if(this.responseId == null) {
      docRef = doc(collection(this.firestore, utils.RESPONSE_COLLECTION));
      formValues.responseId = docRef.id;
    } else {
      docRef = doc(collection(this.firestore, utils.RESPONSE_COLLECTION), this.responseId);
    }

    setDoc(docRef, formValues)
      .then(() => { 
        this.modalService.dismissAll();
        this.toast.success(`Itinerary Added Successfully`);
        console.log("Response Saved in Database:", formValues);
        console.log("ResponseId:",formValues.responseId);
      })
      .catch(error => {
        console.error("Error saving response data to Firestore: ", error);
      });
  }

  groupActivitiesByCity(responseData: any): { [key: string]: any[] } {
    const activitiesByCity: { [key: string]: any[] } = {};
    if (responseData && responseData.itinerary && Array.isArray(responseData.itinerary)) {
      for (const item of responseData.itinerary) {
        if (item && item.city_name && Array.isArray(item.activities)) {
          const cityName = item.city_name;
          const cityCode = item.cityCode;
          const cityId = item.cityId;
          const countryCode = item.countryCode;

          if (cityName in activitiesByCity) {
            activitiesByCity[cityName].push({
              date: new Date(item.date), // Convert the date string to a Date object
              activities: item.activities,
              connections: item.connections,
              from_city: item.from_city,
              activity_timeperiod: item.activity_timeperiod,
              suggested_duration: item.suggested_duration,
              suggested_hotelname: item.suggested_hotelname,
              cityCode: item.cityCode,
              cityId: item.cityId,
              countryCode: item.countryCode,
            });
          } else {
            activitiesByCity[cityName] = [{
              date: new Date(item.date),
              activities: item.activities,
              connections: item.connections,
              from_city: item.from_city,
              activity_timeperiod: item.activity_timeperiod,
              suggested_duration: item.suggested_duration,
              suggested_hotelname: item.suggested_hotelname,
              cityCode: item.cityCode,
              cityId: item.cityId,
              countryCode: item.countryCode,
            }];
          }
        }
      }

      // Sort activities by date for each city
      for (const city in activitiesByCity) {
        activitiesByCity[city].sort((a, b) => a.date.getTime() - b.date.getTime());
      }
    }

    // Calculate the maximum suggested_duration for each city
    for (const city in activitiesByCity) {
      const suggestedDurations = activitiesByCity[city].map(activity => activity.suggested_duration);
      const maxSuggestedDuration = Math.max(...suggestedDurations);
      activitiesByCity[city][0].suggested_duration = maxSuggestedDuration;
    }

    return activitiesByCity;
  }

  formatDate(date: string | null): string {
    if (date === null || date === undefined) {
      return ''; // or return some default value like 'N/A'
    }
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'EEE, d MMM') || ''; 
  }
  
  addTable() {
    // Get the 'cities' FormArray from the responseFormGroup
    const citiesFormArray = this.responseFormGroup.get('cities') as FormArray;
  
    if (citiesFormArray) {
      // Create a new city entry in your activitiesByCity data source
      const newCityName = ' '; 
      this.activitiesByCity[newCityName] = []; // Initialize it with an empty array of city activities
  
      // Create a new city FormControl and push it to the 'cities' FormArray
      const newCityControl = this.buildCitiesFormControl(newCityName, []);
      citiesFormArray.push(newCityControl);
      this.toast.success('New Table Added');
    }
  }
  
  addRow(cityIndex: number) {
    // Get the 'cities' FormArray from the responseFormGroup
    const citiesFormArray = this.responseFormGroup.get('cities') as FormArray;
  
    if (citiesFormArray && cityIndex >= 0 && cityIndex < citiesFormArray.length) {
      // Get the selected city's FormGroup
      const cityFormGroup = citiesFormArray.at(cityIndex) as FormGroup;
  
      // Get the 'days' FormArray within the selected city
      const daysFormArray = cityFormGroup.get('days') as FormArray;
  
      if (daysFormArray) {
        // Create a new FormGroup with blank values for the specified fields
        const newDayFormGroup = this.fb.group({
          date: [''], // Add more fields as needed with their initial values
          suggested_duration: [''],
          suggested_hotelname: [''],
          connections: [''],
          activities: this.fb.array([]), // Initialize activities with an empty array
        });
  
        // Push the new day FormGroup to the 'days' FormArray
        daysFormArray.push(newDayFormGroup);
      }
    }
    this.toast.success(`New Row Added`);
  }
  
  addCol(dayGroup: FormGroup) {
    // Get the 'activities' FormArray from the selected dayGroup
    const activitiesFormArray = dayGroup.get('activities') as FormArray;
  
    if (activitiesFormArray) {
      // Create a new FormGroup for the activity fields with blank values
      const newActivityFormGroup = this.fb.group({
        activity_timeperiod: [''],
        activity_name: [''],
        image: [''],
        location: [''],
      });
  
      // Push the new FormGroup to the 'activities' FormArray
      activitiesFormArray.push(newActivityFormGroup);
    }
    this.toast.success(`New Col Added`);
  }

  deleteActivity(dayGroup: FormGroup, index: number) {
    const activitiesFormArray = dayGroup.get('activities') as FormArray;
    if (activitiesFormArray && index >= 0 && index < activitiesFormArray.length) {
      activitiesFormArray.removeAt(index);
    }
    this.toast.success(`Activity Deleted Successfully`);
  }
  
  deleteRow(cityIndex: number, rowIndex: number) {
    // Get the 'cities' FormArray from the responseFormGroup
    const citiesFormArray = this.responseFormGroup.get('cities') as FormArray;
  
    if (citiesFormArray && cityIndex >= 0 && cityIndex < citiesFormArray.length) {
      // Get the selected city's FormGroup
      const cityFormGroup = citiesFormArray.at(cityIndex) as FormGroup;
  
      // Get the 'days' FormArray within the selected city
      const daysFormArray = cityFormGroup.get('days') as FormArray;
  
      if (daysFormArray && rowIndex >= 0 && rowIndex < daysFormArray.length) {
        // Remove the specified row from the 'days' FormArray
        daysFormArray.removeAt(rowIndex);
      }
    }
  
    this.toast.success(`Row Deleted`);
  }
  
  deleteCity(cityIndex: number) {
    // Get the 'cities' FormArray from the responseFormGroup
    const citiesFormArray = this.responseFormGroup.get('cities') as FormArray;
  
    if (citiesFormArray && cityIndex >= 0 && cityIndex < citiesFormArray.length) {
      // Remove the city FormGroup at the specified index
      citiesFormArray.removeAt(cityIndex);
  
      // Remove the corresponding entry from your activitiesByCity data source
      const cityNameToDelete = this.sortedCities[cityIndex];
      delete this.activitiesByCity[cityNameToDelete];
    }
  
    this.toast.success(`City Deleted`);
  }

  openSaveModal(modalRef: any) {
    this.modalService.open(modalRef, { size: 'sm' });
  }

  submitAndCloseModal(form: NgForm) {
    console.log("btn is being clicked");
    console.log(form);
    console.log(form.valid)
    if (form.valid) {
      console.log("submit btn triggered in submitAndCloseModal")
      this.saveResponseDataToFirestore();
      this.closeModal(); 
    }
  }
  demoFun(){
    console.log("hello demo")
  }
  
  closeModal() {
    // Close the modal using JavaScript or jQuery, depending on your setup
    // For example, using JavaScript:
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.parentNode?.removeChild(modalBackdrop);
      }
    }
  }
  
  toggleEditMode() {
    this.isEditMode = true;
    this.isInitialMode = false;
    this.isPreviewMode = false;
    this.isPreviewBtn = false;
  }
  
  togglePreviewMode() {
    this.isPreviewMode = true;
    this.isEditMode = false;
    this.isInitialMode = false;
  }
  
  update() {
  this.toast.success(`Table Updated`);
  this.isPreviewBtn = true;
  }

  onCountrySelect(data: string): void {
    this.countryService.setSelectedCountry(data);
  }

  get nameFromSessionStorage() {
    // Retrieve the name from session storage
    return sessionStorage.getItem('selectedCountry');
  }

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

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  generatePdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinition();

    switch (action) {
      case 'open':
        pdfMake.createPdf(documentDefinition).open();
        break;
      case 'print':
        pdfMake.createPdf(documentDefinition).print();
        break;
      case 'download':
        pdfMake.createPdf(documentDefinition).download("Itinerary");
        break;
      default:
        pdfMake.createPdf(documentDefinition).open();
        break;
    }
  }

  getDocumentDefinition() {
    const content = [];
    const logoImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMcAAAA6CAYAAAAECU0BAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAhCSURBVHhe7Z1BbBVVFIanLsqmj4WUxAILo7FEg5HQBoKJUBN0I3Uhq7JiY7tzAe7BPbBwBXUhG9sVLGxdiAsrC43GKgkGAonGBRYTcUO7gY3ON++e9szp3DfTvnnto5wvmbyZefNm7j33/Pece+97bc9/KYnjOKt4Lrw6jmNYjhwPFpeSB48Ws5OO8ywysL2RDDT6wpESx+SP89nmOM8q44eGsk3wtMpxIrg4HCeCi8NxIrg4HCeCi8NxIrg4HCeCi8NxIrg4HCeCi8NxIrg4HCeCi8NxIrg4HCeCi8NxIrg4HCeCi8NxIrg4HCeCi8NxInSlOAZ37kiOvvRi0tjWG844zsbTsZ/J4tiv9O8IRyv8vbiULLT4rfqZI28mY/v3Zfv3/vk3mbg2kyw+fpIdb0XoCPp619cJ/PLXg7D39FPkLxtdP/sz2Y6J4+T+15PTRw6HoxVm79xLzn0zF45W8+3EqVzEmLg2m8zfXwhHW4/JE6PJgd0D4WhtDH86Gfaefob27Eouf3A8HDXZ6Ppt2G/Ij786GPbykC614rs//gx7SbL05EkaPR6Go+4HR//5o/HljQZ3nl46Io5d2xtZulAEUWHk5bhAiCoXb/yQRbGTU1e3dErldDcdEcdISXQoe3/q5q1MHK3GJluF8ze+z1JHvZF6au49ZOyVv4bN6SwdGXNMjZ3IRQ5SJZ1OEQ3evnwlHOUhHdHgBIw5Yjnp2XdGktGQwsm1+h4M6savzmTR6vRbh7OoBgz2J3+aT+Z+X0njNFz3YZp/ImQZA1HuubQunxnh2lzVImWoir1f7PPWJlx3Zvbr5Px77y6ndDpv59zYG/tykVvqhCBlbEfb0Yaa969M5+qMfb48NRaOmpycvprZVSC1ZuypfYFnzKTPsh1ArH01Un5edZtwT6lDO1i71x45ilIqUiXGD0JZalUVZrZEGK2ggXAYEQZQRs4VlYN70vC8SiMA+5z7InWcKs/dDLQwNHQiOJ+tr9SJ97AT4OD8BUzNkJk0sNGf60UY3BNxnUufaX2BsnGe52nblqHLrz/HPufknnVSuzis0UgJst7J9NBlqVUVYoN+zQuNviwCxDh7bCTsNaHxaIhW0CCnU2FqsXUD1LVIGDi/FbPurARmF+Xzq9rLiGpoT14s07/eCntNgVpRWHjO+KHhcNQarrXlz8SY+pamec94W6+V2sVhHXb2djPUEfY0ZbNWVcBJSSUkJVx8/Di8swIO3NOTZIP8T9IIxvUa7qEd6uyxo2GvCZ8jvLOxL/A5aQjCOSmdbSyu5zzjio1AxEp5sMf0zd+y49HX9mavAnYYuXQlq5OeHQSJEDN37mavwoHdedHZY2lfnFjbE5uQkvEsXrWNWM+q0sHYqEX9Rj+fyiZsSOU0dXS6Qq3ioKK2xxCj2Z4I5ypKadYCDkAuLuLQ+a6GtI5BPrkuOblNGfaGxSfKrhuLhuRzAvu6cUXg5OLkvUtphNTcTa/lfKxcneDjr65n9cUeF4IosRGOiVDZsIOw8Chvi+Hg2JRZ15X2krbllWOB62Q8Ytv0QtpByHu8Ui5NFWdubNsW9poMpu0l7UQ5EQj1oo5WLO1QqziKUio9iLO9VLsqn1aO2wotTFI8+9fk+0JDi0gEVq7JY/U20FgRj3aYbgDRxyYYaAci62D/81nEoy6MC+TbCEVI1BeGQ7Sw7aavsxFl/OCBnP3GD+bTHpueFWHXurA5Y0IWjLkn5WFeSftaHdQqDptS4UjaMPbrAe2mVjh6nfAn6DX0TqQIetM9JthebTOJ/QsJ6oH9EQOTGIiDupQJ26bCEhUkugj6Omsfaz/7zCr2K5rdAp7FPakPC7B2lrRdahNHUUolhZdNpyzA++2mVp2EnpgxSqutaJzTbVxKhYH9NZQdh7PRXENPrFMr+ZqL/rqLzQ4s1l52u1sx5SRVJGWkzEWTCYD/nTMTLO1QmzjWmyK1m1rVyXzaWBrCOfl6q20jxxPrwXZKODNrTJQdhytzTptaEXk09n0cXsMzrM30JuOiKpAycj8mExhfIBYrbgRSV/SoTRw2pcJIMlDWm61MHbNWdYEYdK9E/qwNTaQj12WRkRBOqmLTCM0u9V+CNgtbhvn7RLuVOtqZIItNrewYxb5vxWan0VlLwX4yXrBTtEWwhiF2ZyPbIFohljOz18NV9VOLOIpSKvkKiN2YvdB0U2qF08yonpCyIQLm7Vn7YPFPemHq29PTk3M0m2LxGRpTFtc2gwUzM0cnhoPzGlsw1NjUSlOUUjFJojsYnB/HZg0FMcg3tbEtz7bli6GjH2tT3EcmFjR6MbJdahGHjRoYp9WsiTV2N6VWhPlV5UvFSyPrBqKOhHhNrM51hfn1wFSynrrGKUmN6I2pV8zxNTZ1EorO077WLtiNDsIKkXUYyleGbRPqwP1kYkGzljStjI6II+Ykgn2/m1IrYHGJhosN/GQRyvaazKoQHS3My28mRWs7QD1sJC/Cpk5C9Hzavtn3rCLCoyyMF6o6MtF5Ih2fFM1YCaTxrHWU+d5aqOWLh1a9TClax9Gg/MGd/eGoCfk+RrD3kvNFn4n1OvYe9jp6cj2F2Kq83ItnN3p7sxRAytMKW9Yqn9HQ0+ppZdK1olTBPid2nUC9uTdlkTpXvYe1admzBKkLa0gsilatCxS1r1zHWIo25J5l/lYVIhGb4P9N1nECVhy1zVY5zlbDxeE4EVwcjhPBxeE4EVwcjhPBxeE4EVwcjhPBxeE4EVwcjhPBxeE4EVwcjhPBxeE4EVwcjhNh+Vu5/BZh5nb+D3k5zrMEf/xO/2x3WRyO4+TxtMpxCkmS/wEjo7qd0v6KrAAAAABJRU5ErkJggg==';
  
    // Add Logo
    content.push({
      stack: [
        { image: logoImage, width: 100, margin: [0, 0, 0, 0], alignment: 'left' },
      ],
      width: 100,
      margin: [0, 0, 0, 10],
      alignment: 'left',
    });

    content.push(
      { text: 'Email: support@airnet-travels.com ', style: 'linkHeader' },
    );

    content.push({
      text: 'https://airnet-travels.com/',
      style: 'linkHeader1',
      margin: [0, 4, 0, 5],
      link: 'https://airnet-travels.com/'
    });

    // Create an array to store the city names
    const cityNames = [];

    // Loop through the cities in the response form and store the city names
    for (let cityControl of this.responseFormGroup.value.cities) {
      const cityName = cityControl.cityName;
      cityNames.push(cityName);
    }

    // Create a single string that includes all the city names
    const allCityNames = cityNames.join(', ');

    // Add the combined city names to the 'content' array
    content.push({
      text: `Itinerary of ${this.responseFormGroup.value.trip.trip_duration} Nights to ${allCityNames}`,
      style: 'header',
      margin: [0, 10, 0, 20]
    });

    // Loop through the cities in the response form and generate content for each city
    for (let cityControl of this.responseFormGroup.value.cities) {
      const cityName = cityControl.cityName;
      // const hotelName = cityControl.days[0].suggested_hotelname;
      console.group(`>>> [${cityName}]: `);
      let pdfContent = this.getPdfContent(cityControl, cityName);
      console.log(pdfContent);

      content.push(pdfContent);
      console.groupEnd()

    }

        content.push(
      {
        stack: [
          { text: 'Contact Us', style: 'Address1', margin: [0, 7] },
          { text: 'Office 1: 4th Floor, SCO 147, Feroz Gandhi Market, Ludhiana, Punjab, 141001, India ', style: 'linkHeader2' },
          { text: 'Office 2: SCO 56 Opposite Keys Hotel, 200ft Road, SBS Nagar, Ludhiana, Punjab, 141001 India', style: 'linkHeader2' },
          { text: 'Phone: +911613509826, +911613509827', style: 'linkHeader2' },
          { text: 'Email: support@airnet-travels.com ', style: 'linkHeader2' },
        ],
        margin: [0, 15]
      }
    );

    const documentDefinition: any = {
      content: content,
      info: {
        title: 'Trip Itinerary',
        author: 'Your Name',
        subject: 'Trip Itinerary',
        keywords: 'trip, itinerary'
      },
      styles: {
        linkHeader: {
          fontSize: 8,
          alignment: 'left'
        },
        linkHeader1: {
          fontSize: 10,
          bold: true,
          alignment: 'left'
        },
        linkHeader2: {
          fontSize: 8,
          alignment: 'right'
        },
        Address: {
          fontSize: 12,
          bold: true,
          alignment: 'left'
        },
        Address1: {
          fontSize: 12,
          bold: true,
          alignment: 'right'
        },
        header: {
          fontSize: 20,
          bold: true,
          alignment: 'center'
        },
        tableHeader: {
          fontSize: 14,
          bold: true,
          fillColor: '#339199',
          color: '#fff',
          alignment: 'center'
        },
        tableData: {
          fontSize: 11,
          alignment: 'center'
        },
        tableData1: {
          fontSize: 11,
          alignment: 'center'
        }
      }
    };

    return documentDefinition;
  }

  getPdfContent(cityControl, cityName) {
    const cityNames = [];
    const cityActivitiesList = [];
  
    cityControl.days.forEach((dayControl, dayIndex) => {
      const formattedDate = dayControl.date;
      const activities = dayControl.activities;
      const cityName = cityControl.cityName;
      // const hotelName = cityControl.days[0].suggested_hotelname;
      cityNames.push(cityName);
  
      cityActivitiesList.push({ formattedDate, activities });
    });

    const firstActivity = Object.assign({}, { ...cityActivitiesList[0] });
    console.log(">>> Activities: ", cityActivitiesList);
    console.log(">>> FirstActivity: ", firstActivity);

      // Check if cityActivitiesList is empty
  if (cityActivitiesList.length === 0) {
    console.error("No activities found for the city.");
    return null; // or handle this case as needed
  }

  const maxTableColumns = Math.max(...cityActivitiesList.map(day => day.activities.length)) + 1;
    console.log(">>> MaxTableColumns: ", maxTableColumns);

    const tableRowWidths = Array(maxTableColumns).fill('auto');
    tableRowWidths[0] = '*'
    console.log(">>> Table Widths: ", tableRowWidths);
  
    let tableBody = [];
    tableBody.push([
      {
        text: cityName + ' - ' + cityActivitiesList.length + ' days stay  ',
        style: 'tableHeader',
        colSpan: maxTableColumns
      },
      ...Array(maxTableColumns - 1).fill({ text: '' })
    ]);
    tableBody.push([
      {
        text: 'Pickup self-drive car at ' + cityName + ' Airport',
        style: 'tableData1',
        colSpan: maxTableColumns
      },
      ...Array(maxTableColumns - 1).fill({ text: '' })
    ])
  
    for (let cityActivity of cityActivitiesList) {
      let tableRow = [];
      tableRow.push({ text: this.formatDate(cityActivity.formattedDate), style: 'tableData' });

      const activities = cityActivity.activities;
      console.groupCollapsed(this.formatDate(cityActivity.formattedDate));
      console.log(activities);

      for (let activityIdx in activities) {
        let idx = Number.parseInt(activityIdx);
        console.log(`>>> Idx: ${idx}`, activities[idx]);
        if (idx === 0) {
          tableRow.push({
            text: `${activities[idx].activity_timeperiod.toUpperCase()}\n${activities[idx].activity_name}`,
            colspan: maxTableColumns - activities.length,
            style: 'tableData',
            rowSpan: 0
          })
          tableRow.push(...Array(maxTableColumns - activities.length - 1).fill({ text: '' }))
        } else {
          tableRow.push({
            text: `${activities[idx].activity_timeperiod.toUpperCase()}\n${activities[idx].activity_name}`,
            colspan: maxTableColumns - activities.length - 1,
            style: 'tableData',
            rowSpan: 0
          })
        }
      }
      
      console.groupEnd()
      tableBody.push(tableRow)
    }
  
    const tableContent = {
      margin: [0, 10],
      table: {
        headerRows: 1,
        widths: tableRowWidths,
        body: tableBody,
      }
    };
    return tableContent;
  }

  filterData(): void {
    this.filteredData = Countries.filter((data) =>
      data.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  onSearchChange(): void {
    this.filterData();
  }

  incrementProp() {
    const currentValue = this.numberFormControl1.value;
    if (currentValue !== null) {
      this.numberFormControl1.setValue(currentValue + 1);
    }
  }

  decrementProp() {
    const currentValue = this.numberFormControl1.value;
    if (currentValue !== null) {
      this.numberFormControl1.setValue(currentValue - 1);
    }
  }

  showAlert() {
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 3000); // Hide the alert after 3 seconds (adjust as needed)
  }

  isActive(item: number): boolean {
    return item <= this.activeItem;
  }

  updateActiveItem(item: number): void {
    this.activeItem = item;
  }

  filterAirports(): void {
    this.filteredAirports = Airports.filter(airport =>
      airport.toLowerCase().includes(this.searchText1.toLowerCase())
    );
  }

  onSearchCity(): void {
    this.filterCities();
  }

  onSearchChange1(): void {
    this.filterAirports();
  }

  onNavChange(eventValue: any) {
    // console.log(">> EVen", eventValue);
  }

  selectMonth(month: string): void {
    this.countryService.setSelectedMonth(month);
    this.selectedMonth = month;

    const monthInNumber: { [key: string]: number } = {
      'January': 1,
      'February': 2,
      'March': 3,
      'April': 4,
      'May': 5,
      'June': 6,
      'July': 7,
      'August': 8,
      'September': 9,
      'October': 10,
      'November': 11,
      'December': 12,
    }

    this.dateOptions.month = monthInNumber[this.selectedMonth]
    this.dateOptions.year = new Date().getMonth() + 1 > monthInNumber[this.selectedMonth] ? new Date().getFullYear() + 1 : new Date().getFullYear();

    // Set the day to the selected day of the month
    let date = new Date(new Date().getFullYear(), monthInNumber[month], 0)
    this.dateModel = {
      day: date.getDate(),  // Set the selected day of the month
      month: date.getMonth(),
      year: date.getFullYear()
    };
    this.active = 2;
  }
  
  onDateSelect(selectedDate: NgbDateStruct): void {
    if (selectedDate) {
      this.dateModel = selectedDate; // Update the dateModel with the selected date
      const selectedDateStr = `${this.dateModel.year}-${this.dateModel.month}-${this.dateModel.day}`;
      this.selectedDate = selectedDateStr;
    }
    this.countryService.setSelectedDate(this.selectedDate);
    this.active = 3;
  }

  onAirportSelect(airport: string): void {
    this.countryService.setSelectedAirport(airport);
    this.selectedAirport = airport;
    this.active = 4;
  }

  selectDays(days: string): void {
    this.countryService.setSelectedDays(days);
    this.selectedDays = days;
    this.active = 5;
  }

  selectNature(nature: string): void {
    this.countryService.setSelectedNature(nature);
    this.selectedNature = nature;
  }

  selectStar(star: string): void {
    this.countryService.setSelectedStar(star);
    this.selectedStar = star;
  }

  selectPrice(price: string): void {
    this.countryService.setSelectedPrice(price);
    this.selectedPrice = price;
  }

  selectProperty(property: string): void {
    this.countryService.setSelectedProperty(property);
    this.selectedProperty = property;
  }

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

  onSelectionChange(event: Event, card: string) {
    const target = event.target as HTMLInputElement;
    const selectedValue = target.checked ? target.value : null;

    switch (card) {
      case 'price':
        this.selectedPrice = selectedValue;
        break;
      case 'star':
        this.selectedStar = selectedValue;
        break;
      case 'property':
        this.selectedProperty = selectedValue;
        break;
      default:
        break;
    }
  }

  private moveToNextStep() {
    this.active = 7;
  }

  // Helper method to get country details based on countryName from CITY_JSON
  getCountryDetails(countryName: string): { recommendedMonths: string[]; visaType: string } {
    const cityData = CITY_JSON.find(
      (city) =>
        city.Continent === countryName ||
        city.countries.some(
          (country: { Country: string; Cities: any }) =>
            country.Country === countryName || country.Cities.includes(countryName)
        )
    );
    let countryData: { Country: string; 'Recommended Months': string[]; 'Visa Types': string } | undefined;
    if (cityData && cityData.Continent === countryName) {
      // If the selectedCountry is a continent, get the data for the first country within that continent
      const countriesInContinent = cityData.countries;
      if (countriesInContinent.length > 0) {
        countryData = countriesInContinent[0];
      }
    } else if (cityData) {
      // If the selectedCountry is a city or a country, find the corresponding country data
      countryData = cityData.countries.find(
        (country: { Country: string; Cities: any }) =>
          country.Country === countryName || country.Cities.includes(countryName)
      );
    }
    const recommendedMonths = countryData?.['Recommended Months'] || [];
    const visaType = countryData?.['Visa Types'] || '';
    return { recommendedMonths, visaType };
  }

  onCitySelect(cityName: string): void {
    const index = this.selectedCities.indexOf(cityName);
    if (index > -1) {
      this.selectedCities.splice(index, 1); // Remove the city if already selected
    } else {
      this.selectedCities.push(cityName); // Add the city name if not already selected
    }
  }

  findCityByName(cityName: string): City {
    return this.cityList.find((city: { cityName: string; }) => city.cityName === cityName) || new City('', '', '', [], '');
  }

  filterCities(): void {
    if (this.searchText2.trim() === '') {
      this.filteredCities = this.citiesWithDetails.slice(0, 4).map(city => city.cityName);
    } else {
      this.filteredCities = this.citiesWithDetails
        .filter(city => city.cityName.toLowerCase().includes(this.searchText2.toLowerCase()))
        .map(city => city.cityName);
    }
  }

  getCitiesByCountryOrContinent(): void {
    this.citiesWithDetails = []; // Reset the array
    this.cities = []; // Clear the cities array

    if (!this.selectedCountry) {
      // No country or continent selected, return early
      // this.toastr.error('Please Select Country.', 'Warning')
      return;
    }

    const selectedCountryData = CITY_JSON.find((city) =>
      city.countries.some((country: { Country: string }) => country.Country === this.selectedCountry)
    );

    if (selectedCountryData) {
      // Get cities for the selected country
      this.cities = selectedCountryData.countries
        .filter((country: { Country: string }) => country.Country === this.selectedCountry)
        .flatMap((country: { Cities: any }) => country.Cities);
    } else {
      // No matching country data found, check for matching continent
      const selectedContinentData = CITY_JSON.find((city) => city.Continent === this.selectedCountry);

      if (selectedContinentData) {
        // Get cities for the selected continent
        this.cities = selectedContinentData.countries.flatMap((country: { Cities: any }) => country.Cities);
      } else {
        // Treat selectedCountry as a single city and get cities for the matching country
        for (const continent of CITY_JSON) {
          for (const country of continent.countries) {
            for (const city of country.Cities) {
              if (city === this.selectedCountry) {
                this.cities = country.Cities;
                break; // Exit the loop since we found a match
              }
            }
            if (this.cities.length > 0) {
              break; // Exit the loop since we found cities for the matching country
            }
          }
          if (this.cities.length > 0) {
            break; // Exit the loop since we found cities for the matching country
          }
        }
      }
    }

    // Retrieve additional city details from CITY_DETAIL using the city name
    this.citiesWithDetails = this.cities.map((cityName: string) => ({
      cityName: cityName,
      cityDetails: this.getCityDetails(cityName),
    }));
  }

  // Helper method to get city details based on cityName from CITY_DETAIL
  getCityDetails(cityName: string): CityDetail {
    const cityDetail = CITY_DETAIL.find((city) => city[cityName]?.cityName === cityName);
    // console.log('City Detail:', cityDetail);
    return cityDetail?.[cityName] || {} as CityDetail;
  }

  editCity(cityName: string): void {
    const index = this.selectedCities.indexOf(cityName);
    if (index > -1) {
      this.selectedCities.splice(index, 1);
    } else {
      this.selectedCities.push(cityName);
    }
  }

  buildItinerary(): void {
    this.countryService.setSelectedCities(this.selectedCities);
    this.createDocument();
    this.postreq.sendRequest();
    this.loading = true;
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
      adultsValue: this.adultsValue,
      childrenValue: this.childrenValue,
      selectedCities: this.selectedCities,
      selectedPrice: this.selectedPrice,
      selectedStar: this.selectedStar,
      selectedProperty: this.selectedProperty,
    };
    window.sessionStorage.setItem('myData', JSON.stringify(data));
    // console.log(data);
    // setDoc(doc(this.db, collectionName, documentId), data)
    const storedData = window.sessionStorage.getItem('myData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // console.log("session Data:", parsedData);
    }

  }

}