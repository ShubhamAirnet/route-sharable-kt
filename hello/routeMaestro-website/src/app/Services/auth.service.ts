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
  QuerySnapshot
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
import { UserModel } from "../model/user-model";
import { getuid } from "process";



@Injectable({
  providedIn: "root",
})
export class AuthService {
  userModel: UserModel | null = null;
  phoneNumber: any;
  reCaptchaVerifier!: any;
  confirmationResult!: ConfirmationResult;
  user: any;
  isLoggedIn = false;


  errorCodeMessages: { [key: string]: string } = {
    "auth/user-not-found": "User not found with this email address",
    "auth/wrong-password": "Wrong Password. Please enter correct password.",
    "auth/email-already-in-use":
      "Email Address already used by another user. Please use different address.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/invalid-email": "Invalid Email Address",
  };
  

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore,
    private db: Firestore,
  ) {

    onAuthStateChanged(
      auth,
      (user) => {
        if (user !== null) {
          console.log(">>> User is already signed");
          this.fetchUserDetailsFromFirestore(user.uid);
          this.getUserDetailsFromFirestore(user.uid)
        } else {
          console.log(">>> User is not sign in");
          this.userModel = null;
        }
      },
      (error) => {
        console.log(error);
      }
    );
    // this.getUserDetailsFromFirestore();

  }

  loginUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<UserCredential> {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((resp: UserCredential) => {
          this.router.navigate(["/"]);
          this.fetchUserDetailsFromFirestore(resp.user.uid);
          resolve(resp);
        })
        .catch((error) =>
          reject(
            this.errorCodeMessages[error.code] ??
              "Something went Wrong. Please Try Again..."
          )
        );
    });
  }

  registerUser({
    name,
    email,
    password,
    phone
  }: {
    name: string;
    password: string;
    email: string;
    phone:string;
  }): Promise<UserCredential> {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((resp: UserCredential) => {
          console.log(resp)
          this.router.navigate(["/"]);
          this.saveUserDetailsToFirestore({ name, email, password,phone,isAdmin:false });
          // this.saveUserToFirestore({ name, email, password, authId: resp.user.uid })
          console.log(resp.user.uid);
        })
        .catch((error) =>
          reject(
            this.errorCodeMessages[error.code] ??
              "Something went Wrong. Please Try Again..."
          )
        );
    });
  }

  // made by hemant
  async saveUserDetailsToFirestore({
    name,
    email,
    password,
    phone,
    isAdmin,
  
  }: {
    email: string;
    password: string;
    name: string;
    phone:string;
    isAdmin:boolean;
   
  }) {
    const uid = await this.getUserUid();
    console.log(uid);

    if (uid) {
      let userDetails = {
        name,
        email,
        phone,
        isAdmin,
        password,
        created_on: Timestamp.now(),
      };

      const docRef = doc(
        this.firestore,
        "users_login",
        `${uid}`,
        "user_details",
        "details"
      );
      await setDoc(docRef, userDetails);

      const userLoginDocRef = doc(this.firestore, 'users_login', `${uid}`);
    await setDoc(userLoginDocRef, { key: uid }, { merge: true });
    } else {
      console.log("User not authenticated");
    }
  }


  // register user when admin registers them
  registerUserByAdmin({
    name,
    email,
    password,
    phone
  }: {
    name: string;
    password: string;
    email: string;
    phone: string;
  }): Promise<UserCredential> {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((resp: UserCredential) => {
          const userUid = resp.user.uid;
          console.log(resp);
          
          // Save user details to Firestore with isAdmin: false
          this.saveUserDetailsToFirestoreByAdmin({ name, email, password, phone, isAdmin: false,userUid });
  
          // Note: You can choose not to redirect and log in the user immediately.
          // For demonstration, the following lines are commented out.
          // this.router.navigate(["/"]);
          // this.saveUserToFirestore({ name, email, password, authId: userUid })
  
          // Resolve with the UserCredential
          resolve(resp);
        })
        .catch((error) =>
          reject(
            this.errorCodeMessages[error.code] ??
              "Something went wrong. Please try again..."
          )
        );
    });
  }

 
