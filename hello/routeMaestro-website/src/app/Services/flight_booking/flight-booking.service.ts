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
export class FlightBookingService {

  constructor(private firestore:Firestore) { }

  
  async  createNewPackage(airlineLogos: any, segments: any,journeyType:number,tripData:any,isLCC:boolean) {
    console.log('creating');
  console.log(airlineLogos);
  console.log(segments);
  console.log(journeyType);

  const packageDocRef = collection(this.firestore, 'flight_bookings');

  try {
    const transformedForm = segments.map((trip) => {
      const tripObject = {};

      // Assign each object in the inner array to a trip property
      trip.forEach((obj, index) => {
        tripObject[`trip${index + 1}`] = obj;
      });

      return tripObject;
    });
    const transformedLogos = airlineLogos.map((trip) => {
      const Logo = {};

      // Assign each object in the inner array to a trip property
      trip.forEach((obj, index) => {
        Logo[`trip${index + 1}`] = obj;
      });

      return Logo;
    });
    const newDocRef = await addDoc(packageDocRef, {
      flight_details: {
        airlineLogos: transformedLogos,
        segments: transformedForm,
        journeyType: journeyType,
        isLCC:isLCC
      },

      trip: {
       tripData
      },
      // Add other properties as needed
    });

    console.log('Document written with ID: ', newDocRef.id);
    // You can return the ID of the newly created document if needed
    return newDocRef.id;
  } catch (error) {
    console.error('Error creating document: ', error);
    throw error; // Handle the error appropriately
  }
}
   async  createNewRoundTripPackage(airlineLogos1: any, segments1: any,airlineLogos2:any,segments2:any,journeyType:number,tripData:any,isLCC1:boolean,isLCC2:boolean) {
    console.log('creating')
    console.log(airlineLogos1)
    console.log(segments1)
    console.log(airlineLogos2)
    console.log(segments2)
    console.log(journeyType)

    const packageDocRef = collection(this.firestore, "flight_bookings");
  
    try {
      const transformedForm1 = segments1.map(trip => {
        const tripObject = {};

        // Assign each object in the inner array to a trip property
        trip.forEach((obj, index) => {
            tripObject[`trip${index + 1}`] = obj;
        });
     

        return tripObject;
    });
    const transformedForm2 = segments2.map(trip => {
      const tripObject = {};

      // Assign each object in the inner array to a trip property
      trip.forEach((obj, index) => {
          tripObject[`trip${index + 1}`] = obj;
      });
      return tripObject;
    });
    const transformedLogos1 = airlineLogos1.map(trip => {
      const Logo = {};

      // Assign each object in the inner array to a trip property
      trip.forEach((obj, index) => {
          Logo[`trip${index + 1}`] = obj;
      });

      return Logo;
  });
  const transformedLogos2 = airlineLogos2.map(trip => {
    const Logo = {};

    // Assign each object in the inner array to a trip property
    trip.forEach((obj, index) => {
        Logo[`trip${index + 1}`] = obj;
    });

    return Logo;
});
      const newDocRef = await addDoc(packageDocRef, {
        flight_details: {
          airlineLogos1: transformedLogos1,
          segments1: transformedForm1,
          airlineLogos2:transformedLogos2,
          segments2:transformedForm2,
          journeyType:journeyType,
          isLCC1:isLCC1,
          isLCC2:isLCC2
        },
        trip: {
         tripData:tripData
        },
        // Add other properties as needed
      
        // Add other properties as needed
      });
  
      console.log("Document written with ID: ", newDocRef.id);
      // You can return the ID of the newly created document if needed
      return newDocRef.id;
    } catch (error) {
      console.error("Error creating document: ", error);
      throw error; // Handle the error appropriately
    }
  }

 
   async saveFareQuote(payload: any,uid:string,source:number) {
    console.log(payload)
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
    try {
      const packageDocSnapshot = await getDoc(packageDocRef);
  
      if (packageDocSnapshot.exists()) {
        // Update the document with the fare quote payload
        await updateDoc(packageDocRef, {
          fareQuote: payload,
          source:source

        });
  
        console.log("Fare quote saved successfully");
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error getting/updating document:", error);
    }
  }
   async saveFareQuote1(payload: any,uid:string,source:number) {
    console.log(payload)
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
    try {
      const packageDocSnapshot = await getDoc(packageDocRef);
  
      if (packageDocSnapshot.exists()) {
        // Update the document with the fare quote payload
        await updateDoc(packageDocRef, {
          fareQuote1: payload,
          source1:source
        });
  
        console.log("Fare quote saved successfully");
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error getting/updating document:", error);
    }
  }
   async saveFareQuote2(payload: any,uid:string,source:number) {
    console.log(payload)
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
    try {
      const packageDocSnapshot = await getDoc(packageDocRef);
  
      if (packageDocSnapshot.exists()) {
        // Update the document with the fare quote payload
        await updateDoc(packageDocRef, {
          fareQuote2: payload,
          source2:source
        });
  
        console.log("Fare quote saved successfully");
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error getting/updating document:", error);
    }
  }

  async  getFareQuote(uid:string) {
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
    try {
      const packageDocSnapshot = await getDoc(packageDocRef);
  
      if (packageDocSnapshot.exists()) {
        // Check if the fareQuote field exists in the document
        if (packageDocSnapshot.data().fareQuote) {
          const fareQuote = packageDocSnapshot.data().fareQuote;
          console.log("Fare quote retrieved successfully:", fareQuote);
          return fareQuote;
        } else {
          console.log("Fare quote does not exist in the document");
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
  async  getFareQuote1(uid:string) {
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
    try {
      const packageDocSnapshot = await getDoc(packageDocRef);
  
      if (packageDocSnapshot.exists()) {
        // Check if the fareQuote field exists in the document
        if (packageDocSnapshot.data().fareQuote1) {
          const fareQuote = packageDocSnapshot.data().fareQuote1;
          console.log("Fare quote retrieved successfully:", fareQuote);
          return fareQuote;
        } else {
          console.log("Fare quote does not exist in the document");
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
  async  getFareQuote2(uid:string) {
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
    try {
      const packageDocSnapshot = await getDoc(packageDocRef);
  
      if (packageDocSnapshot.exists()) {
        // Check if the fareQuote field exists in the document
        if (packageDocSnapshot.data().fareQuote2) {
          const fareQuote = packageDocSnapshot.data().fareQuote2;
          console.log("Fare quote retrieved successfully:", fareQuote);
          return fareQuote;
        } else {
          console.log("Fare quote does not exist in the document");
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

  async getFlightDetails(uid: string) {
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
    try {
      const packageDocSnapshot = await getDoc(packageDocRef);
  
      if (packageDocSnapshot.exists()) {
        // Check if the flight_details field exists in the document
        if (packageDocSnapshot.data().flight_details) {
          const flightDetails = packageDocSnapshot.data().flight_details;
  
          // Reverse the transformation for airlineLogos
          if(flightDetails.journeyType!==2){
            const transformedLogos = flightDetails.airlineLogos.map(logo => {
              const logoArray = [];
    
              for (const key in logo) {
                if (logo.hasOwnProperty(key)) {
                  logoArray[parseInt(key.substr(4)) - 1] = logo[key];
                }
              }
    
              return logoArray;
            });
    
            // Reverse the transformation for segments
            const transformedSegments = flightDetails.segments.map(segment => {
              const segmentArray = [];
    
              for (const key in segment) {
                if (segment.hasOwnProperty(key)) {
                  segmentArray[parseInt(key.substr(4)) - 1] = segment[key];
                }
              }
    
              return segmentArray;
            });
    
            const reconstructedFlightDetails = {
              airlineLogos: transformedLogos,
              segments: transformedSegments,
              journeyType: flightDetails.journeyType
            };
    
            console.log("Flight details retrieved successfully:", reconstructedFlightDetails);
            return reconstructedFlightDetails;
          }else{
            const transformedLogos1 = flightDetails.airlineLogos1.map(logo => {
              const logoArray = [];
    
              for (const key in logo) {
                if (logo.hasOwnProperty(key)) {
                  logoArray[parseInt(key.substr(4)) - 1] = logo[key];
                }
              }
    
              return logoArray;
            });
            const transformedLogos2 = flightDetails.airlineLogos2.map(logo => {
              const logoArray = [];
    
              for (const key in logo) {
                if (logo.hasOwnProperty(key)) {
                  logoArray[parseInt(key.substr(4)) - 1] = logo[key];
                }
              }
    
              return logoArray;
            });
    
            // Reverse the transformation for segments
            const transformedSegments1 = flightDetails.segments1.map(segment => {
              const segmentArray = [];
    
              for (const key in segment) {
                if (segment.hasOwnProperty(key)) {
                  segmentArray[parseInt(key.substr(4)) - 1] = segment[key];
                }
              }
    
              return segmentArray;
            });
            const transformedSegments2 = flightDetails.segments2.map(segment => {
              const segmentArray = [];
    
              for (const key in segment) {
                if (segment.hasOwnProperty(key)) {
                  segmentArray[parseInt(key.substr(4)) - 1] = segment[key];
                }
              }
    
              return segmentArray;
            });
    
            const reconstructedFlightDetails = {
              airlineLogos1: transformedLogos1,
              airlineLogos2: transformedLogos2,
              segments1: transformedSegments1,
              segments2: transformedSegments2,
              journeyType: flightDetails.journeyType
            };
    
            console.log("Flight details retrieved successfully:", reconstructedFlightDetails);
            return reconstructedFlightDetails;
          }
        } else {
          console.log("Flight details do not exist in the document");
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


  async getTripDetails(uid: string) {
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
    try {
      const packageDocSnapshot = await getDoc(packageDocRef);
  
      if (packageDocSnapshot.exists()) {
        // Check if the flight_details field exists in the document
        if (packageDocSnapshot.data().trip) {
          const tripDetails = packageDocSnapshot.data().trip;
  
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
  async getPrimaryDetails(uid: string) {
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
    try {
      const packageDocSnapshot = await getDoc(packageDocRef);
  
      if (packageDocSnapshot.exists()) {
        // Check if the flight_details field exists in the document
        if (packageDocSnapshot.data().primary_details) {
          const tripDetails = packageDocSnapshot.data().primary_details;
  
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
  async getAllDetails(uid: string) {
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
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

  async savePassengerDetails(form: any,uid:string) {
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
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
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
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
  
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
    try {
      await setDoc(packageDocRef, { primary_details: form }, { merge: true });
      console.log("Document updated successfully!");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }


  async savePerPassengerData(form: any, index: number,uid:string) {
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
  
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
  async updateReissuePackage(airlineLogos: any, segments: any, tripData: any, isLCC: boolean, uid: string) {
    try {
      const packageDocRef = doc(this.firestore, "flight_bookings", uid);
      const packageDocSnapshot = await getDoc(packageDocRef);
  
      if (packageDocSnapshot.exists()) {
        const existingData = packageDocSnapshot.data();
  
        const transformedForm = segments.map((trip) => {
          const tripObject = {};
          trip.forEach((obj, index) => {
            tripObject[`trip${index + 1}`] = obj;
          });
          return tripObject;
        });
  
        const transformedLogos = airlineLogos.map((trip) => {
          const Logo = {};
          trip.forEach((obj, index) => {
            Logo[`trip${index + 1}`] = obj;
          });
          return Logo;
        });
  
        await updateDoc(packageDocRef, {
          flight_details: {
            ...existingData.flight_details, // Retain existing flight_details data
            airlineLogos: transformedLogos,
            segments: transformedForm,
            isLCC: isLCC
          },
          trip: {
            ...existingData.trip, // Retain existing trip data
            tripData: tripData
          } 
        });
  
        console.log("Document successfully updated!");
      } else {
        console.log("Document does not exist!");
        // Handle the case where the document does not exist
      }
    } catch (error) {
      console.error('Error updating document: ', error);
      throw error; // Handle the error appropriately
    }
  }
  
  
  async storeTransactId(uid:string,transactUid:string){
    const packageDocRef = doc(this.firestore, "flight_bookings", uid);
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

  async  getAllFlightBookings() {
    const packageDocRef = collection(this.firestore, 'flight_bookings');
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
