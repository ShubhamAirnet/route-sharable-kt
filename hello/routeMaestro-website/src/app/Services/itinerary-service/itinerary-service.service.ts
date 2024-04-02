import { Injectable } from '@angular/core';
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
  QuerySnapshot,
  updateDoc
} from "@angular/fire/firestore";
@Injectable({
  providedIn: 'root'
})
export class ItineraryServiceService {

  constructor(private firestore:Firestore) { }

  async getAllData(responseId:string){
    const packageDocRef = doc(this.firestore, "response-itinerary", responseId);
  
    try {
      const packageDocSnapshot = await getDoc(packageDocRef);
  
      if (packageDocSnapshot.exists()) {
        const passengers = packageDocSnapshot.data();
        
        // Now 'passengers' contains an array of passenger details
        // console.log(passengers);
        return packageDocSnapshot.data()
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  }

}
