import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import axios from "axios";
import { cashfree } from "./util";
import { Cashfree, load } from '@cashfreepayments/cashfree-js';
import { AuthService } from "src/app/Services/auth.service";
import { UserModel } from "src/app/model/user-model";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  value:string;
  loading: boolean = false;
  sessionId: string = '';
  version: string = ''; // Initializing version
  isSessionId: string = '';
  plan: string =''
  total:string=''
  licenseTotal:string=''
  uid:string='';
  user: any | null = null;
  alreadyUser: boolean =false;


  


  
  constructor(private route: ActivatedRoute,private authService: AuthService) {
    
  }
 

  ngOnInit(): void {
    this.value = this.route.snapshot.paramMap.get('id');
    console.log(this.value)
    this.plan=this.value === '0' ? 'free' : this.value === '8500' ? 'basic' : this.value === '10500'? 'pro': '';
    this.total=this.value;
    this.calculateTotal();
    this.fetchUserId();
    
  }
  quantity: number = 0;

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
      this.calculateTotal();
    }
  }

  increaseQuantity() {
    // You might want to set a maximum limit if needed
    this.quantity++;
    this.calculateTotal();
  }

  calculateTotal(): void {
    // Update the total based on the quantity
    this.total = (Number(this.value) + this.quantity * 1000).toString();
    this.licenseTotal = (this.quantity * 1000).toString();
  }
  logAlreadyUserValue() {
    console.log("alreadyUser:", this.alreadyUser);
  }

  // registerUser(form: any): void {
  //   // let formValues = { ...form.value };
  //   delete this.errorMsg;
  //   this.loader = true;
  //   let formValues: {  name: string; email: string; password: string } = Object.assign({}, form.value);
  //   this.authService.registerUser(formValues)
  //     .then(() => this.loader = false)
  //     .catch((error) => {
  //       this.loader = false;
  //       this.errorMsg = error;
  //       setTimeout(() => delete this.errorMsg, 5000)
  //     });
  // }
    
    
  

 
  async fetchUserId() {
    console.log("user uid")
    await this.authService.getUserUid().then((userDetails) => {
      this.uid = userDetails;
      console.log(this.uid);
      console.log(userDetails);
    });
    await this.fetchUserDetails();
  }
  async fetchUserDetails(): Promise<void> {
    console.log("fetching");
    console.log(this.uid);
    try {
      console.log("hello");
  
      const userDetails = await this.authService.getUserDetailsFromFirestore(this.uid);
      console.log("hello");
  
      console.log(userDetails);
      if (userDetails !== null && userDetails !== undefined) {
        this.user = userDetails;
        console.log(this.user);
      } else {
        console.log("User details not found");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }
  

  navigationToCashfree(): void {
    console.log('Clicked Buy Now with value:', this.total);
    this.getSessionId(this.total); // Pass the value to initializeCashfree
  }
 
  
  async initializeCashfree(): Promise<void>  {
    try {
      const cashfree: Cashfree = await load({ mode: 'sandbox' }); // Adjust the initialization based on the actual structure of your Cashfree library
      this.version = cashfree.version(); // Assuming a default version
    } catch (error) {
      console.error('Error initializing Cashfree:', error);
    }
  }

  async getSessionId(value: string): Promise<void> {
    this.loading = true;
    try {
      const res = await axios.post('http://localhost:4000/createOrder', { version: this.version,value:value });
      this.loading = false;
      this.sessionId = res.data;
      if(res.data.success){
        // const redirectUrl = res.data.data.payments.url;
        // window.location.href = redirectUrl;
        // console.log(res.data.data)
        const sessionId=res.data.data.payment_session_id
        this.handlePayment(sessionId)
      }
    } catch (err) {
      this.loading = false;
      console.error('Error fetching sessionId:', err);
    }
  }
  handlePayment(sessionId:string): void {
    const checkoutOptions = {
      paymentSessionId: sessionId,
      returnUrl: 'http://localhost:4200/success',
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
  


 

  

}