async saveUserDetailsToFirestoreByAdmin({
  name,
  email,
  password,
  phone,
  isAdmin,
  userUid,
}: {
  email: string;
  password: string;
  name: string;
  phone: string;
  isAdmin: boolean;
  userUid: string;
}) {
  if (userUid) {
    let userDetails = {
      name,
      email,
      phone,
      isAdmin,
      password,
      created_on: Timestamp.now(),
    };

    const docRef = doc(
      this.firestore,
      'users_login',
      `${userUid}`,
      'user_details',
      'details'
    );

    // Set user details in 'user_details/details' document
    await setDoc(docRef, userDetails);

    // Set additional field in 'users_login' document
    const userLoginDocRef = doc(this.firestore, 'users_login', `${userUid}`);
    await setDoc(userLoginDocRef, { key: userUid }, { merge: true });
  } else {
    console.log('User not authenticated');
  }
}
  
  
async getAllUserDetails(): Promise<any[]> {
  try {
    const documents: any[] = [];

    const usersLoginCollectionRef = collection(this.firestore, 'users_login');
    const usersLoginSnapshot = await getDocs(usersLoginCollectionRef);

    // Iterate through each user document
    for (const userLoginDoc of usersLoginSnapshot.docs) {

      console.log("hello")
      console.log(userLoginDoc.data())

      // Check if 'plan_details' collection exists in the user's document
      const planDetailsCollectionRef = collection(userLoginDoc.ref, 'plan');
      const planDetailsSnapshot = await getDocs(planDetailsCollectionRef);

      // If 'plan_details' collection doesn't exist, add user details to the array
      if (planDetailsSnapshot.empty) {
        const userDetailsCollectionRef = collection(userLoginDoc.ref, 'user_details');
        const userDetailsDocRef = doc(userDetailsCollectionRef, 'details');
        const userDetailsSnapshot = await getDoc(userDetailsDocRef);

        // Check if the 'details' document exists and has data
        if (userDetailsSnapshot.exists()) {
          const userDetailsData = userDetailsSnapshot.data();
          documents.push({
            uid: userLoginDoc.id,
            userDetails: userDetailsData,
          });
        }
      }
    }

    console.log('User Details without plan_details:', documents);
    return documents;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error; // Propagate the error
  }
}

