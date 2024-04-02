import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlightCardComponent } from './flight-card/flight-card.component';
import { FlightDetailsComponent } from './flight-details/flight-details.component';
import { FlightSetCardComponent } from './flight-set-card/flight-set-card.component';
import { AlternateFlightOptionsComponent } from './alternate-flight-options/alternate-flight-options.component';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { HotelCardsComponent } from './hotel-cards/hotel-cards.component';
import { TravellerCardComponent } from './traveller-card/traveller-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotelInfoComponent } from './hotel-info/hotel-info.component';
import { CityScheduleComponent } from './city-schedule/city-schedule.component';
import { CombinedItineraryComponent } from './combined-itinerary/combined-itinerary.component';
import { AlternateHotelCardsComponent } from './alternate-hotel-cards/alternate-hotel-cards.component';

import { CustomizeOwnComboComponent } from './customize-own-combo/customize-own-combo.component';
import { HotelImagesSliderComponent } from './hotel-images-slider/hotel-images-slider.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { LoaderComponent } from './loader/loader.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { PackageFareSummaryComponent } from './package-fare-summary/package-fare-summary.component';
// import { NgSpinKitModule } from 'ng-spin-kit';

import { FlightSeatMapComponent } from './flight-seat-map/flight-seat-map.component';

import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { RefundiblePolicyComponent } from './refundible-policy/refundible-policy.component';
import { PackageCancellationComponent } from './package-cancellation/package-cancellation.component';
import { HotelCancelComponent } from './hotel-cancel/hotel-cancel.component';
import { CombinedPolicyComponent } from './combined-policy/combined-policy.component';
import { PaymentBreakdownComponent } from './payment-breakdown/payment-breakdown.component';
import { RouteOverviewComponent } from './route-overview/route-overview.component';
import { FlightCancelComponent } from './flight-cancel/flight-cancel.component';
import { CancelPackageComponent } from './cancel-package/cancel-package.component';
import { CancelStatusComponent } from './cancel-status/cancel-status.component';
import { CityPackageComponent } from './city-package/city-package.component';
import { FlightCardPackageComponent } from './flight-card-package/flight-card-package.component';
import { PaymentBreakdownPackageComponent } from './payment-breakdown-package/payment-breakdown-package.component';
import { InputSidebarComponent } from './input-sidebar/input-sidebar.component';
import { FlightInputSidebarComponent } from './flight-input-sidebar/flight-input-sidebar.component';
import { FlightHeaderComponent } from './flight-header/flight-header.component';
import { FlightCardRoundTripComponent } from './flight-card-round-trip/flight-card-round-trip.component';
import { TravelDataFlightsComponent } from './travel-data-flights/travel-data-flights.component';
import { HotelInputSidebarComponent } from './hotel-input-sidebar/hotel-input-sidebar.component';
import { FlightFiltersComponent } from './flight-filters/flight-filters.component';
import { TravelDataHotelsComponent } from './travel-data-hotels/travel-data-hotels.component';
import { ReissueTravelDataComponent } from './reissue-travel-data/reissue-travel-data.component';
import { BookFlightCardComponent } from './book-flight-card/book-flight-card.component';




@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    // NgSpinKitModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    FlightCardComponent,
    FlightDetailsComponent,
    FlightSetCardComponent,
    AlternateFlightOptionsComponent,
    AdminNavbarComponent,

    HotelCardsComponent,
    TravellerCardComponent,

    HotelInfoComponent,
    CityScheduleComponent,
    CombinedItineraryComponent,
    AlternateHotelCardsComponent,

    CustomizeOwnComboComponent,
    HotelImagesSliderComponent,
    AdminSidebarComponent,
    LoaderComponent,
    TooltipComponent,
    PackageFareSummaryComponent,

    FlightSeatMapComponent,
 
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    RefundiblePolicyComponent,
    PackageCancellationComponent,
    HotelCancelComponent,
    CombinedPolicyComponent,
    PaymentBreakdownComponent,
    RouteOverviewComponent,
    FlightCancelComponent,
    CancelPackageComponent,
    CancelStatusComponent,
    CityPackageComponent,
    FlightCardPackageComponent,
    PaymentBreakdownPackageComponent,
    InputSidebarComponent,
    FlightInputSidebarComponent,
    FlightHeaderComponent,
    FlightCardRoundTripComponent,
    TravelDataFlightsComponent,
    HotelInputSidebarComponent,
    FlightFiltersComponent,
    TravelDataHotelsComponent,
    ReissueTravelDataComponent,
    BookFlightCardComponent,
 

  



  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    FlightCardComponent,
    FlightDetailsComponent,
    FlightSetCardComponent,
    AlternateFlightOptionsComponent,
    AdminNavbarComponent,

    HotelCardsComponent,
    TravellerCardComponent,

    HotelInfoComponent,
    CityScheduleComponent,
    CombinedItineraryComponent,
    AlternateHotelCardsComponent,

    CustomizeOwnComboComponent,
    HotelImagesSliderComponent,
    AdminSidebarComponent,
    LoaderComponent,
    TooltipComponent,
    PackageFareSummaryComponent,

    FlightSeatMapComponent,
 
  
    AdminNavbarComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    RefundiblePolicyComponent,
    PackageCancellationComponent,
    CombinedPolicyComponent,
    HotelCancelComponent,
    PaymentBreakdownComponent,
    RouteOverviewComponent,
    FlightCancelComponent,
    CancelPackageComponent,
    CancelStatusComponent,
    CityPackageComponent,
    FlightCardPackageComponent,
    PaymentBreakdownPackageComponent,
    InputSidebarComponent,
    FlightInputSidebarComponent,
    FlightHeaderComponent,
    FlightCardRoundTripComponent,
    TravelDataFlightsComponent,
    FlightFiltersComponent,
    HotelInputSidebarComponent,
    TravelDataHotelsComponent,
    ReissueTravelDataComponent,
    BookFlightCardComponent




  ]
})
export class ComponentsModule { }
