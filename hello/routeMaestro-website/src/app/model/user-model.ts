import { Timestamp } from "@angular/fire/firestore";

export class UserModel {
  userId!: string;
  authId!: string;
  name!: string;
  password!:string;
  createdOn!: Timestamp;
  active!: boolean;
}