async getUserDetailsWithPlan(): Promise<any[]> {
  try {
    const documentsWithPlan: any[] = [];

    const usersLoginCollectionRef = collection(this.firestore, 'users_login');
    const usersLoginSnapshot = await getDocs(usersLoginCollectionRef);

    // Iterate through each user document
    for (const userLoginDoc of usersLoginSnapshot.docs) {
      // Check if 'plan' subcollection exists in the user's document
      const planCollectionRef = collection(userLoginDoc.ref, 'plan');
      const planDetailsDocRef = doc(planCollectionRef, 'details');
      const planDetailsSnapshot = await getDoc(planDetailsDocRef);

      // If 'plan_details' document exists, fetch user details and plan details
      if (planDetailsSnapshot.exists()) {
        const userDetailsCollectionRef = collection(userLoginDoc.ref, 'user_details');
        const userDetailsDocRef = doc(userDetailsCollectionRef, 'details');
        const userDetailsSnapshot = await getDoc(userDetailsDocRef);

        // Check if the 'details' document exists and has data
        if (userDetailsSnapshot.exists()) {
          const userDetailsData = userDetailsSnapshot.data();
          const planDetailsData = planDetailsSnapshot.data();

          documentsWithPlan.push({
            uid: userLoginDoc.id,
            userDetails: userDetailsData,
            planDetails: planDetailsData,
          });
        }
      }
    }

    console.log('User Details with plan_details:', documentsWithPlan);
    return documentsWithPlan;
  } catch (error) {
    console.error('Error fetching user details with plan_details:', error);
    throw error; // Propagate the error
  }
}

  
  // \made by hemant
  async getUserUid() {
    return new Promise<string>((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        if (user) {
          const uid = user.uid;
          unsubscribe(); // Unsubscribe to stop listening for changes once the UID is obtained
          console.log("reached auth service ")
          resolve(uid);
        } else {
          unsubscribe(); // Unsubscribe if the user is not present
          resolve(null);
        }
      });
    });
  }

  async getUserDetailsFromFirestore(uid:string) {
 

    if (uid) {
      const userDocRef = doc(
        this.firestore,
        "users_login",
        `${uid}`,
        "user_details",
        "details"
      );

      const unsubscribe = onSnapshot(userDocRef, (user) => {
        if (user.exists()) {
          // console.log(user.data());
          unsubscribe();
        
          return user.data();
        } else {
          unsubscribe();
          console.log("user details not present");
          return "user details not present";
        }
      });
    } else {
      console.log("error in getting the uid");
    }
  }


 async getUserName(uid:string){


  const userDocRef=doc(this.firestore,"users_login",`${uid}`,"user_details","details" );

  const userDocSnap=await getDoc(userDocRef);

  if(userDocSnap.exists()){

    return userDocSnap.data().name;
  }
  else{
    return "No user exists"
  }


 }










  signoutCurrentUser() {
    this.auth.signOut();
  }

  saveUserToFirestore({
    name,
    email,
    authId,
    password,
  }: {
    name: string;
    email: string;
    authId: string;
    password: string;
  }) {
    let userObj = {
      name,
      email,
      authId,
      password,
      userId: doc(collection(this.firestore, "Admin-user")).id,
      createdOn: Timestamp.now(),
      active: true,
    };
    let docRef = doc(this.firestore, `Admin-user/${userObj.userId}`);
    setDoc(docRef, { ...userObj }, { merge: true });
  }

  fetchUserDetailsFromFirestore(authId: string) {
    let queryRef = query(
      collection(this.firestore, "Admin-user"),
      where("authId", "==", authId)
    );

    const unsubscribe = onSnapshot(queryRef, (values) => {
      if (values.docs.length === 0) {
        // If user not found then there is no need snapshot
        // for viewing changes so we here unsubscribing the subscribe
        unsubscribe();
      } else {
        this.userModel = { ...(values.docs[0].data() as UserModel) };
        console.log(this.userModel);
      }
    });
  }

  listenForAuthStateChanges(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in
        this.isLoggedIn = true;
      } else {
        // User is signed out
        this.isLoggedIn = false;
      }
    });
  }

  async loginWithPhoneNumber(phoneNumber: string): Promise<any> {
    // try {

    const docRef = doc(this.db, "numbers", "numbers");
    const phoneNumbersList: string[] =
      ((await getDoc(docRef)).data() ?? {})["phoneNumbersList"] ?? [];
    const numberExists = phoneNumbersList.some(
      (element) => element === phoneNumber
    );

    if (numberExists) {
      // this.sendOtp();
      // this.isLoggedIn = true;
    } else {
      throw new Error("Number does not exist");
    }
  }

  sendOtp(phoneNumber: string): Promise<any> {
    const appVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        // 'callback': (response) => {
        //   // reCAPTCHA solved, allow signInWithPhoneNumber.
        //   // ...
        // },

        // 'expired-callback': () => {
        //   // Response expired. Ask user to solve reCAPTCHA again.
        //   // ...
        // }
      },
      this.auth
    );
    return new Promise((resolve, reject) => {
      return signInWithPhoneNumber(
        this.auth,
        "+91" + phoneNumber,
        appVerifier
      ).then(
        (confirmationResult) => {
          // Save the confirmation result for later use
          this.confirmationResult = confirmationResult;
          resolve(confirmationResult);
        },
        (error) => {
          console.error("Error sending OTP:", error);
          reject(error);
        }
      );
    });
  }

  verifyOtp(otp: string): Promise<any> {
    console.log(otp);

    if (this.confirmationResult !== null) {
      return this.confirmationResult
        .confirm(otp)
        .then((userCredential: UserCredential) => {
          // User successfully verified
          const user = userCredential.user;
          this.isLoggedIn = true;
          return user;
        })
        .catch((error: any) => {
          console.error("Error verifying OTP:", error);
          throw error;
        });
    } else {
      throw new Error("Confirmation result not found in local storage.");
    }
  }

  signOut(): Promise<void> {
    this.isLoggedIn = false;
    return this.auth.signOut();
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }
}
