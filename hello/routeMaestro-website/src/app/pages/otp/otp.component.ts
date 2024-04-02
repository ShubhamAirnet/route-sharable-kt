import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {

  phoneNumber!: string;
  otp!: string;
  verificationInProgress = false;

  constructor(

    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  onOtpChange(event: any) {
    const otpValue: string = event;
    if (otpValue.length === 6) {
      console.log('OTP is complete:', otpValue);
      this.otp = otpValue;
      // const nextSection = this.elementRef.nativeElement.querySelector('#NatureOfTrip');
      // nextSection.scrollIntoView({ behavior: 'smooth' });
      // Perform any additional actions with the complete OTP
    }
  }

  verifyOtp() {
    this.verificationInProgress = true;
    this.authService.verifyOtp(this.otp)
      .then((user) => {
        console.log('OTP verified successfully for user:', user);
        this.verificationInProgress = false;
        this.router.navigate(['/generate-aI-itinerary']);
      })
      .catch((error) => {
        console.error('Error verifying OTP:', error);
        this.toastr.error('OTP is incorrect.', 'Warning');
        this.verificationInProgress = false;
      })
      .finally(() => {
      });
  }


}
