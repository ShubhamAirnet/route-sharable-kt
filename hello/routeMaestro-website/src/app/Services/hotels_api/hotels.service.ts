import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import axios from 'axios';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  Timestamp,
  setDoc,
  onSnapshot,
  DocumentData,
  QuerySnapshot
} from "@angular/fire/firestore";


@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  constructor(private http: HttpClient, private firestore:Firestore) {}

  authenticate(){
    return this.http.get("http://localhost:4000/flight/authenticate");
  }

  async updatePrimaryContact(form: any) {
    console.log("fetching");
  
    const searchDocRef = doc(this.firestore, "Demo_Itinerary", "updated_Itinerary");
  
    try {
      await setDoc(searchDocRef, { primary_details: form }, { merge: true });
      console.log("Document updated successfully!");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }

  async savePassengers(form: any) {
    console.log("fetching");
  
    const searchDocRef = doc(this.firestore, "Demo_Itinerary", "updated_Itinerary");
  
    try {
      const docSnapshot = await getDoc(searchDocRef);
  
      if (docSnapshot.exists()) {
        // If the document exists, update the passenger_details array
        const existingData = docSnapshot.data();
        let passengerDetailsArray = existingData.passenger_details || [];
  
        // Add the form object to the passenger_details array
        passengerDetailsArray.push(form);
  
        // Update the document with the modified passenger_details array
        await setDoc(searchDocRef, { passenger_details: passengerDetailsArray }, { merge: true });
  
        console.log("Document updated successfully!");
      } else {
        // If the document doesn't exist, create a new document with the passenger_details array
        await setDoc(searchDocRef, { passenger_details: [form] });
  
        console.log("Document created successfully!");
      }
    } catch (error) {
      console.error("Error updating/creating document:", error);
    }
  }


  async updatePassengers(form: any, index: number) {
    console.log("fetching");
  
    const searchDocRef = doc(this.firestore, "Demo_Itinerary", "updated_Itinerary");
  
    try {
      const docSnapshot = await getDoc(searchDocRef);
  
      if (docSnapshot.exists()) {
        // If the document exists, update the passenger_details array
        const existingData = docSnapshot.data();
        let passengerDetailsArray = existingData.passenger_details || [];
  
        // Check if the index is within bounds
        if (index >= 0 && index < passengerDetailsArray.length) {
          // Update the specific index with the form values
          passengerDetailsArray[index] = form;
  
          // Update the document with the modified passenger_details array
          await setDoc(searchDocRef, { passenger_details: passengerDetailsArray }, { merge: true });
  
          console.log("Document updated successfully!");
          return passengerDetailsArray;
        } else {
          console.error("Invalid index provided.");
        }
      } else {
        // If the document doesn't exist, create a new document with the passenger_details array
        await setDoc(searchDocRef, { passenger_details: [form] });
  
        console.log("Document created successfully!");
      }
    } catch (error) {
      console.error("Error updating/creating document:", error);
    }
  }
  
  
  

  async getAllDetails(resultCount:number,docUid:string) {
    const token=localStorage.getItem("authenticateToken")
    try {
      const {data} = await axios.post('http://localhost:4000/hotel/getIternary', { resultCount: resultCount,token:token ,docUid});
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getSearchInfo() {
    console.log("fetching");
    const searchDocRef = doc(this.firestore, "Demo_Itinerary", "updated_Itinerary");
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(
        searchDocRef,
        (data) => {
          if (data.exists()) {
            unsubscribe();
            console.log(data.data());
            resolve(data.data());
          } else {
            unsubscribe();
            console.log("data not present");
            reject("data not present");
          }
        },
        (error) => {
          unsubscribe();
          console.error("Error fetching data:", error);
          reject(error);
        }
      );
    });
  }



  // hotel cancellation

  async hotelCancellation(remarks:string){
    const payload={
      token:localStorage.getItem('authenticateToken'),
      requestType:1,
      remarks:remarks
    }
    console.log(payload)
    try{
      const {data}=await axios.post('http://localhost:4000/hotel/sendChangeRequest',payload);
      if(data){
        console.log(data)
      }
      return data
    }catch(error){
      console.log('something went wrong ',error.message)
    }
  }

  async partialHotelCancellation(remarks:string,hotelSet:any ){
    const payload={
      token:localStorage.getItem('authenticateToken'),
      requestType:1,
      remarks:remarks,
      cities:hotelSet
    }
    console.log(payload)
    try{
      const {data}=await axios.post('http://localhost:4000/hotel/getChangeRequest',payload);
      if(data){
        console.log(data)
        
      }
      return data
    }catch(error){
      console.log('something went wrong ',error.message)
    }

  }




  async hotelSearch(payload:any){
    try{
      const res = await axios.post('http://localhost:4000/hotel/hotelSearch', payload);
      return res;

    }catch(error){
      console.log(error.message)
    }
  }

  // hotel Block room
  async hotelBlockRoom(payload:any){
    console.log(payload)
    try{
      const res=await axios.post('http://localhost:4000/hotel/singleHotelBlockRoom',payload);
      console.log(res)
      return res.data;
    }catch(error){
      console.log(error.message)
    }
  }

  async singleHotelBookRoom(payload:any){
    try{
      const {data}=await axios.post('http://localhost:4000/hotel/singleHotelBookRoom',payload);
      return data;
    }catch(error){
      console.log(error.message)
    }
  }

  async hotelBookingDetails(payload:any){
    try{
      const {data}=await axios.post('http://localhost:4000/hotel/getBookingDetails',payload);
      return data;
    }catch(error){
      console.log(error.message)
    }
  }
}
