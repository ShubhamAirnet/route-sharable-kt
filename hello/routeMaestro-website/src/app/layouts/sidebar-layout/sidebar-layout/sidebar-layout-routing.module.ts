
import {  Routes } from '@angular/router';
import { BookingDetailsComponent } from 'src/app/pages/booking-details/booking-details.component';
import { PackageListComponent } from 'src/app/pages/package-list/package-list.component';

export const SidebarLayoutRoutingModule:Routes = [

  {path:"package-list" , component:PackageListComponent},
  {path:"booking-details/:uid/:id" , component:BookingDetailsComponent},

];

