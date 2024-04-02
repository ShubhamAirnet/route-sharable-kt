import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  addingUser(
    uid: any,
    name: string,
    contact: string,
    companyName: string,
    gst: any,
    pan: any,
    address: any
  ) {
    const userDetails = {
      name,
      contact,
      companyName,
      gst,
      pan,
      address,
    };

    const docRef = this.firestore.collection('users').doc(uid);

    docRef
      .set(userDetails)
      .then(() => {
        console.log('document name', uid);
      })
      .catch((err) => {
        console.error(err, 'Error aa rha hai');
      });
  }
}
