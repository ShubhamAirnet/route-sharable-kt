import { Injectable } from "@angular/core";
import { Firestore, doc, setDoc, Timestamp } from "@angular/fire/firestore";
import { AuthService } from "../auth.service";
import { DocumentData, collection, getDoc, onSnapshot } from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class PlansService {
  constructor(private firestore: Firestore, private authService: AuthService) {}


  async buyPlan(planName: string) {
    const uid = await this.authService.getUserUid();
    console.log(uid);

    let planRef;

    if (planName === "free") {
      planRef = "/Plans/free";
    } else if (planName === "basic") {
      planRef = "/Plans/basic";
    } else if (planName === "pro") {
      planRef = "/Plans/pro";
    }

    if (uid) {
      const start_date = Timestamp.now();
      const currentDate = start_date.toDate();
      // Increment the timestamp by 30 days
      const end_date = new Date(currentDate);
      end_date.setDate(currentDate.getDate() + 30);

      console.log(end_date);

      const payload = {
        start_date,
        end_date,
        planRef,
        status: "active",
      };

      let docRef = doc(this.firestore, "users", `${uid}`, "plan", "details");

      await setDoc(docRef, payload);


     
    }
  }
  
  async getPlanDetailsFromFirestore(): Promise<DocumentData | null> {
    // Initialize Firestore
    const planCollection = collection(this.firestore, 'Plans');
  
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(planCollection, (snapshot) => {
        const planData: DocumentData[] = [];
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' || change.type === 'modified') {
            const data = change.doc.data();
         
            planData.push(data);
          } else if (change.type === 'removed') {
            console.log('Plan removed');
          }
        });
        resolve(planData);
      }, (error) => {
        console.error('Error fetching plan details:', error);
        reject(null);
      });
    });
  }

  async getPlanLayoutFromFirestore(): Promise<DocumentData | null> {
    // Initialize Firestore
  
    const planDocument = doc(this.firestore, 'plan_layout', 'plan_details');

    try {
      const documentSnapshot = await getDoc(planDocument);
  
      if (documentSnapshot.exists()) {
        const planData = documentSnapshot.data();
        return planData;
        // You might want to do something with the planData here, such as updating a component state.
        // Example: this.setState({ planData });
      } else {
        console.log('Plan details not present');
      }
    } catch (error) {
      console.error('Error fetching plan details:', error);
    }
  }


  async deleteAttributefromPlan(index: number): Promise<string> {
    console.log('deleting');
    try {
      const planDoc = doc(this.firestore, 'plan_layout', 'plan_details');
      const planSnapshot = await getDoc(planDoc);
     
  
      if (planSnapshot.exists()) {
        const planData = planSnapshot.data();
  
        if (planData && Array.isArray(planData.array) && index >= 0 && index < planData.array.length) {
          // Remove the element at the specified index
          planData.array.splice(index, 1);
  
          // Update the document with the modified array
          await setDoc(planDoc, { array: planData.array }, { merge: true });
  
          return 'Item deleted successfully.';
        } else {
          return 'Invalid plan document structure or index.';
        }
      } else {
        return 'Plan document does not exist.';
      }
    } catch (error) {
      console.error('Error deleting attribute from plan:', error);
      throw error;
    }
  }


  async updatePricing(updatedPricing: any, updatedValues: any[]) {
    console.log('updating');
  
    try {
      const planDoc = doc(this.firestore, 'plan_layout', 'plan_details');
      const planSnapshot = await getDoc(planDoc);
  
      if (planSnapshot.exists()) {
        // Get the existing data from the plan_details document
        const existingData = planSnapshot.data();
  
        // Update the array field with the new values
        if (Array.isArray(existingData?.array)) {
          existingData.array = updatedValues;
        }
  
        // Update the pricing field with the new values
        if (existingData?.pricing) {
          existingData.pricing = updatedPricing;
        }
  
        // Update the document with the modified data
        await setDoc(planDoc, existingData, { merge: true });
  
        return 'Data updated successfully.';
      } else {
        console.error('Plan_details document does not exist.');
        return 'Plan_details document does not exist.';
      }
    } catch (error) {
      console.error('Error updating data in plan_details:', error);
      throw error;
    }
  }
  
}


