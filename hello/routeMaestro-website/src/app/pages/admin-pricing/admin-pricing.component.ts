import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanCheckoutService } from 'src/app/Services/plan_checkout/plan-checkout.service';
import { PlansService } from 'src/app/Services/plans/plans.service';
import { NgZone } from '@angular/core';
@Component({
  selector: 'app-admin-pricing',
  templateUrl: './admin-pricing.component.html',
  styleUrls: ['./admin-pricing.component.scss'],
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
export class AdminPricingComponent implements OnInit {
  plans:any | null=null;
  planLayout:any | null=null;
  planLayoutKeys:any | null=null;
  pricing:any | null=null;
 
  // packages
  free:any | null=null;
  basic:any | null=null;
  pro:any | null=null;
  edit:boolean =false;
  sortedArray:any |null=null;
  editableValues: any[] = [];
  editablePricing: any = {};

 
  
// Initialize editableValues based on planLayout
initializeEditableValues() {
  console.log("initializing")
  this.editableValues = this.planLayout.map(item => ({
    heading: item.heading,
    subtitles: [...item.subtitles],
    // sr:item.sr,
    // free:item.free,
    // basic:item.basic,
    // pro:item.pro
  })); 

  console.log(this.editableValues)
 
}



  constructor(private plansCheckoutService:PlanCheckoutService ,private router: Router,private zone: NgZone,private planService:PlansService) { 
    this.fetchPlanDetails();
    this.fetchPlanLayout()
  }



  ngOnInit(): void {
    this.initializeEditableValues();
   
  }

  async removeBtn(index: number) {
    console.log('index is ', index);
    try {
      const message = await this.planService.deleteAttributefromPlan(index);
  
      // Use NgZone to run the code inside Angular's zone
      this.zone.run(() => {
        // Update the local array to reflect the changes
        this.planLayout = this.planLayout.filter((_, i) => i !== index);
        this.editableValues = this.editableValues.filter((_, i) => i !== index);
      });
  
      console.log(message); // Log success or error message
    } catch (error) {
      console.log('Error occurred:', error);
    }
  }
  
  async updatePricingValues(updatedPricing: any, updatedValues: any[]) {
    try{
      const msg=await this.planService.updatePricing(updatedPricing,updatedValues);
      console.log(msg); // Log success or error message
     
    } catch (error) {
      console.log('Error occurred:', error);
    }
  
    // Add your logic to update the pricing values and other values in Firestore or perform other actions
  }


  
  addHeadingAndSubtitles(index:number) {
    // Use NgZone to run the code inside Angular's zone
    this.zone.run(() => {
      // Add a new entry to editableValues with default values
      this.planLayout.push({ heading: '', subtitles: [''],sr:index+1 });
      this.editableValues.push({ heading: '', subtitles: [''],sr:index+1 });
    });
  }

  addSubtitle(index: number) {
    this.zone.run(() => {
      // Add a new subtitle to the specified index
      this.planLayout[index].subtitles.push('');
      this.editableValues[index].subtitles.push('');
    });
  }
  
  toggleEdit(){
    this.edit=!this.edit;
  }

  
  

  toggleEditable() {
    this.edit = !this.edit;
    console.log(this.edit)
    // If entering edit mode, initialize editableValues
    if (this.edit) {
      this.initializeEditableValues();
      this.editablePricing = { free: this.pricing.free };
    } else {
      

      this.planLayout.forEach(item => {
          if (item.free === 'custom') {
              item.free = item.freeCustomValue;
              delete item.freeCustomValue;
          }
      
          if (item.basic === 'custom') {
              item.basic = item.basicCustomValue;
              delete item.basicCustomValue;
          }
      
          if (item.pro === 'custom') {
              item.pro = item.proCustomValue;
              delete item.proCustomValue;
          }
      });
      
     
      this.updatePricingValues(this.pricing,this.planLayout)
    }
  }
  
  // fetching plan details
  async fetchPlanDetails(): Promise<void> {
    console.log("fetching");
    
    try {
      const userDetails = await this.planService.getPlanDetailsFromFirestore();
      console.log(userDetails)
      this.basic=userDetails[0];
      this.free=userDetails[1];
      this.pro=userDetails[2];

      console.log('basic', this.basic)
      console.log('free', this.free)
      console.log('pro', this.pro)
       
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }


// fetching plan layout
  async fetchPlanLayout(): Promise<void> {
    console.log("fetching");
    
    try {
      const userDetails = await this.planService.getPlanLayoutFromFirestore();
      console.log(userDetails)
  
        this.planLayout= userDetails.array;
        this.pricing= userDetails.pricing;
        console.log(this.planLayout);
        console.log(this.pricing);
       
        // sorting the values so that it will have the same order everytime
       

      
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
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

  
}
