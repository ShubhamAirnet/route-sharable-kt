import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { Cashfree } from 'cashfree-pg';
import { HotelsService } from 'src/app/Services/hotels_api/hotels.service';
import { PackageService } from 'src/app/Services/package/package.service';
import { TransactionsService } from 'src/app/Services/transactions.service';
import { hotel_details } from 'src/app/components/package-cancellation/hotel_details';
import { cashfree } from '../checkout/util';
import { TravelDataFlightsComponent } from 'src/app/components/travel-data-flights/travel-data-flights.component';
import { FlightBookingService } from 'src/app/Services/flight_booking/flight-booking.service';
import { HotelBookingService } from 'src/app/Services/hotels_booking/hotel-booking.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-package-checkout-hotels',
  templateUrl: './package-checkout-hotels.component.html',
  styleUrls: ['./package-checkout-hotels.component.scss']
})
export class PackageCheckoutHotelsComponent implements OnInit {
 editIndex:number
  dialog:boolean=false;
  contactForm: FormGroup;
  
  merchantShare:number=0;
  travelers=[]as any;

  transactionFee:number;
  totalCost:number=0;
  initialCost:any;
  loading:boolean;
  sessionId:string;
  version:string;
  pay:boolean=false;
  gst:number=0;
  ssrPrice:any;
  baggagePrice:number;
  seatPrice:number;
  mealPrice:number;
  ssr:any;
  isToggle:boolean=true;
  isCollapsed:boolean=true;
  isDateCollapsed:boolean=true;
  isExclusionCollapsed:boolean=true;
  arrowTermDirection = 'down';
  arrowDirection = 'down';
  arrowDateDirection = 'down';
  arrowExclusionDirection = 'down';
  taxesSectionExpanded: boolean = false;
  // sample data


// checkbox
checkBox1: boolean = false;
checkBox2: boolean = false;




// dialog box variables
privacyDialog:boolean=false;
termsDialog:boolean=false;
refundibleDialog:boolean=false;

// cancel variables
hotelData:any;
minLastCancellationDate:any;
LastCancelPolicy=[]
 
  formattedLastCancellationDate: any;
  packageDialog: boolean;
  NoOfTravellers: number;
  RoomGuest: any;
  Travellers: boolean;
  taxes: any;
  hotelCost: number=0;
  incentiveEarned: number=0;
  localStorageData: string;
  adults: any;
  child: any;
  infants: any;
  noOfRooms:number=0;

  travelData:any
  isPanRequired: any;
  isPassportRequired: any;
  tds: number=0;
  netPayable: any;
  IsPackageDetailsMandatory:boolean=false;
  IsDepartureDetailsMandatory:boolean=false;
  isSamePanAllowed:boolean=false;
  merchantGSt:number=0;
 
  isUnderCancellationAllowed:boolean;
  transportForm: any;
  hotelNorms: any;
  tooltipStates: boolean[] = [false, false, false];
  tooltipCloseTimeout: any;

  constructor(private hotels:HotelsService,private sanitizer: DomSanitizer,private spinner: NgxSpinnerService,private hotelBook:HotelBookingService,private datePipe: DatePipe,private zone: NgZone,private fb: FormBuilder,private cdr: ChangeDetectorRef,private transact:TransactionsService,private pack:FlightBookingService) {
  
    
   }

  ngOnInit(): void {
    this.spinner.show()
    this.adults=0;
    this.child=0;
    this.initializeTransport()
    
    this.getRoomData()
    this.initializeForm()
    this.intializeTravelers()
       
   
  }

  private initializeTransport(): void {
    this.transportForm = this.fb.group({
     
      ArrivalTransport:  this.fb.group({
        ArrivalTransportType: ['', Validators.required],
        TransportInfoId: ['', Validators.required],
        Time: ['', Validators.required]
      }),  // Empty FormGroup if not mandatory
      // Initialize DepartureTransport control if IsDepartureDetailsMandatory is true
      DepartureTransport:  this.fb.group({
          DepartureTransportType: ['', Validators.required],
          TransportInfoId: ['', Validators.required],
          Time: ['', Validators.required]
      }) , 
      
    
    });
    


  }

  async getRoomData(){
    try{
      const res=await this.hotelBook.getRoomData(sessionStorage.getItem('hotel_uid'))
      console.log(res)
      this.hotelData=res;
      this.isUnderCancellationAllowed=this.hotelData?.hotelInfo?.isUnderCancellationAllowed;
   
      this.noOfRooms=this.hotelData?.trip?.noOfRooms
      this.hotelData?.trip?.roomGuests.map((item)=>{
        this.adults+=item.NoOfAdults;
        this.child+=item.NoOfChild;
      })
      await this.hotelBlockRoom()
    }catch(error){
      console.log(error.message)
    }
  }
  
