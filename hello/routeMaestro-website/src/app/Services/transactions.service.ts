import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
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
  addDoc,
  updateDoc
} from "@angular/fire/firestore";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  Auth,
  ConfirmationResult,
  UserCredential,
  user,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore,
    private db: Firestore,
  ) { }



  async saveUserPaymentDetails(form: any) {
    const collectionRef = collection(this.firestore, 'merchant_transactions');
  
    try {
      // Use addDoc to add a new document with an automatically generated ID
      const newDocRef = await addDoc(collectionRef, { ...form, order_id: '',status:'pending' });
  
      // Retrieve the ID of the newly created document
      const newDocId = newDocRef.id;
  
      // Update the document with the order_id attribute set to the document ID
      await setDoc(doc(collectionRef, newDocId), { ...form, order_id: newDocId,status:'pending' });
  
      console.log(`Document added with ID: ${newDocId}`);
      return newDocId;
      return newDocId;
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }



  async getUserDetails(id: string) {
    const docRef = doc(this.firestore, 'merchant_transactions', id);
  
    try {
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        // Document exists, you can access its data
        const userData = docSnap.data();
        // console.log('User Data:', userData);
        return userData;
      } else {
        // Document does not exist
        console.log('Document does not exist.');
        return null; // or handle accordingly based on your use case
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error; // Re-throw the error to handle it elsewhere if needed
    }
  }

  async updateStatus(id: string) {
    const docRef = doc(this.firestore, 'merchant_transactions', id);
  
    try {
      // Use updateDoc to update the status field to 'paid'
      await updateDoc(docRef, { status: 'paid' });
  
      console.log(`Document with ID ${id} updated successfully.`);
    } catch (error) {
      console.error('Error updating document:', error);
      throw error; // Re-throw the error to handle it elsewhere if needed
    }
  }
  
}
