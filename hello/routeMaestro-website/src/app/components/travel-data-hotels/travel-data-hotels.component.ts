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
import { HotelBookingService } from 'src/app/Services/hotels_booking/hotel-booking.service';
@Component({
  selector: 'app-travel-data-hotels',
  templateUrl: './travel-data-hotels.component.html',
  styleUrls: ['./travel-data-hotels.component.scss']
})
export class TravelDataHotelsComponent implements OnInit {
  @ViewChild('dpInput') dpInput: any;
  @Input() dialog: boolean;
  @Input() editIndex: number;

  
  @Input()  travelers;
  @Input() isPanRequired: boolean;
  @Input() isPassportRequired: boolean;
  @Input() IsDepartureDetailsMandatory: boolean;
  @Input() IsPackageDetailsMandatory: boolean;
  @Input() isSamePanAllowed: boolean;

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
  selectedCountry:any;
  seatsArray=[]as any;
  selectedSeatMapIndex: number | null = null;
  RowSeats: any;
  seatsArray1=[]as any;
  total:number;
  seatsArray2=[] as any;
  userArray=[] as any;
  noOfRooms: any;
  RoomGuest:any;
  constructor(private hotels: HotelsService,private hotelBook:HotelBookingService,private flights:FlightsService,private papa:Papa,   private fb: FormBuilder, private datePipe: DatePipe, private zone: NgZone,private cdr: ChangeDetectorRef,private pack:FlightBookingService) {
    // this.getData();
    
    
  }
  ngOnInit(): void {
    console.log(this.IsDepartureDetailsMandatory)
    console.log(this.IsPackageDetailsMandatory)
    console.log(this.isPanRequired)
    console.log(this.isPassportRequired)
    console.log(this.isSamePanAllowed)
    
    // this.ssrData = this.ssr;
    console.log('init')
    this.initializeForm();
    console.log('init')
    this.getRoomData()
  

    console.log('init')

    console.log(this.editIndex)

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
      const res=await this.pack.getAllDetails(sessionStorage.getItem('hotel_uid'))
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
           
            PAN: travelInfo?.personalInfo?.PAN || '',
            
            Email: travelInfo?.personalInfo?.Email || '',
            ContactNo: travelInfo?.personalInfo?.ContactNo || '',
            PassportNo: travelInfo?.personalInfo?.PassportNo || '',
            PassportIssueDate: travelInfo?.personalInfo?.PassportIssueDate || '',
            PassportExpiryDate: travelInfo?.personalInfo?.PassportExpiryDate || '',
            Age: travelInfo?.personalInfo?.Age || '',
      
           
          }
        });
        console.log(this.travelerForm.value)
      }
      

    }catch(error){
      console.log(error)
    }
  }
  loadDataOnce(): void {
    console.log('loading')
    

    // Additional logic if needed
  }
  async getRoomData(){
    this.adults=0;
    this.childs=0;
    try{
      const res=await this.hotelBook.getRoomData(sessionStorage.getItem('hotel_uid'))
      console.log(res)
     
      this.noOfRooms=res?.trip?.noOfRooms
      this.RoomGuest=res?.trip?.roomGuests
      res?.trip?.roomGuests.map((item)=>{
        this.adults+=item.NoOfAdults;
        this.childs+=item.NoOfChild;
      })
      
    }catch(error){
      console.log(error.message)
    }
  }
  calculateTotalAdultsCount(i: number): number {
    let total = 0;

    for (let k = i; k > 0; k--) {
      total += this.RoomGuest[k - 1]?.NoOfAdults + this.RoomGuest[k - 1]?.NoOfChild || 0;
    }

    return total;
  }

// Ensure that 'country' represents the selected country, not a city





  adult(){
    this.isChild=false
  }
  child(){
    this.isChild=true
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
        Email: ['', Validators.required],
        ContactNo: ['', Validators.required],
        Phoneno: [''],
        PAN:['',Validators.required],
        Age: [''],
        PaxType: [''],
        LeadPassenger: [true]
      }),
      ArrivalTransport: this.IsPackageDetailsMandatory ? this.fb.group({
        ArrivalTransportType: ['', Validators.required],
        TransportInfoId: ['', Validators.required],
        Time: ['', Validators.required]
      }) : this.fb.group({}), // Empty FormGroup if not mandatory
      // Initialize DepartureTransport control if IsDepartureDetailsMandatory is true
      DepartureTransport: this.IsDepartureDetailsMandatory ? this.fb.group({
          DepartureTransportType: ['', Validators.required],
          TransportInfoId: ['', Validators.required],
          Time: ['', Validators.required]
      }) : this.fb.group({}), 
      
    
    });
    
    if (this.isPassportRequired) {
      // Add the PAN control to the form group
      const personalInfoGroup = this.travelerForm.get('personalInfo') as FormGroup;
      personalInfoGroup.addControl('PassportNo', this.fb.control('', Validators.required));
      personalInfoGroup.addControl('PassportIssueDate', this.fb.control('', Validators.required));
      personalInfoGroup.addControl('PassportExpDate', this.fb.control('', Validators.required));
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
      if(age>12){
        this.travelerForm.get('personalInfo.PaxType').setValue(1)
      }else{
        this.travelerForm.get('personalInfo.PaxType').setValue(2)

      }
      console.log(age)
    });
  
    // Subscribe to value changes 
    // ['ssr', 'ssr1', 'ssr2'].forEach((ssrSection) => {
    //   ['extraBaggage', 'meal', 'seat'].forEach((controlName) => {
    //     this.travelerForm.get(`${ssrSection}.${controlName}`).valueChanges.subscribe(() => this.updatePrice());
    //   });
    // });
  
    console.log(this.travelerForm.value)

  }



  async addTraveler() {

   

      console.log('length', this.travelers);
      console.log(this.currentIndex)
  
    
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
      const res = await this.hotelBook.savePerPassengerData(form,this.currentIndex,sessionStorage.getItem('hotel_uid'));
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
      const res = await this.pack.updatePassengerDetails(form, this.currentIndex,sessionStorage.getItem('hotel_uid'));
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
      console.log(this.travelData)

      if (travelerData) {
        this.travelerForm.patchValue({
          personalInfo: {
            FirstName: travelerData?.personalInfo?.FirstName || '',
            Title: travelerData?.personalInfo?.Title || '',
            LastName: travelerData?.personalInfo?.LastName || '',
            DateOfBirth: travelerData?.personalInfo?.DateOfBirth || '',
            Gender: travelerData?.personalInfo?.Gender || '',
          
            PAN: travelerData?.personalInfo?.PAN || '',
            
            Email: travelerData?.personalInfo?.Email || '',
            ContactNo: travelerData?.personalInfo?.ContactNo || '',
            PassportNo: travelerData?.personalInfo?.PassportNo || '',
            PassportIssueDate: travelerData?.personalInfo?.PassportIssueDate || '',
            PassportExpiryDate: travelerData?.personalInfo?.PassportExpiryDate || '',
            Age: travelerData?.personalInfo?.Age || '',
            
           
          },
          
       
        });
        console.log(this.travelerForm.value)
      }
    });
  }
}
