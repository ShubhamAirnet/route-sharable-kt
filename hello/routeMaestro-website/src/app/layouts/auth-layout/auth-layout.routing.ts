import { Routes } from '@angular/router';
import { RegisterComponent } from '../../pages/register/register.component';
import { OtpComponent } from 'src/app/pages/otp/otp.component';
import { LoginComponent } from 'src/app/pages/login/login.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'otp', component: OtpComponent },
    { path: 'register', component: RegisterComponent }
];
