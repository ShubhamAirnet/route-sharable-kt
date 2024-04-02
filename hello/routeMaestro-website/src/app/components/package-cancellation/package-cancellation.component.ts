import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeCommas'
})
export class RemoveCommasPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/,/g, '');
  }
}
@Component({
  selector: 'app-package-cancellation',
  templateUrl: './package-cancellation.component.html',
  styleUrls: ['./package-cancellation.component.scss']
})
export class PackageCancellationComponent implements OnInit {
  
  @Input() hotelData:any;
  @Input() flightData:any;
  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();
  @Output() flightBox: EventEmitter<void> = new EventEmitter<void>();
  formattedLastCancellationDate: any;
  minLastCancellationDate: Date;
  LastCancelPolicy=[] ;
  flightCharges:number=0;
  flightShort:boolean;
  flightLastCancelDate:any;
  isFlightCancelPresent:boolean=false;
 
  constructor(private datePipe: DatePipe) { 
   
  }

  ngOnInit(): void {
    // hotel
    this.processCancellationPolicies()
    this.findMinLastCancellationDate()
    console.log(this.hotelData)
    // flight
    console.log(this.flightData)
    this.compareAndFormatDates(this.flightData.LastTicketDate,this.formattedLastCancellationDate)
    this.calculateFlightCancelCharge()
  }
  close(){
    this.closeDialog.emit()
  }
  flightCancelSection(){
    this.flightBox.emit()
  }
  
  compareAndFormatDates(date1: string, date2: string): string {
    const formattedDate1 = new Date(date1);
    const formattedDate2 = new Date(date2);
    this.flightLastCancelDate=formattedDate1
    if (formattedDate1 < formattedDate2) {
      this.flightShort=true

      return formattedDate1.toDateString();
    } else {
      this.flightShort=false;
      return formattedDate2.toDateString();
    }
  }



  //  flight useful data processing
 calculateFlightCancelCharge(){
  this.flightData.MiniFareRules.map((item)=>{
    item.map((flight)=>{
      if(flight.Type==="Cancellation"){
        this.flightCharges+=this.extractNumberFromString(flight.Details)
      }
    })
  })
 }

 extractNumberFromString(inputString: string): number  {
  const match = inputString.match(/\d+/);

  if (match) {
    // Extracted a number, convert it to an integer
    this.isFlightCancelPresent=true;
    return parseInt(match[0], 10);
  } else {
    // No number found, return the original string
    this.isFlightCancelPresent=false;
    return 0;
  }
}



// hotel useful data processing

  processCancellationPolicies() {
    const maxFromDateArray: any[] = [];

    Object.values(this.hotelData).forEach((hotel: any[]) => { // specify the type here
      
      hotel.forEach((item: any) => { // specify the type here
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
