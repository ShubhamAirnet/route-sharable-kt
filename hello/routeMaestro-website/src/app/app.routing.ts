import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { OtpComponent } from './pages/otp/otp.component';
import { AuthGuard } from './Services/auth.guard';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { PoliciesComponent } from './pages/policies/policies.component';
import { TermCondComponent } from './pages/term-cond/term-cond.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { RefundComponent } from './pages/refund/refund.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ItineraryComponent } from './pages/itinerary/itinerary.component';
import { FlightDetailsComponent } from './components/flight-details/flight-details.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { AdminPricingComponent } from './pages/admin-pricing/admin-pricing.component';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { MerchantComponent } from './pages/merchant/merchant.component';
import { UserViewComponent } from './pages/user-view/user-view.component';
import { SuccessComponent } from './pages/success/success.component';
import { PackageCheckoutComponent } from './pages/package-checkout/package-checkout.component';

import { PackageListComponent } from './pages/package-list/package-list.component';
import { ItineraryPreviewComponent } from './pages/itinerary-preview/itinerary-preview.component';
import { PackagePreviewComponent } from './pages/package-preview/package-preview.component';
import { TrialComponent } from './pages/trial/trial.component';
import { WithoutFooterComponent } from './layouts/without-footer-layout/without-footer/without-footer.component';
import { SidebarLayoutComponent } from './layouts/sidebar-layout/sidebar-layout/sidebar-layout.component';
// import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }
    ]
  }, {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  },{
    path: '',
    component: WithoutFooterComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/without-footer-layout/without-footer/without-footer-routing.module').then(m => m.WithoutFooterRoutingModule)
      }
    ]
  },
  {
    path: '',
    component: SidebarLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/sidebar-layout/sidebar-layout/sidebar-layout-routing.module').then(m => m.SidebarLayoutRoutingModule)
      }
    ]
  },
  { path: 'coming-soon', component: ComingSoonComponent },
  { path: 'privacy-policy', component: PoliciesComponent },
  { path: 'terms-and-conditions', component: TermCondComponent },
  { path: 'shipping-and-delivery', component: ShippingComponent },
  { path: 'Checkout/:id', component: CheckoutComponent },
  { path: 'refund', component: RefundComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'about-us',      component: AboutUsComponent },
  { path: 'pricing',  component:PricingComponent},
  { path:'home',component:HomeComponent},
  { path:'dashboard',component:DashboardComponent},
  { path:'trial',component:TrialComponent},

  // {path:"user-list" , component:UserListComponent},
  // {path:"admin-pricing" , component:AdminPricingComponent},
  // {path:"add-user" , component:AddUserComponent},
  // {path:"merchant" , component:MerchantComponent},
  // {path:"user-view/:id" , component:UserViewComponent},

  
  
 
  {path:"itinerary-preview/:id" , component:ItineraryPreviewComponent},
  {path:"package-preview/:id" , component:PackagePreviewComponent},
  // {path:"admin-dashboard" , component:AdminDashboardComponent},

  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
