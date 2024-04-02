import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from 'src/app/pages/admin-dashboard/admin-dashboard.component';
import { FlightSearchComponent } from 'src/app/pages/flight-search/flight-search.component';
import { HotelSearchComponent } from 'src/app/pages/hotel-search/hotel-search.component';
import { PackageListComponent } from 'src/app/pages/package-list/package-list.component';

export  const WithoutFooterRoutingModule: Routes = [
  {path:"dashboard",component:AdminDashboardComponent},
  {path:'flight-search',component:FlightSearchComponent},
  {path:'hotel-search',component:HotelSearchComponent},
  // {path:"package-list" , component:PackageListComponent},

];



