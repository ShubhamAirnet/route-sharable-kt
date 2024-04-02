import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  errorMsg: string | undefined;
  loader: boolean = false;
  uid:string='';
  users:any | null=null;
  toggle:boolean =true;
  index:number =0;
  activeFeature: 'addNewMember' | 'activeUsers' = 'addNewMember';

  constructor(private authService: AuthService,private toastr: ToastrService) {
    this.fetchUserDetails()
   }

  ngOnInit(): void {
  }

  private showToast(type: string, title: string, message: string) {
    this.toastr.show(message, title, {
      timeOut: 4000, // 4 seconds
      positionClass: 'toast-top-right',
      toastClass: `ngx-toastr-${type} custom-toast`,
      closeButton: true,
      progressBar: true,
    
      enableHtml: true,
      
    });
  }

  async onSubmit(formData: any) {
    // Handle form submission
    console.log("Form submitted with values:", formData);
    console.log('register call');
    this.registerUser(formData)
    
   
  }

  async sendMessage(formValues){
    try{
      const res=await axios.post('http://localhost:4000/sendMsg',{formValues,uid:this.uid});
      // console.log(res.data.error)
      if(res.data.success){
        this.showToast('success', 'Message Sent', res.data.message);
      }
    }catch(error){
      this.showToast('error', 'Error', 'Something went wrong.')
    }
  }

  registerUser(formValues: { name: string; phone:string; email: string; password: string }) {
    // console.log(formValues)
    delete this.errorMsg;
    this.loader = true;

    this.authService.registerUserByAdmin(formValues)
      .then((userCredential) =>{
        this.loader = false
        this.showToast('success', 'Message Sent', 'Registered Successfully');
        this.uid=userCredential.user.uid;
        console.log(this.uid);
        this.sendMessage(formValues)
      

      } )
      .catch((error) => {
        this.loader = false;
        this.errorMsg = error;
        this.showToast('error', 'Error', error)
        setTimeout(() => delete this.errorMsg, 5000);
      });
  }
  formatTimestamp(timestamp: Timestamp): string {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
    return date.toLocaleString(); // Adjust formatting as needed
  }

  async fetchUserDetails(): Promise<void> {
    console.log("fetching");
  
    try {
      const userDetails = await this.authService.getUserDetailsWithPlan();
      console.log(userDetails);
  
      // Format end_date for each planDetail in the array
     this.users=userDetails
  
      console.log(this.users);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }

 

  toggleFeature(feature: 'addNewMember' | 'activeUsers'): void {
    this.activeFeature = feature;

    // Add your logic here based on the selected feature
  }
  
}