  async hotelBlockRoom(){
    const payload={
      ResultIndex:this.hotelData?.hotel_details?.resultIndex,
      HotelName:this.hotelData?.hotel_details?.hotelName,
      HotelCode:this.hotelData?.hotel_details?.hotelCode,
      NoOfRooms:this.hotelData?.trip?.noOfRooms,
      IsVoucherBooking:this.isUnderCancellationAllowed,
      GuestNationality:this.hotelData?.trip?.nationality,
      HotelRoomsDetails:this.hotelData?.hotel_details?.rooms.map((item)=>{ return item.room}),
      TraceId:sessionStorage.getItem('hotel_traceId'),
      TokenId:localStorage.getItem('authenticateToken'),
  
    }
    console.log(payload)
    try{
      const res=await this.hotels.hotelBlockRoom(payload);
      console.log(res)
      this.hotelNorms = this.sanitizer.bypassSecurityTrustHtml(res?.BlockRoomResult?.HotelPolicyDetail);
      this.IsPackageDetailsMandatory=res?.BlockRoomResult?.IsPackageDetailsMandatory;
      this.IsDepartureDetailsMandatory=res?.BlockRoomResult?.IsDepartureDetailsMandatory;
      this.isPanRequired=res?.BlockRoomResult?.ValidationInfo?.ValidationAtConfirm?.IsPANMandatory;
      this.isPassportRequired=res?.BlockRoomResult?.ValidationInfo?.ValidationAtConfirm?.IsPassportMandatory;
      this.isSamePanAllowed=res?.BlockRoomResult?.ValidationInfo?.ValidationAtConfirm?.IsSamePANForAllAllowed;
      res?.BlockRoomResult?.HotelRoomsDetails.map((item)=>{
        this.hotelCost+=item?.Price?.PublishedPriceRoundedOff;
        this.incentiveEarned+=item?.Price?.AgentCommission;
        this.gst+=item?.Price?.TotalGSTAmount;
        this.tds+=item?.Price?.TDS;
        
      })
      console.log()
      this.netPayable=this.hotelCost-this.incentiveEarned+this.gst+this.tds;
      this.totalCost=this.netPayable;
      this.transactionFee=this.totalCost*0.0175;
      this.totalCost+=this.transactionFee
      this.totalCost= +this.totalCost.toFixed(2)
      this.transactionFee= +this.transactionFee.toFixed(2)
      this.tds= +this.tds.toFixed(2)
      this.gst= +this.gst.toFixed(2)
      console.log(this.netPayable)
      this.updateRoomDetails(res?.BlockRoomResult?.HotelRoomsDetails,payload.IsVoucherBooking)
    }catch(error){
      console.log(error.message)
    }
    this.spinner.hide()
  }

  async holdBooking(){
    const payload={
      token:localStorage.getItem('authenticateToken'),
      uid:sessionStorage.getItem('hotel_uid'),
      collection:'hotel_bookings',
      traceId:sessionStorage.getItem('hotel_traceId'),
      voucher:false
    }

    try{
      const {data}=await this.hotels.singleHotelBookRoom(payload);
      console.log(data)
   
    }catch(error){
      console.log('something went wrong',error.message)
      // await this.getAllHotelDetails()
    }
  }
  async updateRoomDetails(rooms: any,IsVoucherBooking:boolean) {
    const hotelRooms= rooms.map((item: any) => {
      if (item) {
        const {
          RoomIndex,
          RoomTypeCode,
          RoomTypeName,
          RatePlanCode,
          BedTypeCode,
          SmokingPreference,
          Supplements,
          Price
        } = item;
  
        // Mapping SmokingPreference values to the corresponding numeric values
        let updatedSmokingPreference;
        switch (SmokingPreference) {
          case 'NoPreference':
            updatedSmokingPreference = 0;
            break;
          case 'Smoking':
            updatedSmokingPreference = 1;
            break;
          case 'NonSmoking':
            updatedSmokingPreference = 2;
            break;
          case 'Either':
            updatedSmokingPreference = 3;
            break;
          default:
            updatedSmokingPreference = SmokingPreference; // Keeping original value if not recognized
        }
  
        const updatedRoom = {
          RoomIndex: RoomIndex || '',
          RoomTypeCode: RoomTypeCode || '',
          RoomTypeName: RoomTypeName || '',
          RatePlanCode: RatePlanCode || '',
          BedTypeCode: BedTypeCode || '',
          SmokingPreference: updatedSmokingPreference, // Updated SmokingPreference value
          Supplements: Supplements || '',
          Price: Price || ''
        };
  
        return {
          updatedRoom
        };
      }
  
      // If item.room doesn't exist, return the original item
      return item;
    });

    console.log(hotelRooms)
    try{
      const res=await this.hotelBook.updateRoomDetails(hotelRooms,sessionStorage.getItem('hotel_uid'),IsVoucherBooking);
      console.log(res);
    }catch(error){
      console.log(error.message)
    }
  }
  


