import { Component, OnInit } from '@angular/core';
import { TransactionsService } from 'src/app/Services/transactions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {

 

  constructor(
    private router: Router,private transact:TransactionsService ) { }

  ngOnInit(): void {
    // Initialize the form group with form controls
    
  }

  // Function to handle form submission

  onSubmit(formDirective) {
    console.log('submit')
    
      if(formDirective){
        // Your form submission logic goes here
      const formValues = formDirective.value;
  
      // Calculate transactionFee (1.75% of the total sum)
      const totalSum = formValues.flightCost + formValues.hotelCost + formValues.merchantShare + formValues.taxes;
      const transactionFee = 0.0175 * totalSum;
  
      // Add transactionFee to form values
      formValues.transactionFee = transactionFee;
      formValues.totalCost=totalSum;
  
      // Log the updated form values
      console.log(formValues);

      this.saveUserDetails(formValues);
      }
  
    
  }
  
  async saveUserDetails(formValues:any){
    console.log('saving')
    try{
      const res=await this.transact.saveUserPaymentDetails(formValues);
      console.log(res)
     // Assuming 'this.router' is an instance of the Angular Router service
      this.router.navigate([`/user-view/${res}`,  ]);




    }catch(error){
      console.log(error)
    }
  }

}
