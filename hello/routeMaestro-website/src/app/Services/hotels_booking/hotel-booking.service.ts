import { Injectable } from '@angular/core';
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
export class HotelBookingService {

  constructor(private firestore:Firestore) { }

  async  createNewPackage(rooms: any,checkInDate:string,checkOutDate:string, hotelName: string,resultIndex:number,hotelCode:string,cityName:string,country:string,roomGuests:any,nationality:string,countryCode:string,cityId:string,hotelInfo:any) {
    console.log('creating');
  console.log(rooms);
  console.log(hotelName);
  console.log(checkInDate);
  console.log(checkOutDate);

  console.log(cityName);
  console.log(country);
  console.log(roomGuests);
  console.log(resultIndex);
  console.log(hotelCode);

  const packageDocRef = collection(this.firestore, 'hotel_bookings');

  try {
    const dataToBeAdded = {
      hotel_details: {
        rooms: rooms,
        hotelCode: hotelCode,
        hotelName: hotelName,
        resultIndex: resultIndex
      },
      hotelInfo:hotelInfo,
      trip: {
        roomGuests: roomGuests,
        noOfRooms: rooms.length,
        cityName: cityName,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        country: country,
        nationality:nationality,
        countryCode:countryCode,
        cityId:cityId
      },
      // Add other properties as needed
    };

    console.log('Data to be added:', dataToBeAdded);

    const newDocRef = await addDoc(packageDocRef, dataToBeAdded);

    console.log('Document written with ID: ', newDocRef.id);
    // You can return the ID of the newly created document if needed
    return newDocRef.id;
  } catch (error) {
    console.error('Error creating document: ', error);
    throw error; // Handle the error appropriately
  }
}

async getRoomData(uid:string){
  const packageDocRef = doc(this.firestore, "hotel_bookings", uid);
  
  try {
    const packageDocSnapshot = await getDoc(packageDocRef);

    if (packageDocSnapshot.exists()) {
      // Check if the flight_details field exists in the document
      if (packageDocSnapshot.data()) {
        const tripDetails = packageDocSnapshot.data();

        // Reverse the transformation for airlineLogos
       return tripDetails;
      } else {
        console.log("trip details do not exist in the document");
        return null;
      }
    } else {
      console.log("Document does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}

async updatePrimaryContact(form: any,uid:string) {
  console.log("fetching");

  const packageDocRef = doc(this.firestore, "hotel_bookings", uid);

  try {
    await setDoc(packageDocRef, { primary_details: form }, { merge: true });
    console.log("Document updated successfully!");
  } catch (error) {
    console.error("Error updating document:", error);
  }
}


async updateRoomDetails(rooms: any, uid: string,IsVoucherBooking:boolean) {
  const packageDocRef = doc(this.firestore, "hotel_bookings", uid);

  try {
    const packageDocSnapshot = await getDoc(packageDocRef);

    if (packageDocSnapshot.exists()) {
      // Check if the hotel_details field exists in the document
      if (packageDocSnapshot.data().hotel_details) {
        const hotelDetails = packageDocSnapshot.data().hotel_details;
        if(!IsVoucherBooking){
          hotelDetails.status="hold"
        }
        
        // Update the rooms details
        hotelDetails.rooms.forEach((item: any, index: number) => {
          if (rooms[index] && rooms[index].updatedRoom) {
            item.room = rooms[index].updatedRoom;
          }
        });

        // Update the document with the modified hotel details
        await updateDoc(packageDocRef, { hotel_details: hotelDetails });
        
        console.log("Document updated successfully!");
      } else {
        console.log("hotel_details field does not exist in the document.");
      }
    } else {
      console.log("Document does not exist.");
    }
  } catch (error) {
    console.error("Error updating document:", error);
  }
}
async savePerPassengerData(form: any, index: number,uid:string) {
  const packageDocRef = doc(this.firestore, "hotel_bookings", uid);

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

async updatePassengerDetails(form: any,index:number,uid:string) {
  const packageDocRef = doc(this.firestore, "hotel_bookings", uid);

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

async getAllDetails(uid: string) {
  const packageDocRef = doc(this.firestore, "hotel_bookings", uid);

  try {
    const packageDocSnapshot = await getDoc(packageDocRef);

    if (packageDocSnapshot.exists()) {
      // Check if the flight_details field exists in the document
      if (packageDocSnapshot.data()) {
        const tripDetails = packageDocSnapshot.data();

        // Reverse the transformation for airlineLogos
       return tripDetails;
      } else {
        console.log("trip details do not exist in the document");
        return null;
      }
    } else {
      console.log("Document does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}

async storeTransportData(uid:string,data:any){
  const packageDocRef = doc(this.firestore, "hotel_bookings", uid);

  try {
 
    const packageDocSnapshot = await getDoc(packageDocRef);

    if (packageDocSnapshot.exists()) {

      const existingData = packageDocSnapshot.data();

     
      const updatedData = {
        ...existingData,
        transportData:data
       
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


async storeTransactId(uid:string,transactUid:string){
  const packageDocRef = doc(this.firestore, "hotel_bookings", uid);
  try{
    const docSnapshot = await getDoc(packageDocRef);
  
      if (docSnapshot.exists()) {
        // If the document exists, update the passenger_details array
        const existingData = docSnapshot.data();
  
        // Check if the index is within bounds
     
          // Update the document with the modified passenger_details array
          await setDoc(packageDocRef, { transactUid: transactUid }, { merge: true });
  
          console.log("Document updated successfully!");
      }

  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}

async  getAllHotelBookings() {
  const packageDocRef = collection(this.firestore, 'hotel_bookings');
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

}