  handleTravelerArrayChange(event:any){
    console.log(event)
    this.travelers=event;
    console.log(this.travelers)
    this.cdr.detectChanges();
  }


 

  toggle() {
    this.isToggle = !this.isToggle;
    this.arrowTermDirection = this.isToggle ? 'down' : 'up';
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.arrowDirection = this.isCollapsed ? 'down' : 'up';
  }
  toggleDateCollapse() {
    this.isDateCollapsed = !this.isDateCollapsed;
    this.arrowDateDirection = this.isDateCollapsed ? 'down' : 'up';
  }
  toggleExclusionCollapse() {
    this.isExclusionCollapsed = !this.isExclusionCollapsed;
    this.arrowExclusionDirection = this.isExclusionCollapsed ? 'down' : 'up';
  }

  toggleTaxesSection() {
    this.taxesSectionExpanded = !this.taxesSectionExpanded;
  }
  

  areAllCheckboxesChecked(): boolean {
    return this.checkBox1 && this.checkBox2 ;
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      gst: [''],
      companyName: [''],
      companyNumber: [''],
      companyAddress: [''],
    });

   
  }

//  dialogBox functions

  dialogBox(index:number){
    this.dialog=!this.dialog
    this.editIndex=index
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

  async submit(){
    this.pay=true
    console.log(this.contactForm.value)
    console.log(this.transportForm.value)
 
    await this.hotelBook.updatePrimaryContact(this.contactForm.value,sessionStorage.getItem('hotel_uid')) 
    await this.hotelBook.storeTransportData(sessionStorage.getItem('hotel_uid'),this.transportForm.value) 
  
  }


  
  

  toggleTerms() {
    const termsContainer = document.querySelector('.terms');
    const arrowDown = document.getElementById('arrowDown');
    const arrowUp = document.getElementById('arrowUp');

    termsContainer.classList.toggle('terms-expanded');
    arrowDown.classList.toggle('arrow-hidden');
    arrowUp.classList.toggle('arrow-hidden');
  }

  updateContainerHeight() {
    const container = document.getElementById('dynamicContainer');
    const boxCount = container.querySelectorAll('.box1').length;
    const newHeight = 180 + (boxCount * 40); // Adjust the value based on your styling
    container.style.height = `${newHeight}px`;
}
  addBox() {
    this.Travellers=!this.Travellers;
}
getArray(length: number): any[] {
  return new Array(length);
}

intializeTravelers() {
  console.log('initialize');
  for (let j = 0; j < this.adults + this.child + this.infants; j++) {
    const traveler: any = {
      personalInfo: {
        FirstName: '',
        Title: '',
        LastName: '',
        DateOfBirth: '',
        Gender: '',
        Email: '',
        ContactNo: '',
        Age: '',
        PaxType: j < this.adults ? 1 : 2,
        PAN: '',
        LeadPassenger: true
      }
    };

    // Conditionally add ArrivalTransport and DepartureTransport properties
    if (this.IsPackageDetailsMandatory) {
      traveler.ArrivalTransport = {
        Time: '',
        TransportInfoId: '',
        ArrivalTransportType: ''
      };
    }

    if (this.IsPackageDetailsMandatory) {
      traveler.DepartureTransport = {
        Time: '',
        TransportInfoId: '',
        DepartureTransportType: ''
      };
    }

    // Conditionally add PAN and Passport properties
    if (this.isPassportRequired) {
      traveler.personalInfo.PassportNo = '';
      traveler.personalInfo.PassportIssueDate = '';
      traveler.personalInfo.PassportExpiry = '';
    }

    this.travelers.push(traveler);
  }
  console.log(this.travelers);
}



onMerchantShareChange() {
  console.log('Merchant Share changed:', this.merchantShare);

  const costChange = this.totalCost - this.initialCost;
  this.merchantGSt=this.merchantShare*0.18;
  this.merchantGSt = +this.merchantGSt.toFixed(2);
  this.totalCost = this.initialCost + this.merchantShare+this.merchantGSt;
  this.transactionFee = 0.0175 * this.totalCost;

  // Round to two decimal places
  this.transactionFee = +this.transactionFee.toFixed(2);

  // Update totalCost with the transaction fee
  this.totalCost += this.transactionFee;

  // Update initialTotalCost to the latest totalCost
  if(this.merchantShare==null || this.merchantShare===0){
    this.totalCost=this.initialCost+this.transactionFee
  }

  // Round totalCost to two decimal places
  this.totalCost = +this.totalCost.toFixed(2);

}


// Pay Now flow
getPaymentLink(){
  const formValues=this.contactForm.value;
  formValues.totalCost=this.totalCost;
  formValues.transactionFee=this.transactionFee;
  formValues.merchantShare=this.merchantShare;
  formValues.merchantGst=this.merchantGSt;
  formValues.hotelCost=this.hotelCost
  formValues.incentiveEarned=this.incentiveEarned
  
  formValues.taxes=this.tds+this.gst

  this.saveUserDetails(formValues);

}



async saveUserDetails(formValues:any){
  console.log('saving')
  try{
    const res=await this.transact.saveUserPaymentDetails(formValues);
    console.log(res)
   // Assuming 'this.router' is an instance of the Angular Router service
   sessionStorage.setItem('transact',res)
    this.getSessionId(res,formValues)




  }catch(error){
    console.log(error)
  }
}
 



async initializeCashfree(): Promise<void>  {
  try {
    const cashfree: Cashfree = await load({ mode: 'sandbox' }); // Adjust the initialization based on the actual structure of your Cashfree library
  // Assuming a default version
  } catch (error) {
    console.error('Error initializing Cashfree:', error);
  }
}

async getSessionId(order_id:string,form:any): Promise<void> {
  this.loading = true;

  try {
    const res = await axios.post('http://localhost:4000/createOrder', { version: this.version,form:form,order_id:order_id });
    this.loading = false;
    this.sessionId = res.data;
    if(res.data.success){
      // const redirectUrl = res.data.data.payments.url;
      // window.location.href = redirectUrl;
      // console.log(res.data.data)
      const sessionId=res.data.data.payment_session_id
      this.handlePayment(sessionId,order_id)
    }
  } catch (err) {
    this.loading = false;
    console.error('Error fetching sessionId:', err);
  }
}
handlePayment(sessionId:string,order_id:string): void {
  const checkoutOptions = {
    paymentSessionId: sessionId,
    returnUrl: `http://localhost:4200/success/${sessionStorage.getItem('hotel_uid')}/0`,
  };

  cashfree.then((cf) => {
    cf.checkout(checkoutOptions).then(function(result){
      if (result.error) {
        alert(result.error.message);
      }
      if (result.redirect) {
        console.log("Redirection");
        console.log(result);
      }
    });
  });
}


// generate payment link flow


async saveUserData(formValues:any){
  console.log('saving')
  try{
    const res=await this.transact.saveUserPaymentDetails(formValues);
    console.log(res)
   // Assuming 'this.router' is an instance of the Angular Router service
    this.generateLink(formValues,res)




  }catch(error){
    console.log(error)
  }
}

async generateLink(form:any,link_id:string){
  try{
    const res=await axios.post('http://localhost:4000/getPaymentLink',{form:form,version:this.version,link_id:link_id});
    const linkUrl = res.data.link_url;
    console.log(linkUrl)
    console.log(res.data)
    // Navigate to the generated URL
    // window.location.href = linkUrl;
  }catch(error){
    console.log(error)
  }
}

mouseEntered(index: number): void {
  // Set the tooltip state at the specified index to true
  this.tooltipStates = this.tooltipStates.map((state, i) => i === index);

  // console.log(this.tooltipStates)
}

mouseLeft(index: number): void {
  // Delay closing the tooltip to allow the cursor to move from trigger to tooltip
  this.setTooltipCloseTimeout(index);
}


setTooltipCloseTimeout(index: number): void {
  // Close the tooltip after a delay
  console.log("outside timeout")

  this.tooltipCloseTimeout = setTimeout(() => {
    console.log("in timeout")
    this.tooltipStates[index] = false;
  }, 2000); // Adjust the delay as needed
}


mouseOnTooltip(index: number): void {
  clearTimeout(this.tooltipCloseTimeout);
}

mouseLeftTooltip(index:number){
  this.setTooltipCloseTimeout(index);
}
closeFareRuleOnX(index){
  this.tooltipStates[index] = false;
}



}
function load(arg0: { mode: string; }): Cashfree | PromiseLike<Cashfree> {
  throw new Error('Function not implemented.');
}

