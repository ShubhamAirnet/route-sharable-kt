import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../../pages/register/register.component';
// import { HomeComponent } from '../../pages/home/home.component';
import { OtpComponent } from '../../pages/otp/otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { ToastrModule } from 'ngx-toastr';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { AuthService } from 'src/app/Services/auth.service';
import { LoginComponent } from 'src/app/pages/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    NgOtpInputModule,
    ReactiveFormsModule,
    // NgbModule
    ToastrModule.forRoot(),
  ],
  declarations: [
    RegisterComponent,
    LoginComponent,
    // HomeComponent,
    OtpComponent
  ]
})
export class AuthLayoutModule { }
