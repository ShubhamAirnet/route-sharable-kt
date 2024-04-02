import { NgModule,  CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbDatepickerModule, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/enviroments/environment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { browserSessionPersistence, getAuth, initializeAuth, provideAuth } from '@angular/fire/auth';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './Services/auth.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
// import { NgOtpInputModule } from 'ng-otp-input';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { PoliciesComponent } from './pages/policies/policies.component';
import { TermCondComponent } from './pages/term-cond/term-cond.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { RefundComponent } from './pages/refund/refund.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { HomeComponent } from './pages/home/home.component';
import { FaqComponent } from './components/faq/faq.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ItineraryComponent } from './pages/itinerary/itinerary.component';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { AdminPricingComponent } from './pages/admin-pricing/admin-pricing.component';
import { MerchantComponent } from './pages/merchant/merchant.component';
import { SuccessComponent } from './pages/success/success.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserViewComponent } from './pages/user-view/user-view.component';
import { PackageCheckoutComponent } from './pages/package-checkout/package-checkout.component';

import { PackageListComponent } from './pages/package-list/package-list.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// Import library module
import { NgxSpinnerModule } from "ngx-spinner";
import { ItineraryPreviewComponent } from './pages/itinerary-preview/itinerary-preview.component';
import { PackagePreviewComponent } from './pages/package-preview/package-preview.component';
import { TrialComponent } from './pages/trial/trial.component';
import { FlightSearchComponent } from './pages/flight-search/flight-search.component';
import { PackageCheckoutFlightsComponent } from './pages/package-checkout-flights/package-checkout-flights.component';
import { HotelSearchComponent } from './pages/hotel-search/hotel-search.component';
import { PackageCheckoutHotelsComponent } from './pages/package-checkout-hotels/package-checkout-hotels.component';
import { ReissuanceComponent } from './pages/reissuance/reissuance.component';
import { ReissueCheckoutComponent } from './pages/reissue-checkout/reissue-checkout.component';
import { WithoutFooterComponent } from './layouts/without-footer-layout/without-footer/without-footer.component';
import { BookingDetailsComponent } from './pages/booking-details/booking-details.component';
import { SidebarLayoutComponent } from './layouts/sidebar-layout/sidebar-layout/sidebar-layout.component';




@NgModule({
  imports: [
    NgbTooltipModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    NgbNavModule,
    HttpClientModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    
    // NgOtpInputModule,
    NgxSpinnerModule,
    ComponentsModule,
    RouterModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => initializeAuth(getApp(), {
      persistence: browserSessionPersistence
    })),
    provideAuth(() => getAuth()),
    NgxSpinnerModule.forRoot({ type: 'square-jelly-box' })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ComingSoonComponent,
    PoliciesComponent,
    TermCondComponent,
    ShippingComponent,
    RefundComponent,
    ContactUsComponent,
    PricingComponent,
    HomeComponent,
    FaqComponent,
    ItineraryComponent,
    AddUserComponent,
    AdminPricingComponent,
    MerchantComponent,
    SuccessComponent,
    UserListComponent,
    UserViewComponent,
    PackageCheckoutComponent,

    PackageListComponent,
    AdminDashboardComponent,
    ItineraryPreviewComponent,
    PackagePreviewComponent,
    TrialComponent,
    FlightSearchComponent,
    PackageCheckoutFlightsComponent,
    HotelSearchComponent,
    PackageCheckoutHotelsComponent,
    ReissuanceComponent,
    ReissueCheckoutComponent,
    WithoutFooterComponent,
    BookingDetailsComponent,
    SidebarLayoutComponent

    


    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  providers: [AuthService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
