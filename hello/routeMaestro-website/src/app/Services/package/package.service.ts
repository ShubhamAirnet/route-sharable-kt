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
  QuerySnapshot,
  updateDoc,
  addDoc
} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(private firestore:Firestore) { }

  async updateFlightDetails(form: any[][]) {
    try {
        const packageDocRef = doc(this.firestore, "package_data", "QNHo0JCIB4bDXBSNqKo9");

        // Transform the form array into the desired structure
        const transformedForm = form.map(trip => {
            const tripObject = {};

            // Assign each object in the inner array to a trip property
            trip.forEach((obj, index) => {
                tripObject[`trip${index + 1}`] = obj;
            });

            return tripObject;
        });

        // Get the existing document data
        const packageDocSnapshot = await getDoc(packageDocRef);

        // Check if 'flight_details' field exists in the document
        if (packageDocSnapshot.exists() && packageDocSnapshot.data()?.flight_details) {
            // Update the 'segments' property within the existing 'flight_details' object
            await setDoc(packageDocRef, { 'flight_details': { 'segments': transformedForm } }, { merge: true });
        } else {
            // If 'flight_details' doesn't exist or the entire field is absent, create it
            await setDoc(packageDocRef, { 'flight_details': { 'segments': transformedForm } }, { merge: true });
        }

        console.log("Flight details updated successfully!");
    } catch (error) {
        console.error("Error updating flight details:", error);
        throw error;
    }
}
  async updateHotelDetails(form: any[][]) {
    try {
        const packageDocRef = doc(this.firestore, "package_data", "QNHo0JCIB4bDXBSNqKo9");

        // Transform the form array into the desired structure
        const transformedForm = form.map(trip => {
            const tripObject = {};

            // Assign each object in the inner array to a trip property
            trip.forEach((obj, index) => {
                tripObject[`trip${index + 1}`] = obj;
            });

            return tripObject;
        });

        // Get the existing document data
        const packageDocSnapshot = await getDoc(packageDocRef);

        // Check if 'flight_details' field exists in the document
        if (packageDocSnapshot.exists() && packageDocSnapshot.data()?.flight_details) {
            // Update the 'segments' property within the existing 'flight_details' object
            await setDoc(packageDocRef, { 'hotel_details': { 'segments': transformedForm } }, { merge: true });
        } else {
            // If 'flight_details' doesn't exist or the entire field is absent, create it
            await setDoc(packageDocRef, { 'flight_details': { 'segments': transformedForm } }, { merge: true });
        }

        console.log("Flight details updated successfully!");
    } catch (error) {
        console.error("Error updating flight details:", error);
        throw error;
    }
}



