import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelsService } from 'src/app/Services/hotels_api/hotels.service';
import { PackageService } from 'src/app/Services/package/package.service';
import { DatePipe } from '@angular/common';
import { NgbDateStruct, NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FlightsService } from 'src/app/Services/flights_api/flights.service';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-traveller-card',
  templateUrl: './traveller-card.component.html',
  styleUrls: ['./traveller-card.component.scss']
})
export class TravellerCardComponent implements OnInit {
  @ViewChild('dpInput') dpInput: any;
  @Input() dialog: boolean;
  @Input() editIndex: number;
  @Input() ssr: any;
  @Input() seatPrice: any;
  @Input() baggagePrice: any;
  @Input()  travelers: any[] = [];
  @Input() mealPrice: any;
  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();
  @Output() travelerArrayChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() priceChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  travelData: any;
  passengerData:any;
  RoomGuest = [] as any[];
  NoOfTravellers: number = 0;
  travelerForm: FormGroup;
 
  selectedCard: number = 0;
  currentTravellerCount = 1;
  totalAdultsCount: number = 0;
  primary: boolean = false;
  currentIndex: number = 0;
  ssrData: any;
  seatMapDialog: boolean = false;
  shouldUpdateFormValues: boolean=false;

  isChild:boolean=false;
  price=[]as  any;
  // date
  selectedDate: Date;
 
  // Add any other necessary properties
  // In your component.ts
countryCodes: any;
  showBaggageDropdown: any;
  showDropdown: any;
  selectedNationality: any;
  selectedCountry: any;
  filteredCountry: any;
  searchText: any;




  constructor(private hotels: HotelsService,private flights:FlightsService, private papa:Papa,  private fb: FormBuilder, private datePipe: DatePipe, private zone: NgZone,private cdr: ChangeDetectorRef,private pack:PackageService) {
    this.getData();
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.convertCSVToJson()
    console.log("HotelCardsComponent ngOnChanges", changes);
    console.log(this.editIndex)
    console.log(this.ssr.Response)
    this.ssrData = this.ssr.Response
    console.log(this.ssrData)
    console.log(this.travelers)
  }

  adult(){
    this.isChild=false
  }
  child(){
    this.isChild=true
  }
  get minDate(): string {
    const currentDate = new Date();
    const minYear = currentDate.getFullYear() - (this.isChild ? 12 : 0);
    const minDateString = `${minYear}-${this.formatNumber(currentDate.getMonth() + 1)}-${this.formatNumber(currentDate.getDate())}`;
    return minDateString;
}
private formatNumber(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}
  ngOnInit(): void {
    if (this.editIndex !== undefined) {
      this.handleCardClick(this.editIndex)
      console.log(this.editIndex)
      console.log(this.travelers)
      this.currentIndex=this.editIndex;
      if(this.travelers[this.currentIndex]){
        this.travelerForm.setValue(this.travelers[this.currentIndex]);
        console.log(this.travelerForm.value)
      }
     
    }

 
  }
  formatDate(day: string, month: string, year: string): string {
    // Assuming day, month, and year are strings
    const formattedDay = day.padStart(2, '0');
    const formattedMonth = month.padStart(2, '0');
    const formattedYear = year.padStart(4, '0');
  
    return `${formattedYear}-${formattedMonth}-${formattedDay}T00:00:00`;
  }
  



  handleSeatMapClick() {
    this.seatMapDialog = !this.seatMapDialog;
  }

  handleSeatMapData(data: any) {
    console.log('Received data from seat map component:', data);
    this.travelerForm.get('ssr.seat')?.setValue(data);
  }

  private calculateAge(dob: string): number {
    const currentDate = new Date();
    const birthDate = new Date(dob);
  
    let age = currentDate.getFullYear() - birthDate.getFullYear();
  
    // Adjust age if the birthday hasn't occurred yet this year
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
  
    return age;
  }

