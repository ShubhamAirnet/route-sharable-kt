import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '', title: 'Create Itinerary', icon: 'bullet-list-67 text-primary', class: '' },
  // { path: '/dashboard', title: 'Test 1', icon: 'ni ni-settings text-blue', class: '' },
  // { path: '/icons', title: 'Test 2', icon: 'ni ni-settings text-blue', class: '' },
  { path: '/icons', title: 'Create Package', icon: 'ni-planet text-blue', class: '' },
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  // public isCollapsed = false;
  isLoggedIn = false;

  isCollapsed = true;


 

  constructor(
    private router: Router,
    public authService: AuthService,) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
   this.authService.listenForAuthStateChanges();
   this.isLoggedIn = this.authService.getIsLoggedIn();
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  signOut() {
    this.authService.signOut()
      .then(() => {
        console.log('User signed out successfully');
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });

  }
}
