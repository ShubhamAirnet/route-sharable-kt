import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelsService } from 'src/app/Services/hotels_api/hotels.service';
import { Cashfree, load } from '@cashfreepayments/cashfree-js';
import { cashfree } from './util';
import axios from 'axios';
import { TransactionsService } from 'src/app/Services/transactions.service';
import { hotel_details } from '../../components/package-cancellation/hotel_details';
import { DatePipe } from '@angular/common';
import { PackageService } from 'src/app/Services/package/package.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-package-checkout',
  templateUrl: './package-checkout.component.html',
  styleUrls: ['./package-checkout.component.scss']
})
export class PackageCheckoutComponent implements OnInit {
  NoOfRooms:number=0;
  NoOfAdults:number=0;
  NoOfChild:number=0;
  travelData:any;
  dialog:boolean=false;
  contactForm: FormGroup;
  Travellers:boolean=true;
  merchantShare:number=0;
  travelers=[] as any[];
  editIndex:number=0;
  @Input() TraceId:any;
  @Input() ResultIndex:any;
  transactionFee:number;
  totalCost:any;
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
  ssr1:any;
  ssr2:any;
  isToggle:boolean=true;
  isCollapsed:boolean=true;
  isDateCollapsed:boolean=true;
  isExclusionCollapsed:boolean=true;
  arrowTermDirection = 'down';
  arrowDirection = 'down';
  arrowDateDirection = 'down';
  arrowExclusionDirection = 'down';
  taxesSectionExpanded: boolean = false;


// checkbox
checkBox1: boolean = false;
checkBox2: boolean = false;




// dialog box variables
privacyDialog:boolean=false;
termsDialog:boolean=false;
refundibleDialog:boolean=false;

// cancel variables
hotelData=hotel_details;
minLastCancellationDate:any;
LastCancelPolicy=[]
 
  formattedLastCancellationDate: any;
  packageDialog: boolean;
  NoOfTravellers: number;
  RoomGuest: any;

  constructor(private hotels:HotelsService,private spinner: NgxSpinnerService,private datePipe: DatePipe,private zone: NgZone,private fb: FormBuilder,private cdr: ChangeDetectorRef,private transact:TransactionsService,private pack:PackageService) {
 
    
   }

