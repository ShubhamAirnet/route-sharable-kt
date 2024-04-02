import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { Cashfree, load } from '@cashfreepayments/cashfree-js';
import { cashfree } from "./util";
import { TransactionsService } from 'src/app/Services/transactions.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  form:any | null=null;
  id:any | null=null;
  name:string="shubham";
  phone:string="8978786096";
  email:string="s@123.com";
  flightCost:number=778;
  hotelCost:number=678;
  tax:number=678;
  transactionFee:number=2678;
  merchantShare:number=1678;
  taxes:number=this.tax+this.merchantShare+this.transactionFee;
  uid:number=Date.now();
  loading: boolean = false;
  version: string = ''; 
  sessionId: string = '';

  
 
  
  
  totalCost:number;
  constructor(private route: ActivatedRoute,private transact:TransactionsService) { }

  ngOnInit(): void {
    console.log('init')
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
    this.getUserData(this.id)

   
  }

  async getUserData(id:string){
    const res=await this.transact.getUserDetails(id);
    console.log(res)
    this.form=res;
    this.totalCost= this.form.flightCost+this.form.hotelCost+this.form.taxes+this.form.merchantShare;

  }
  async initializeCashfree(): Promise<void>  {
    try {
      const cashfree: Cashfree = await load({ mode: 'sandbox' }); // Adjust the initialization based on the actual structure of your Cashfree library
      this.version = cashfree.version(); // Assuming a default version
    } catch (error) {
      console.error('Error initializing Cashfree:', error);
    }
  }

  navigationToCashfree(): void {
    console.log('Clicked Buy Now with value:', this.totalCost);
    this.getSessionId(this.totalCost); // Pass the value to initializeCashfree
  }
  

  
  async getSessionId(value: number): Promise<void> {
    this.loading = true;
    console.log(value)
    try {
      const res = await axios.post('http://localhost:4000/createOrder', { version: this.version,form:this.form,cost:this.totalCost });
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
      returnUrl: `http://localhost:4200/success/${this.form.order_id}`,
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