async getPassengerDetails() {
    const packageDocRef = doc(this.firestore, "package_data", "QNHo0JCIB4bDXBSNqKo9");
  
    try {
      const packageDocSnapshot = await getDoc(packageDocRef);
  
      if (packageDocSnapshot.exists()) {
        const passengers = packageDocSnapshot.data().passengers;
        
        // Now 'passengers' contains an array of passenger details
        console.log(passengers);
        return packageDocSnapshot.data()
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  }

  async savePassengerDetails(form: any,uid:string) {
    const packageDocRef = doc(this.firestore, "package_data", uid);
  
    try {
      // Fetch the existing data from the document
      const packageDocSnapshot = await getDoc(packageDocRef);
      
      if (packageDocSnapshot.exists()) {
        // Get the existing data
        const existingData = packageDocSnapshot.data();
  
        // Update the 'passengers' field with the new array of passengers
        const updatedData = {
          ...existingData,
          passengers: form,
        };
  
        // Save the updated data back to the document
        await updateDoc(packageDocRef, updatedData);
  
        console.log("Passenger details saved successfully");
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }
  async updatePassengerDetails(form: any,index:number,uid:string) {
    const packageDocRef = doc(this.firestore, "package_data", uid);
  
    try {
        const docSnapshot = await getDoc(packageDocRef);
    
        if (docSnapshot.exists()) {
          // If the document exists, update the passenger_details array
          const existingData = docSnapshot.data();
          let passengerDetailsArray = existingData.passengers || [];
    
          // Check if the index is within bounds
          if (index >= 0 && index < passengerDetailsArray.length) {
            // Update the specific index with the form values
            passengerDetailsArray[index] = form;
    
            // Update the document with the modified passenger_details array
            await setDoc(packageDocRef, { passengers: passengerDetailsArray }, { merge: true });
    
            console.log("Document updated successfully!");
            return passengerDetailsArray;
          } else {
            console.error("Invalid index provided.");
          }
        } else {
          // If the document doesn't exist, create a new document with the passenger_details array
          await setDoc(packageDocRef, { passenger_details: [form] });
    
          console.log("Document created successfully!");
        }
      } catch (error) {
        console.error("Error updating/creating document:", error);
      }
  }

  async updatePrimaryContact(form: any,uid:string) {
    console.log("fetching");
  
    const packageDocRef = doc(this.firestore, "package_data", uid);
  
    try {
      await setDoc(packageDocRef, { primary_details: form }, { merge: true });
      console.log("Document updated successfully!");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }


  async savePerPassengerData(form: any, index: number,uid:string) {
    const packageDocRef = doc(this.firestore, "package_data", uid);
  
    try {
      // Fetch the existing data from the document
      const packageDocSnapshot = await getDoc(packageDocRef);
  
      if (packageDocSnapshot.exists()) {
        // Get the existing data
        const existingData = packageDocSnapshot.data();
  
        // Check if the "passengers" array exists in the existing data
        const existingPassengers = existingData.passengers || [];
  
        // Resize the array if needed
        while (existingPassengers.length <= index) {
          existingPassengers.push(null); // Add null or default values as needed
        }
  
        // Update the specific index with the form values
        existingPassengers[index] = form;
  
        // Update the 'passengers' field with the modified array
        const updatedData = {
          ...existingData,
          passengers: existingPassengers,
        };
  
        // Save the updated data back to the document
        await updateDoc(packageDocRef, updatedData);
  
        console.log("Passenger details saved successfully");
        return updatedData;
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }
  

  async getAllData(uid:string){
    const packageDocRef = doc(this.firestore, "package_data", uid);
  
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
  
  async getCsvData(){
    try{
      const res = await fetch('http://localhost:4000/hotel/getCsvData');
      // const csvData = await res.text();
      if(res){
        return res;
      }
    }catch(error){
      console.log(error.message)
    }
   }
  
   async updateCityId(jsonData:any,responseId:string){
    try{
      const {data}=await axios.post('http://localhost:4000/hotel/updateCityId',{jsonData:jsonData,responseId:responseId});
      if(data){
        return data;
  
      }
    }catch(error){
      console.log(error.message)
    }
   }

   async  getAllPackageBookings() {
    const packageDocRef = collection(this.firestore, 'response-itinerary');
    try {
      const querySnapshot = await getDocs(packageDocRef);
    
      // Array to store all flight booking documents
      const flightBookings = [];
    
      // Iterate over each document in the querySnapshot
      querySnapshot.forEach((doc) => {
        // Access the data of each document using doc.data()
        const data = doc.data();
        // Push the data into the flightBookings array
        flightBookings.push({...data,id:doc.id});
      });
  
      // Return the array of flight booking documents
      return flightBookings;
    } catch (error) {
      console.error('Error fetching flight bookings:', error);
      // If an error occurs, return an empty array
      return [];
    }
  }


  async  updateStatus(uid: string, status: string) {
    const packageDocRef = doc(this.firestore, "package_data", uid);

    try {
        const packageDocSnapshot = await getDoc(packageDocRef);

        if (packageDocSnapshot.exists()) {
            const packageDocData = packageDocSnapshot.data();

            if (!packageDocData.status) {
                // If 'status' field doesn't exist, create it
                const newData = { ...packageDocData, status: { acknowledged: status } };
                await setDoc(packageDocRef, newData);
            } else {
                // If 'status' field already exists, update its value
                const newData = { ...packageDocData, status: { ...packageDocData.status, acknowledged: status } };
                await setDoc(packageDocRef, newData);
            }
            console.log("Document updated successfully");
        } else {
            console.log("Document does not exist");
        }
    } catch (error) {
        console.log(error.message);
    }
  }
  
}
