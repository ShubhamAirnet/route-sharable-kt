import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit {

  uid:string | null=null;
  constructor(
    private router:Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
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
    this.router.navigate(['home'])
  }
}