  ngOnInit(): void {
    this.getData();
    this.getPassengerData()
    this.initializeForm();
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
  handleTravelerArrayChange(travelerArray: any[]): void {
    // Process the traveler array data received from the child component
    console.log(travelerArray);
    this.travelers=travelerArray;
    console.log(this.travelers)
    this.zone.run(() => {
      this.cdr.detectChanges();
    });
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

  dialogbox(index:number){
    console.log(index)
    this.dialog=!this.dialog;
    this.editIndex=index;
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
    console.log(this.travelers)
    await this.pack.updatePrimaryContact(this.contactForm.value,localStorage.getItem('uid')) 
    await this.pack.savePassengerDetails(this.travelers,localStorage.getItem('uid'))
  }

  async getData() {
    console.log('fetching');
    
    try {
      const res = await this.hotels.getSearchInfo();
      console.log(res);
  
      if (res) {
        this.travelData = res;
        this.NoOfRooms = this.travelData.trip.RoomGuests.length;
        this.RoomGuest=this.travelData.trip.RoomGuests;
        for(let i=0;i<this.travelData.trip.RoomGuests.length;i++){
          this.NoOfAdults+=this.travelData.trip.RoomGuests[i].NoOfAdults;
          this.NoOfChild+=this.travelData.trip.RoomGuests[i].NoOfChild;
        }
        this.totalCost = this.travelData.cost.flightCost+this.travelData.cost.hotelCost+this.travelData.cost.taxes
        this.initialCost=this.totalCost;
        this.transactionFee=this.totalCost*0.0175;
        this.transactionFee = +this.transactionFee.toFixed(2);
        this.totalCost += this.transactionFee;
        this.totalCost = +this.totalCost.toFixed(2);
        this.NoOfTravellers=this.NoOfAdults+this.NoOfChild;

        
        
      } else {
        console.log("No passenger data received from getPassengerDetails");
      }

        
      
    } catch (error) {
      console.log(error);
    }
  }

  async getPassengerData() {
    console.log('passengers fetching');
    try {
      const res = await this.pack.getPassengerDetails();
      console.log(res.passengers);
  
      if (this.NoOfTravellers > 0) {
        for(let i=0;i<this.RoomGuest.length;i++){
          for(let j=0;j<this.RoomGuest[i].NoOfAdults+this.RoomGuest[i].NoOfChild;j++){
            if(j < this.RoomGuest[i]?.NoOfAdults){
              this.travelers.push({
                personalInfo: {
                  FirstName: '',
                  Title: '',
                  LastName: '',
                  DateOfBirth: '',
                  Gender: '',
                  Nationality: '',
                  AddressLine1: '',
                  AddressLine2: '',
                  Email: '',
                  ContactNo: '',
                  PAN: '',
                  PassportNo: '',
                  PassportIssueDate: '',
                  PassportExpDate: '',
                  PassportExpiry: '',
                  Age: '',
                  PaxType: 1,
                  CountryCode: '',
                  City: '',
                  CountryName: '',
                  LeadPassenger: true
                },
                dates:{
                  dob:{
                    day:'',
                    month:'',
                    year:''
                  },
                  passportIssue:{
                    day:'',
                    month:'',
                    year:''
                  },
                  passportExpiry:{
                    day:'',
                    month:'',
                    year:''
                  }
                },
                guardianDetails:{
                  Title:'',
                  FirstName:'',
                  LastName:'',
                  PAN:'',
                  PassportNo:'',
                },
                ssr: {
                  extraBaggage: '',
                  meal: '',
                  seat: ''
                }
              });
            }else{
              this.travelers.push({
                personalInfo: {
                  FirstName: '',
                  Title: '',
                  LastName: '',
                  DateOfBirth: '',
                  Gender: '',
                  Nationality: '',
                  AddressLine1: '',
                  AddressLine2: '',
                  Email: '',
                  ContactNo: '',
                  PAN: '',
                  PassportNo: '',
                  PassportIssueDate: '',
                  PassportExpDate: '',
                  PassportExpiry: '',
                  Age: '',
                  PaxType: 2,
                  CountryCode: '',
                  City: '',
                  CountryName: '',
                  LeadPassenger: false
                },
                dates:{
                  dob:{
                    day:'',
                    month:'',
                    year:''
                  },
                  passportIssue:{
                    day:'',
                    month:'',
                    year:''
                  },
                  passportExpiry:{
                    day:'',
                    month:'',
                    year:''
                  }
                },
                guardianDetails:{
                  Title:'',
                  FirstName:'',
                  LastName:'',
                  PAN:'',
                  PassportNo:'',
                },
                ssr: {
                  extraBaggage: '',
                  meal: '',
                  seat: ''
                }
              });
            }
          }
        }
  
        // If there is data in res.passenger, update the travelers array
        // Corrected condition: use res.passengers
      if (res && Array.isArray(res.passengers) && res.passengers.length > 0) {
        for (let i = 0; i < this.NoOfTravellers && i < res.passengers.length; i++) {
          const passengerData = res.passengers[i];
          console.log(passengerData)
          this.travelers[i] = {
            personalInfo: {
              ...passengerData?.personalInfo,
              LeadPassenger: passengerData?.personalInfo?.LeadPassenger || true
            },
            ssr: {
              ...passengerData?.ssr
            },
            dates:{
              ...passengerData?.dates
            },
            guardianDetails:{
              ...passengerData?.guardianDetails
            }
          };
          // console.log(this.travelers[i])
        }
      }
      console.log('traveler', this.travelers);

      }
    } catch (error) {
      console.log(error);
    }
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

onMerchantShareChange() {
  console.log('Merchant Share changed:', this.merchantShare);

  const costChange = this.totalCost - this.initialCost;
  this.gst=this.merchantShare*0.18;
  this.gst = +this.gst.toFixed(2);
  this.totalCost = this.initialCost + this.merchantShare+this.gst;
  this.transactionFee = 0.0175 * this.totalCost;

  // Round to two decimal places
  this.transactionFee = +this.transactionFee.toFixed(2);

  // Update totalCost with the transaction fee
  this.totalCost += this.transactionFee;

  // Update initialTotalCost to the latest totalCost
  if(this.merchantShare==null || this.merchantShare===0){
    this.totalCost=this.initialCost
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
  formValues.flightCost=this.travelData.cost.flightCost
  formValues.hotelCost=this.travelData.cost.taxes
  formValues.taxes=this.travelData.cost.hotelCost

  this.saveUserDetails(formValues);

}



async saveUserDetails(formValues:any){
  console.log('saving')
  try{
    const res=await this.transact.saveUserPaymentDetails(formValues);
    console.log(res)
   // Assuming 'this.router' is an instance of the Angular Router service
    this.getSessionId(res,formValues)




  }catch(error){
    console.log(error)
  }
}
 



async initializeCashfree(): Promise<void>  {
  try {
    const cashfree: Cashfree = await load({ mode: 'sandbox' }); // Adjust the initialization based on the actual structure of your Cashfree library
    this.version = cashfree.version(); // Assuming a default version
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
    returnUrl: `http://localhost:4200/success/${localStorage.getItem('uid')}`,
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

generatePaymentLink(){
  const formValues=this.contactForm.value;
  formValues.totalCost=this.totalCost;
  formValues.transactionFee=this.transactionFee;
  formValues.merchantShare=this.merchantShare;
  formValues.flightCost=this.travelData.cost.flightCost
  formValues.hotelCost=this.travelData.cost.taxes
  formValues.taxes=this.travelData.cost.hotelCost

  this.saveUserData(formValues);
}

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



}
