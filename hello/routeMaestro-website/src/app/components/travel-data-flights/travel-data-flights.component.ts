import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HotelsService } from 'src/app/Services/hotels_api/hotels.service';
import { PackageService } from 'src/app/Services/package/package.service';
import { FlightsService } from 'src/app/Services/flights_api/flights.service';
import { Papa } from 'ngx-papaparse';
import { distinctUntilChanged } from 'rxjs/operators';
import { FlightBookingService } from 'src/app/Services/flight_booking/flight-booking.service';
@Component({
  selector: 'app-travel-data-flights',
  templateUrl: './travel-data-flights.component.html',
  styleUrls: ['./travel-data-flights.component.scss']
})
export class TravelDataFlightsComponent implements OnInit {
  @ViewChild('dpInput') dpInput: any;
  @Input() dialog: boolean;
  @Input() editIndex: number;
  @Input() ssr: any;
  @Input() ssr1: any;
  @Input() ssr2: any;
  price=[]as  any;
  @Input()  travelers;
  @Input() isPanRequired: boolean;

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();
  @Output() travelerArrayChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() priceChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  travelData: any;
  passengerData:any;
  ssrNo:number;
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

  // date
  selectedDate: Date;
// In your component.ts
 localStorageData: string;
  childs: any;
  infants: any;
  adults: any;
  showDatepicker: boolean;


  countryCodes:any;
  searchText:string;
  filteredCountry:any;
  selectedNationality:any;
  selectedCountry:any;
  seatsArray=[]as any;
  selectedSeatMapIndex: number | null = null;
  RowSeats: any;
  seatsArray1=[]as any;
  total:number;
  seatsArray2=[] as any;
  userArray=[] as any;
  showDropdown: boolean=false;
  isHovered: boolean[] =[];
  showBaggageDropdown: boolean;

  fareType:number;
  selectedBaggage:any;
  selectedMeal:any;
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  // Define a property to store the selected item
  selectedItem: any;
  
  constructor(private hotels: HotelsService,private flights:FlightsService,private papa:Papa,   private fb: FormBuilder, private datePipe: DatePipe, private zone: NgZone,private cdr: ChangeDetectorRef,private pack:FlightBookingService) {
    // this.getData();
    
    
  }
  ngOnInit(): void {
    
    // this.ssrData = this.ssr;
    this.getPassengerData()
    console.log('init')
    this.initializeForm();
    console.log('init')

    this.convertCSVToJson();
    console.log('init')

    this.initializePrice();
    console.log('init')

    this.getTripData();
    console.log('init')

    console.log(this.editIndex)
    console.log(this.ssr)
    console.log(this.ssr1)
    console.log(this.ssr2)
    // this.ssrData = this.ssr
    // console.log(this.ssrData)
    console.log(this.travelers)
    console.log(this.travelers);
    // console.log(this.total)
    console.log('init')
    if (this.editIndex !== undefined) {
      console.log('init')

      this.handleCardClick(this.editIndex)
      console.log(this.editIndex)
      console.log(this.travelers)
      this.currentIndex=this.editIndex;
      if(this.travelers[this.currentIndex]){
        this.travelerForm.setValue(this.travelers[this.currentIndex]);
        console.log(this.travelerForm.value)
      }
      console.log('init')

     
    }
    

 
  }


  ngOnChanges(changes: SimpleChanges): void {
  
    // console.log(this.total)
    console.log("HotelCardsComponent ngOnChanges", changes);
  
  }