  private initializeForm(): void {
    this.travelerForm = this.fb.group({
      personalInfo: this.fb.group({
        FirstName: ['', Validators.required],
        Title: ['', Validators.required],
        LastName: ['', Validators.required],
        DateOfBirth: ['',Validators.required],
        Gender: ['', Validators.required],
        Nationality: ['', Validators.required],
        AddressLine1: ['', Validators.required],
        AddressLine2: [''],
        Email: ['', Validators.required],
        ContactNo: ['', Validators.required],
        Phoneno: [''],
        PAN: [''],
        PassportNo: [''],
        PassportIssueDate: [''],
        PassportExpDate: [''],
        PassportExpiry: [''],
        Age: [''],
        PaxType: [''],
        CountryCode: [''],
        City: [''],
        CountryName: [''],
        LeadPassenger: [true]
      }),
     
      guardianDetails:this.fb.group({
        Title:[''],
        FirstName:[''],
        LastName:[''],
        PAN:[''],
        PassportNo:[''],
      }),
      ssr: this.fb.group({
        extraBaggage: new FormControl(),
        meal: new FormControl(),
        seat: new FormControl()
      }),
    });

    this.travelerForm.get('personalInfo.ContactNo').valueChanges.subscribe((contactNo) => {
      // Check if the flag is set to true before updating the form

        // Set the value of Phoneno field to the same value as ContactNo
        this.travelerForm.get('personalInfo.Phoneno').setValue(contactNo);
      
    });
    this.travelerForm.get('personalInfo.PassportExpiry').valueChanges.subscribe((contactNo) => {
      // Check if the flag is set to true before updating the form

        // Set the value of Phoneno field to the same value as ContactNo
        this.travelerForm.get('personalInfo.PassportExpDate').setValue(contactNo);
      
    });
    this.travelerForm.get('personalInfo.DateOfBirth').valueChanges.subscribe((dob) => {
      // Update the Age field when Date of Birth changes
      const age = this.calculateAge(dob);
      this.travelerForm.get('personalInfo.Age').setValue(age);
      console.log(age)
    });
  
    // Subscribe to value changes for Date of Birth
  

  }


