import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import {Firestore, doc, getDoc} from "@angular/fire/firestore"
import {v4 as V4uuid} from "uuid"
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PlanCheckoutService {

  constructor(private authService:AuthService,private firestore:Firestore,private http:HttpClient) { }



  async makingPayment(planName:string){

    let customer_email:string;
    let customer_phone:number;
    let customer_name:string;
    let planRef;
    let planSnap;
    let order_amount:number;
    let order_currency:number;

    const uid=await this.authService.getUserUid();

    if(uid){

      console.log(uid);
      const userRef= doc(this.firestore,"users",`${uid}`,"user_details","details");

      const userSnap=await getDoc(userRef);

      
      if(userSnap.exists()){

        console.log(userSnap.data());

        customer_email=userSnap.data().email;
        customer_phone=userSnap.data().phone;
        customer_name=userSnap.data().name;

        if(planName==="free"){

           planRef=doc (this.firestore,"Plans","free");

           planSnap= await getDoc(planRef);

           if(planSnap.exists()){

            console.log(planSnap.data());

            order_amount=planSnap.data().price;
            order_currency=planSnap.data().currency;

            const uuid=V4uuid();


            const payload={
              order_id:uuid,
              order_amount :2000,
              order_currency,
              customer_email,
              customer_name,
              customer_phone,
              return_url:"http://localhost:4200/pricing"

            }
            console.log(payload);
            this.http.post("http://localhost:4000/createOrder",payload)

           }

        }


      }
      else {

        console.log("error fetching details");
      }

    }


  }
}