  async getPassengerData(){
    try{
      const res=await this.pack.getAllDetails(sessionStorage.getItem('uid'))
      this.travelData=res.passengers
      console.log(this.travelData)
      if(this.travelData[this.currentIndex]){
        const travelInfo=this.travelData[this.currentIndex]
        this.travelerForm.patchValue({
          personalInfo: {
            FirstName: travelInfo?.personalInfo?.FirstName || '',
            Title: travelInfo?.personalInfo?.Title || '',
            LastName: travelInfo?.personalInfo?.LastName || '',
            DateOfBirth: travelInfo?.personalInfo?.DateOfBirth || '',
            Gender: travelInfo?.personalInfo?.Gender || '',
            Nationality: travelInfo?.personalInfo?.Nationality || '',
            PAN: travelInfo?.personalInfo?.PAN || '',
            AddressLine1: travelInfo?.personalInfo?.AddressLine1|| '',
            AddressLine2: travelInfo?.personalInfo?.AddressLine2|| '',
            Email: travelInfo?.personalInfo?.Email || '',
            ContactNo: travelInfo?.personalInfo?.ContactNo || '',
            PassportNo: travelInfo?.personalInfo?.PassportNo || '',
            PassportIssueDate: travelInfo?.personalInfo?.PassportIssueDate || '',
            PassportExpiry: travelInfo?.personalInfo?.PassportExpiry || '',
            Age: travelInfo?.personalInfo?.Age || '',
            City: travelInfo?.personalInfo?.City || '',
            CountryName: travelInfo?.personalInfo?.CountryName || '',
            CountryCode:travelInfo?.personalInfo?.CountryCode
           
          },
          guardianDetails:{
            Title:travelInfo?.guardianDetails?.Title || '',
            FirstName:travelInfo?.guardianDetails?.FirstName || '',
            LastName:travelInfo?.guardianDetails?.LastName || '',
            PAN:travelInfo?.guardianDetails?.PAN || '',
            PassportNo:travelInfo?.guardianDetails?.PassportNo || '',
          },
          ssr: {
            extraBaggage: travelInfo?.ssr?.extraBaggage || '',
            meal: travelInfo?.ssr?.meal || '',
            seat: travelInfo?.ssr?.seat || '',
          },
          ssr1: {
            extraBaggage: travelInfo?.ssr1?.extraBaggage || '',
            meal: travelInfo?.ssr1?.meal || '',
            seat: travelInfo?.ssr1?.seat || '',
          },
          ssr2: {
            extraBaggage: travelInfo?.ssr2?.extraBaggage || '',
            meal: travelInfo?.ssr2?.meal || '',
            seat: travelInfo ?.ssr2?.seat || '',
          },
        });
        console.log(this.travelerForm.value)
      }
      

    }catch(error){
      console.log(error)
    }
  }
  hoverItem(index: number, isHovered: boolean): void {
    this.isHovered[index] = isHovered;
  }
  loadDataOnce(): void {
    console.log('loading')
    

    // Additional logic if needed
  }
  toggleBaggageDropdown(): void {
    this.showBaggageDropdown = !this.showBaggageDropdown ;
  }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown ;
  }
 

  async getTripData(){
    try{
      const res=await this.pack.getTripDetails(sessionStorage.getItem('uid'))
      console.log(res)
      this.adults=res.tripData.AdultCount;
      this.childs=res.tripData.ChildCount;
      this.infants=res.tripData.InfantCount
      this.NoOfTravellers=this.adults+this.childs+this.infants;
      this.fareType=res.tripData.ResultFareType
   
      
    }catch(error){
      console.log(error.message)
    }
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
onCountrySelect(selectedCountry: string): void {
  if (!selectedCountry) {
    console.error("Failed to extract alpha2 code from the selected country");
    return;
  }

  const [countryName, countryCode] = selectedCountry.split(',').map(value => value.trim());

  if (!countryCode) {
    console.error("Invalid selected country format");
    return;
  }

  const personalInfoGroup = this.travelerForm.get('personalInfo') as FormGroup;

  const countryControl = personalInfoGroup.get('CountryName');
  const countryCodeControl = personalInfoGroup.get('CountryCode');

  if (!countryControl || !countryCodeControl) {
    console.error("Form controls 'Nationality' or 'CountryCode' not found in travelerForm");
    return;
  }

  countryControl.setValue(countryName);
  countryCodeControl.setValue(countryCode);

  console.log(this.travelerForm.value);
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

  adult(){
    this.isChild=false
  }
  child(){
    this.isChild=true
  }




  



  handleSeatMapClick(index: number,rowseats:any,ssrNo:number) {
    this.ssrNo=ssrNo
    this.RowSeats=rowseats
    this.seatMapDialog = !this.seatMapDialog;
    this.selectedSeatMapIndex = index;
  }


  handleSeatMapData(data: any) {
    console.log('Received data from seat map component:', data);
    if(this.ssrNo===0){
      this.seatsArray[data.index]=data.seat
      console.log(this.seatsArray)
      const personalInfoGroup = this.travelerForm.get('ssr') as FormGroup;

      // Assuming 'Nationality' and 'CountryCode' are form controls in 'personalInfo' FormGroup
      const seatControl = personalInfoGroup.get('seat');
      seatControl.setValue(this.seatsArray);
      
    }else if(this.ssrNo===1){
      this.seatsArray1[data.index]=data.seat
      console.log(this.seatsArray1)
      const personalInfoGroup = this.travelerForm.get('ssr1') as FormGroup;

      // Assuming 'Nationality' and 'CountryCode' are form controls in 'personalInfo' FormGroup
      const seatControl = personalInfoGroup.get('seat');
      seatControl.setValue(this.seatsArray1);
    }else if(this.ssrNo===2){
      this.seatsArray2[data.index]=data.seat
      console.log(this.seatsArray2)
      const personalInfoGroup = this.travelerForm.get('ssr2') as FormGroup;

      // Assuming 'Nationality' and 'CountryCode' are form controls in 'personalInfo' FormGroup
      const seatControl = personalInfoGroup.get('seat');
      seatControl.setValue(this.seatsArray2);
    }
    console.log(this.travelerForm.value)
    this.updatePrice()
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
        DateOfBirth: [''],
        Gender: ['', Validators.required],
        Nationality: ['', Validators.required],
        AddressLine1: ['', Validators.required],
        AddressLine2: [''],
        Email: ['', Validators.required],
        ContactNo: ['', Validators.required],
        Phoneno: [''],
        PassportNo:['',Validators.required],
        PassportIssueDate:['',Validators.required],
        PassportExpiry:['',Validators.required],
       
        Age: [''],
        PaxType: [''],
        CountryCode: [''],
        CountryName: [''],
        City: [''],
        LeadPassenger:true,
        IsLeadPax: true
      }),
      guardianDetails: this.fb.group({
        Title: [''],
        FirstName: [''],
        LastName: [''],
        PassportNo: ['']
      }),
      ssr: this.fb.group({
        extraBaggage: new FormControl(),
        meal: new FormControl(),
        seat: new FormControl()
      }),
      ssr1: this.fb.group({
        extraBaggage: new FormControl(),
        meal: new FormControl(),
        seat: new FormControl()
      }),
      ssr2: this.fb.group({
        extraBaggage: new FormControl(),
        meal: new FormControl(),
        seat: new FormControl()
      })
    });
    
    if (this.isPanRequired) {
      // Add the PAN control to the form group
      const personalInfoGroup = this.travelerForm.get('personalInfo') as FormGroup;
      personalInfoGroup.addControl('PAN', this.fb.control('', Validators.required));
    }
    
    

    this.travelerForm.get('personalInfo.ContactNo').valueChanges.subscribe((contactNo) => {
      // Check if the flag is set to true before updating the form

        // Set the value of Phoneno field to the same value as ContactNo
        this.travelerForm.get('personalInfo.Phoneno').setValue(contactNo);
      
    });
    this.travelerForm.get('personalInfo.DateOfBirth').valueChanges.subscribe((dob) => {
      // Update the Age field when Date of Birth changes
      const age = this.calculateAge(dob);
      this.travelerForm.get('personalInfo.Age').setValue(age);
      console.log(age)
    });
  
    // Subscribe to value changes 
    // ['ssr', 'ssr1', 'ssr2'].forEach((ssrSection) => {
    //   ['extraBaggage', 'meal', 'seat'].forEach((controlName) => {
    //     this.travelerForm.get(`${ssrSection}.${controlName}`).valueChanges.subscribe(() => this.updatePrice());
    //   });
    // });
  
    

  }
  logSelectedItem(){
    console.log(this.selectedBaggage)
  }

 handleSSR(formGroupName: string, controlName: string, item: any): void {
  console.log(item);
  console.log(this.selectedBaggage);

  // Set the value of the control to the entire item object
  this.travelerForm.get(formGroupName).get(controlName).setValue(item);

  const srrGroup = this.travelerForm.get(formGroupName) as FormGroup;
  const ssr = srrGroup.get(controlName);
ssr.setValue(item)
  // Update price (assuming you have a separate function for this)
  this.updatePrice();

  // Handle specific control toggles (assuming you have functions for this)
  if (controlName === 'extraBaggage') {
    this.toggleBaggageDropdown();
  } else if (controlName === 'meal') {
    this.toggleDropdown();
  }

  console.log(this.travelerForm.value); // Log the entire form value for debugging
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

    if (this.ssr) {
        // Update this.price based on ssr values
        this.price[this.currentIndex].baggage = (ssrForm.get('extraBaggage').value)?.Price || 0;
        this.price[this.currentIndex].meal = (ssrForm.get('meal').value)?.Price || 0;
        this.price[this.currentIndex].seat = (Number)((ssrForm.get('seat').value || []).map(item => {
            const price = parseFloat(item.Price);
            return isNaN(price) ? 0 : price;
        }));
        console.log(this.travelerForm.value)
        console.log(this.price)

    } else if (this.ssr1 && this.ssr2) {
        // Update this.price based on ssr1 and ssr2 values
        this.price[this.currentIndex].baggage = (ssr1Form.get('extraBaggage').value)?.Price || 0;
        this.price[this.currentIndex].meal = (ssr1Form.get('meal').value)?.Price || 0;
        this.price[this.currentIndex].seat = (Number)((ssr1Form.get('seat').value || []).map(item => {
            const price = parseFloat(item.Price);
            return isNaN(price) ? 0 : price;
        }));

        this.price[this.currentIndex].baggage += (ssr2Form.get('extraBaggage').value)?.Price || 0;
        this.price[this.currentIndex].meal += (ssr2Form.get('meal').value)?.Price || 0;
        this.price[this.currentIndex].seat += (Number)((ssr2Form.get('seat').value || []).map(item => {
            const price = parseFloat(item.Price);
            return isNaN(price) ? 0 : price;
        }));
    }

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

 
  

  
  
  
  
  
  
  
  
  
  

  

// for ssr price
initializePrice(){
  for(let i=0;i<this.adults+this.childs+this.infants;i++){
    this.price.push({seat:0,meal:0,baggage:0})
  }
  console.log(this.price)
}
  

  async addTraveler() {
    console.log(this.travelerForm.value)

   
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
      const res = await this.pack.savePerPassengerData(form,this.currentIndex,sessionStorage.getItem('uid'));
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
      const res = await this.pack.updatePassengerDetails(form, this.currentIndex,sessionStorage.getItem('uid'));
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


  handleCardClick(index: number) {
    console.log('Before update:', this.currentIndex);
       
    this.zone.run(() => {
      // this.editIndex=index;
      this.currentIndex = index;
      console.log(this.currentIndex)
      this.selectedCard = index;
      this.cdr.detectChanges();
      const travelerData = this.travelers[this.currentIndex];
      

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
            CountryName: travelerData?.personalInfo?.CountryName || '',
           
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
          ssr1: {
            extraBaggage: travelerData?.ssr1?.extraBaggage || '',
            meal: travelerData?.ssr1?.meal || '',
            seat: travelerData?.ssr1?.seat || '',
          },
          ssr2: {
            extraBaggage: travelerData?.ssr2?.extraBaggage || '',
            meal: travelerData?.ssr2?.meal || '',
            seat: travelerData?.ssr2?.seat || '',
          },
        });
        console.log(this.travelerForm.value)
      }
    });
  }
}