  toggleBaggageDropdown(): void {
    this.showBaggageDropdown = !this.showBaggageDropdown ;
  }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown ;
  }
 
  
  
  handleSSR(formGroupName: string, controlName: string, item: any): void {
    console.log(item)
    this.travelerForm.get(formGroupName).get(controlName).setValue(item);
    const srrGroup = this.travelerForm.get(formGroupName) as FormGroup;

    // Assuming 'Nationality' and 'CountryCode' are form controls in 'personalInfo' FormGroup
    const ssr = srrGroup.get(controlName);
    ssr.setValue(item)
   
    this.updatePrice()
    if(controlName==='extraBaggage'){
      this.toggleBaggageDropdown()
    }else if(controlName==='meal'){
      this.toggleDropdown()
    }
    console.log(this.travelerForm.value)
  }
  
  updatePrice(): void {
    // Ensure that this.price[this.currentIndex] is initialized
    console.log(this.travelerForm.value)

    if (!this.price[this.currentIndex]) {
        this.price[this.currentIndex] = { baggage: 0, meal: 0, seat: 0 };
    }
    console.log(this.travelerForm.value)

    const ssrForm = this.travelerForm.get('ssr') as FormGroup;
    const ssr1Form = this.travelerForm.get('ssr1') as FormGroup;
    const ssr2Form = this.travelerForm.get('ssr2') as FormGroup;
    console.log(this.travelerForm.value)


        // Update this.price based on ssr values
        this.price[this.currentIndex].baggage = (ssrForm.get('extraBaggage').value)?.Price || 0;
        this.price[this.currentIndex].meal = (ssrForm.get('meal').value)?.Price || 0;
        this.price[this.currentIndex].seat += (Number)((ssrForm.get('seat').value || []).map(item => {
            const price = parseFloat(item.Price);
            return isNaN(price) ? 0 : price;
        }));
        console.log(this.travelerForm.value)
        console.log(this.price)

    

       
    

    console.log(this.travelerForm.value)
    // Emit the change
   



    console.log(this.price);
}

  
  
  async convertCSVToJson() {
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
  
  onNationalitySelect(selectedCountry: any) {
    this.selectedNationality=selectedCountry
   console.log(selectedCountry)
    if (selectedCountry) {
      const personalInfoGroup = this.travelerForm.get('personalInfo') as FormGroup;
  
      // Assuming 'Nationality' and 'CountryCode' are form controls in 'personalInfo' FormGroup
      const nationalityControl = personalInfoGroup.get('Nationality');
     
  
      if (nationalityControl ) {
        // Update form controls with the selected country's alpha2 code
        nationalityControl.setValue(selectedCountry);
       
  
        console.log(this.travelerForm.value)
      } else {
        console.error("Form controls 'Nationality' or 'CountryCode' not found in travelerForm");
      }
    } else {
      console.error("Failed to extract alpha2 code from the selected country");
    }
  
  }
  onCountrySelect(selectedCountry: any) {
    this.selectedCountry = selectedCountry;
    console.log(selectedCountry);
    if (selectedCountry) {
      const personalInfoGroup = this.travelerForm.get('personalInfo') as FormGroup;
  
      // Assuming 'Nationality' and 'CountryCode' are form controls in 'personalInfo' FormGroup
      const countryControl = personalInfoGroup.get('CountryName');
      const countryCodeControl = personalInfoGroup.get('CountryCode');
  
      if (countryControl && countryCodeControl) {
        // Split the selected value using comma as delimiter
        const selectedValues = selectedCountry.split(',');
  
        if (selectedValues.length === 2) {
          const countryName = selectedValues[0].trim();
          const countryCode = selectedValues[1].trim();
  
          // Update form controls with the selected country's name and code
          countryControl.setValue(countryName);
          countryCodeControl.setValue(countryCode);
  
          console.log(this.travelerForm.value);
        } else {
          console.error("Invalid selected country format");
        }
      } else {
        console.error("Form controls 'Nationality' or 'CountryCode' not found in travelerForm");
      }
    } else {
      console.error("Failed to extract alpha2 code from the selected country");
    }
  }
  
  
  
    onSearchCity(): void {
      console.log('city search called')
      this.filterCities();
    }
    filterCities(): void {
      console.log('filter city');
      
      this.filteredCountry = this.countryCodes.filter(airport =>
        airport?.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        airport?.alpha2?.toLowerCase().includes(this.searchText.toLowerCase())
      );
      console.log('filtered city',this.filteredCountry)
    
      
    }
  
  

  




  calculateTotalAdultsCount(i: number): number {
    let total = 0;

    for (let k = i; k > 0; k--) {
      total += this.RoomGuest[k - 1]?.NoOfAdults + this.RoomGuest[k - 1]?.NoOfChild || 0;
    }

    return total;
  }

  async addTraveler() {

   
    console.log(this.selectedCountry)
    console.log(this.selectedNationality)
    this.onNationalitySelect(this.selectedNationality)
    this.onCountrySelect(this.selectedCountry)
      console.log('length', this.travelers);
      console.log(this.currentIndex)
    console.log(this.travelerForm.value)
    
      const newTraveler = { ...this.travelerForm.value };
      console.log(newTraveler)
      
      await this.savePassengerData(this.travelerForm.value)
        console.log(this.travelerForm.value);
    
        this.travelers[this.currentIndex] = this.travelerForm.value ;
        this.editIndex = undefined;
       
       
        this.travelerForm.reset();
      
    
        this.travelerArrayChange.emit(this.travelers);
        // this.priceChange.emit(this.price)
        this.selectedCard++;
        this.currentIndex++;
        if (this.currentIndex >= this.NoOfTravellers) {
          this.dialogbox();
          this.priceChange.emit(this.price)
        }
       
        if (this.currentTravellerCount <= this.NoOfTravellers) {
          this.currentTravellerCount++;
         
        }
    
       
      
        console.log(this.currentIndex)
        console.log(this.currentTravellerCount)
        console.log(this.NoOfTravellers)
        console.log(this.travelerForm.value)
        console.log('added-end')
      
    }

  
  
  async savePassengerData(form: any) {
    try {
      const res = await this.pack.savePerPassengerData(form,this.currentIndex,localStorage.getItem('uid'));
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  updateTraveller() {
    console.log('in update')
    this.shouldUpdateFormValues=true
    const updatedTraveler = { ...this.travelerForm.value };
    console.log('update')
    console.log(updatedTraveler)
    // Update the DateOfBirth control separately with the formatted date

    // Merge the updated values into the existing traveler
    this.travelers[this.currentIndex] = {
      ...this.travelers[this.currentIndex],
      ...this.travelerForm.value,
    };
    console.log('update+++')

    // Call the updatePassengerData method with the updated traveler data
   
    this.savePassengerData(this.travelers);
    console.log(this.travelers)
    console.log('in update end')
    this.shouldUpdateFormValues=false
  }
  
  

  async updatePassengerData(form: any) {
    try {
      const res = await this.pack.updatePassengerDetails(form, this.currentIndex,localStorage.getItem('uid'));
      console.log(res)
      this.travelerArrayChange.emit(res);
    } catch (error) {
      console.log(error)
    }
  }

  dialogbox() {
    this.closeDialog.emit();
  }

  getArray(length: number): any[] {
    return new Array(length);
  }

  async getData() {
    console.log('fetching');
    this.NoOfTravellers = 0;

    try {
      const res = await this.hotels.getSearchInfo();
      console.log(res);

      if (res) {
        this.travelData = res;
        this.RoomGuest = this.travelData?.trip?.RoomGuests;
        for (let i = 0; i < this.travelData?.trip?.RoomGuests?.length; i++) {
          this.NoOfTravellers += this.travelData?.trip?.RoomGuests[i]?.NoOfAdults;
          this.NoOfTravellers += this.travelData?.trip?.RoomGuests[i]?.NoOfChild;
        }
        console.log(this.RoomGuest);
        console.log('no',this.NoOfTravellers);
      } else {
        console.log("No data received from getSearchInfo");
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleCardClick(index: number) {
    console.log('Before update:', this.currentIndex);
       
    this.zone.run(() => {
      // this.editIndex=index;
      this.currentIndex = index;
      console.log(this.currentIndex)
      this.selectedCard = index;
      this.cdr.detectChanges();
      const travelerData = this.travelers[this.currentIndex];
      console.log(this.travelData)

      if (travelerData) {
        this.travelerForm.patchValue({
          personalInfo: {
            FirstName: travelerData?.personalInfo?.FirstName || '',
            Title: travelerData?.personalInfo?.Title || '',
            LastName: travelerData?.personalInfo?.LastName || '',
            DateOfBirth: travelerData?.personalInfo?.DateOfBirth || '',
            Gender: travelerData?.personalInfo?.Gender || '',
            Nationality: travelerData?.personalInfo?.Nationality || '',
            PAN: travelerData?.personalInfo?.PAN || '',
            AddressLine1: travelerData?.personalInfo?.AddressLine1|| '',
            AddressLine2: travelerData?.personalInfo?.AddressLine2|| '',
            Email: travelerData?.personalInfo?.Email || '',
            ContactNo: travelerData?.personalInfo?.ContactNo || '',
            PassportNo: travelerData?.personalInfo?.PassportNo || '',
            PassportIssueDate: travelerData?.personalInfo?.PassportIssueDate || '',
            PassportExpiryDate: travelerData?.personalInfo?.PassportExpiryDate || '',
            Age: travelerData?.personalInfo?.Age || '',
            City: travelerData?.personalInfo?.City || '',
            Country: travelerData?.personalInfo?.Country || '',
           
          },
          dates:{
            dob:{
              day:travelerData?.dates?.dob?.day || '',
              month:travelerData?.dates?.dob?.month || '',
              year:travelerData?.dates?.dob?.year || '',
            },
            passportIssue:{
              day:travelerData?.dates?.passportIssue?.day || '',
              month:travelerData?.dates?.passportIssue?.month || '',
              year:travelerData?.dates?.passportIssue?.year || '',
            },
            passportExpiry:{
              day:travelerData?.dates?.passportExpiry?.day || '',
              month:travelerData?.dates?.passportExpiry?.month || '',
              year:travelerData?.dates?.passportExpiry?.year || '',
            }

          },
          guardianDetails:{
            Title:travelerData?.guardianDetails?.Title || '',
            FirstName:travelerData?.guardianDetails?.FirstName || '',
            LastName:travelerData?.guardianDetails?.LastName || '',
            PAN:travelerData?.guardianDetails?.PAN || '',
            PassportNo:travelerData?.guardianDetails?.PassportNo || '',
          },
          ssr: {
            extraBaggage: travelerData?.ssr?.extraBaggage || '',
            meal: travelerData?.ssr?.meal || '',
        
            seat: travelerData?.ssr?.seat || '',
          },
        });
        console.log(this.travelerForm.value)
      }
    });
  }
}
