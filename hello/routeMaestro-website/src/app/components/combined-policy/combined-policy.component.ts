import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { hotel_details } from '../package-cancellation/hotel_details';
import { fareQuote } from './flight_details';

@Component({
  selector: 'app-combined-policy',
  templateUrl: './combined-policy.component.html',
  styleUrls: ['./combined-policy.component.scss']
})
export class CombinedPolicyComponent implements OnInit {
  @Input() packageDialog:boolean;
  @Input() fareRule:boolean;
  @Input() fareRule1:boolean;
  @Input() fareRule2:boolean;

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();
  package:boolean=true;
  hotel:boolean=false;
  flight:boolean=false;
  selectedItem: string ='package';
  formattedLastCancellationDate: any;
  minLastCancellationDate: Date;
  LastCancelPolicy=[] ;
  hotelData=hotel_details;
  flightData=fareQuote;
  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.processCancellationPolicies()
    this.findMinLastCancellationDate()
    console.log(this.hotelData)
  }
  close(){
    this.closeDialog.emit()
  }

  packageBox(){
    this.package=true;
    this.hotel=false;
    this.flight=false;
    this.selectedItem = 'package';
  }
  hotelBox(){
    this.package=false;
    this.hotel=true;
    this.flight=false;
    this.selectedItem = 'hotel';
  }
  flightBox(){
    this.package=false;
    this.hotel=false;
    this.flight=true;
    this.selectedItem = 'flight';
  }


  processCancellationPolicies() {
    const maxFromDateArray: any[] = [];
    
  
    Object.values(this.hotelData).forEach((hotel) => {
      
      hotel.forEach((item) => {
        if (item.room && item.room.CancellationPolicies) {
          item.room.CancellationPolicies.forEach((policy: any, index: number) => {
            const fromDate = new Date(policy.FromDate);
            const toDate = new Date(policy.ToDate);
  
            if (maxFromDateArray[index]) {
              maxFromDateArray[index].push({
                policy: policy,
                dayRate: item.room.DayRates[0]?.Amount,
                PublishedPrice: item.room.Price.PublishedPrice
              });
            } else {
              maxFromDateArray[index] = [{
                policy: policy,
                dayRate: item.room.DayRates[0]?.Amount,
                PublishedPrice: item.room.Price.PublishedPrice
              }];
            }
          });
        }
      });
    });
  
    console.log("Max and Min dates for each cancellation policy:", maxFromDateArray);
  
    const averageDate: { fromDate: string, toDate: string }[] = [];
  
    const maxDate = (dates: Date[]) => new Date(Math.max(...dates.map(date => date.getTime()))).toISOString();
    const minDate = (dates: Date[]) => new Date(Math.min(...dates.map(date => date.getTime()))).toISOString();
  
    let maxFromDate: string | null = null;
    let maxToDate: string | null = null;
  
    maxFromDateArray.forEach((item: any) => {
      const fromDates = item.map((dates: any) => new Date(dates.policy.FromDate));
      const toDates = item.map((dates: any) => new Date(dates.policy.ToDate));
  
      const currentMaxFromDate = maxDate(fromDates);
      const currentMinToDate = minDate(toDates);
  
      averageDate.push({ fromDate: currentMaxFromDate, toDate: currentMinToDate });
  
      if (!maxFromDate || currentMaxFromDate > maxFromDate) {
        maxFromDate = currentMaxFromDate;
      }
  
      if (!maxToDate || currentMinToDate > maxToDate) {
        maxToDate = currentMinToDate;
      }
    });
  
    console.log("Maximum FromDate:", maxFromDate);
    console.log("Maximum ToDate:", maxToDate);
    console.log("Average  Date:", averageDate);
  
  
    for (let i = 0; i < averageDate.length; i++) {
      const from = averageDate[i].fromDate;
      const to = averageDate[i].toDate;
      let cancel = 0;
      let othercharges = 0;
  
      maxFromDateArray[i].forEach((item: any) => {
        const itemFromDate = item.policy.FromDate;
        const chargeType = item.policy.ChargeType;
  
        if (itemFromDate <= from) {
          if (chargeType === 1) {
            cancel += item?.policy?.Charge;
          } else if (chargeType === 2) {
            cancel += ((item?.policy?.Charge) / 100) * item.PublishedPrice;
          } else {
            cancel += ((item?.policy?.Charge) * item.dayRate);
          }
  
        } else {
          if (chargeType === 1) {
            othercharges += item?.policy?.Charge;
          } else if (chargeType === 2) {
            othercharges += ((item?.policy?.Charge) / 100) * item.PublishedPrice;
          } else {
            othercharges += ((item?.policy?.Charge) * item.dayRate);
          }
        }
      });
  
      this.LastCancelPolicy.push({
        FromDate: from,
        ToDate: to,
        chargeBefore: cancel,
        chargeAfter: cancel + othercharges,
      });
    }
    this.LastCancelPolicy.sort((a, b) => new Date(a.FromDate).getTime() - new Date(b.FromDate).getTime());
  
    for (let i = 1; i < this.LastCancelPolicy.length; i++) {
      if (new Date(this.LastCancelPolicy[i - 1].ToDate) > new Date(this.LastCancelPolicy[i].ToDate)) {
        this.LastCancelPolicy[i - 1].chargeBefore += this.LastCancelPolicy[i].chargeBefore;
  
        if (new Date(this.LastCancelPolicy[i - 1].ToDate) > new Date(this.LastCancelPolicy[i].ToDate)) {
          this.LastCancelPolicy[i - 1].chargeAfter += this.LastCancelPolicy[i].chargeAfter;
        } else {
          this.LastCancelPolicy[i - 1].chargeAfter += this.LastCancelPolicy[i].chargeAfter;
          this.LastCancelPolicy[i - 1].ToDate = this.LastCancelPolicy[i].ToDate;
        }
        // Remove the merged item
        this.LastCancelPolicy.splice(i, 1);
        // Adjust the loop counter since we removed an item
        i--;
      }
    }
  
    console.log("Last Cancellation Policy:", this.LastCancelPolicy);
  }
  
  findMinLastCancellationDate() {
    const allLastCancellationDates: any[] = [];
  
    Object.values(this.hotelData).forEach((hotel: any[]) => {
      hotel.forEach((item: { room: any }) => {
        if (item.room && item.room.LastCancellationDate) {
          allLastCancellationDates.push(new Date(item.room.LastCancellationDate));
        }
      });
    });
  
    // Find the minimum LastCancellationDate
    if (allLastCancellationDates.length > 0) {
      this.minLastCancellationDate = new Date(Math.min(...allLastCancellationDates));
      this.formattedLastCancellationDate = this.datePipe.transform(this.minLastCancellationDate, 'EEE MMM d yyyy');
      console.log("Minimum LastCancellationDate:", this.formattedLastCancellationDate);
    } else {
      console.log("No LastCancellationDate found");
    }
  }
  
  calculateTotalAmount(index:number){
    let total=0;
    for(let k=index;k>=0;k--){
      total+=this.LastCancelPolicy[k].chargeAfter;
    }
    console.log(total)
    return total;
  }
}
