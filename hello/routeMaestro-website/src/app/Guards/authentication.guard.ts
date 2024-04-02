import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../shared/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard {
  // constructor(private auth:AuthenticationService , private router:Router){}

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot):boolean {

  //     if(!this.auth.isLoggedIn()){

  //         this.router.navigate(["login"]);
  //         return false;
  //     }

  //   return this.auth.isLoggedIn();
  // }
}
