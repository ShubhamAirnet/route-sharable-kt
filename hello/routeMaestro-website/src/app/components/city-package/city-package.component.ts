import { Component, Input, OnInit } from '@angular/core';
import { hotel_details } from '../package-cancellation/hotel_details';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-city-package',
  templateUrl: './city-package.component.html',
  styleUrls: ['./city-package.component.scss']
})
export class CityPackageComponent implements OnInit {

  @Input() city;
  @Input() hotelData;
  @Input() arrivalDate;
  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
    console.log(this.city)
    console.log(this.hotelData)
    console.log(this.arrivalDate)
  }

  formatDate(date:string){
    const inputDate = new Date(date);
    // Format the date using the DatePipe
    return this.datePipe.transform(inputDate, 'd MMMM');
  }
  addDays(startDate: string, daysToAdd: number): string {
    // Parse the start date
    const startDateObj = new Date(startDate);
    
    // Add the specified number of days
    startDateObj.setDate(startDateObj.getDate() + daysToAdd);
  
    // Extract the parts of the date
    const year = startDateObj.getFullYear();
    const month = ('0' + (startDateObj.getMonth() + 1)).slice(-2); // Adding 1 to month since it's zero-indexed
    const day = ('0' + startDateObj.getDate()).slice(-2);
    const hours = ('0' + startDateObj.getHours()).slice(-2);
    const minutes = ('0' + startDateObj.getMinutes()).slice(-2);
  
    // Return the date in the desired format
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

}
