import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  uid:string | null=null;

  constructor(
    private router:Router,
    public authService: AuthService
    ) {
   
        console.log(this.uid)
  }

  ngOnInit() {
    this.getUid();
  }

  async getUid(){

    try{

      this. uid=await this.authService.getUserUid();
      console.log(this.uid);
    }
    catch(err){

      console.log(err);
    }

  }

  logout(){
    this.uid=null;
    this.authService.signoutCurrentUser();
  }
 
  // navigateToLogin(){
  //   this.router.navigate(['login'])
  // }

  // checkStatus(){
  //   return this.auth.isLoggedIn();
  // }
  // signout(){
  //   return this.auth.logout();
  // }

}