import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { PlansService } from "src/app/Services/plans/plans.service";
import { PlanCheckoutService } from "src/app/Services/plan_checkout/plan-checkout.service";
import { ActivatedRoute } from '@angular/router';
import { Cashfree, load } from '@cashfreepayments/cashfree-js';
import axios from 'axios'
import { cashfree } from "../checkout/util";
import { AuthService } from "src/app/Services/auth.service";
import { UserModel } from "src/app/model/user-model";


@Component({
  selector: "app-pricing",
  templateUrl: "./pricing.component.html",
  styleUrls: ["./pricing.component.scss"],
  animations: [
    trigger("fadeInOut", [
      state(
        "void",
        style({
          opacity: 0,
          height: "0px",
        })
      ),
      transition("void <=> *", animate(300)),
    ]),
  ],
})
export class PricingComponent implements OnInit {
  loading: boolean = false;
  sessionId: string = '';
  version: string = ''; // Initializing version
  isSessionId: string = '';
  user: any | null = null;
  uid:string=''
  
  
  constructor(private plansCheckoutService:PlanCheckoutService ,private router: Router,private planService:PlansService,private route: ActivatedRoute,private authService: AuthService) {
    this.initializeCashfree();
  }


  
 
  navigationToCheckout(value: string) {

    
    console.log(value)
    this.router.navigate([`/Checkout/${value}`]);

    // let price:number;

    // console.log(event);
    // if(event.target.value==='basic'){
    //  price=5500
    // }
    // else if(event.target.value==='pro'){
    //   price=10500;
    // }
    // const packageSelected={
    //   package:event.target.value,  
    //   price
    // }

    this.plansCheckoutService.makingPayment("free");
    // this.planService.buyPlan(event.target.value);


    // this.router.navigate(["/Checkout",packageSelected]);
  }

  

  navigationToCashfree(value: string): void {
    console.log('Clicked Buy Now with value:', value);
    this.getSessionId(value); // Pass the value to initializeCashfree
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
      const res = await axios.post('http://localhost:4000/api/payment', { version: this.version,value:value });
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
  

  // Use properties to track the visibility of the answer
  isAnswerVisible1 = false;
  isAnswerVisible2 = false;
  isAnswerVisible3 = false;

  // Toggle the visibility of the answer
  toggleAnswer1() {
    this.isAnswerVisible1 = !this.isAnswerVisible1;
  } 
  toggleAnswer2() {
    this.isAnswerVisible2 = !this.isAnswerVisible2;
  }
   toggleAnswer3() {
    this.isAnswerVisible3 = !this.isAnswerVisible3;
  }

  ngOnInit(): void {
    this.fetchUserId()
    
  }

 
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
  
      if (userDetails !== undefined && userDetails !== null) {
        this.user = userDetails;
        console.log(this.user);
      } else {
        console.log("User details not found");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }
  
  

}
