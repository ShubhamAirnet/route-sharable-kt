import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-flight-card',
  templateUrl: './book-flight-card.component.html',
  styleUrls: ['./book-flight-card.component.scss']
})
export class BookFlightCardComponent implements OnInit {
  @Input() completeFlight;
  @Input() isRefundable;
  @Input() currentFlightSetLogosArray;
  @Input() fare;
  tooltipStates: boolean[] = [false, false, false];
  tooltipCloseTimeout: any;
  constructor() { }

  ngOnInit(): void {
  }

   
  mouseEntered(index: number): void {
    // Set the tooltip state at the specified index to true
    this.tooltipStates = this.tooltipStates.map((state, i) => i === index);

    // console.log(this.tooltipStates)
  }

  mouseLeft(index: number): void {
    // Delay closing the tooltip to allow the cursor to move from trigger to tooltip
    this.setTooltipCloseTimeout(index);
  }
  

  setTooltipCloseTimeout(index: number): void {
    // Close the tooltip after a delay
    console.log("outside timeout")

    this.tooltipCloseTimeout = setTimeout(() => {
      console.log("in timeout")
      this.tooltipStates[index] = false;
    }, 10000); // Adjust the delay as needed
  }


  mouseOnTooltip(index: number): void {
    clearTimeout(this.tooltipCloseTimeout);
  }
  
  mouseLeftTooltip(index:number){
    this.setTooltipCloseTimeout(index);
  }

  getAirlineName(flightRankInArray: number): string {
    // if direct flights
    if (this.completeFlight.length === 1) {
      return this.completeFlight[0].Airline.AirlineName;
    } else {
      // if Indirect flights
      //  need to handle  if we got two different airlines
      return this.completeFlight[0].Airline.AirlineName;
    }
  }
  getAirlineCode(flightRankInArray: number): string {
    // if direct flights
    if (this.completeFlight.length === 1) {
      return this.completeFlight[0].Airline.AirlineCode;
    } else {
      // if Indirect flights
      //  need to handle  if we got two different airlines
      return this.completeFlight[0].Airline.AirlineCode;
    }
  }
  getCabinClass(flightRankInArray: number): string | number {
    let cabinClass: number | string;

    // if direct flights
    if (this.completeFlight.length === 1) {
      cabinClass = this.completeFlight[0].CabinClass;
    } else {
      // if Indirect flights
      //  need to handle  if we got two different airlines
      cabinClass = this.completeFlight[0].CabinClass;
    }

    switch (cabinClass) {
      case 2:
        cabinClass = "Economy";
        break;
      case 3:
        cabinClass = "Premium Economy";
        break;
      case 4:
        cabinClass = "Business";
        break;
      case 5:
        cabinClass = "Premium Business";
        break;
      case 6:
        cabinClass = "First";
    }

    return cabinClass;
  }
  getFlightNumber(flightRankInArray: number): string {
    // if direct flights
    if (this.completeFlight.length === 1) {
      return this.completeFlight[0].Airline.FlightNumber;
    } else {
      // if Indirect flights
      //  need to handle  if we got two different airlines
      return this.completeFlight[0].Airline.FlightNumber;
    }
  }

  flightLogoOnFront() {
    return this.currentFlightSetLogosArray[0];
  }
  getFirstOriginCity(flightRankInArray: number): string {
    return this.completeFlight[0].Origin.Airport.CityName;
  }

  getDepartDate(flightRankInArray: number): string {
    const departFlightDateTime = this.completeFlight[0].Origin.DepTime;

    // console.log(departFlightDateTime);
    const dateObject = new Date(departFlightDateTime);

    // Formatting options for the date
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };

    // Format the date using the options
    const formattedDate = dateObject.toLocaleDateString("en-US", options);

    return formattedDate;

    // const newDate = new Date(departFlightDateTime);

    // const departDay = newDate.getDate();
    // const departMonth = newDate.getMonth();
    // const departYear = newDate.getFullYear();

    // return `${departDay}:${departMonth}:${departYear}`;
  }
  getDepartureTime(flightRankInArray: number): string {
    // here it wolud be same for direct and indirect flights

    const departFlightDateTime = this.completeFlight[0].Origin.DepTime;

    const newDate = new Date(departFlightDateTime);
    let hours = newDate.getHours();

    let minutes = newDate.getMinutes();

    // Format the time as a string
    // Format the time as a string
    let formattedTime: string;
    if (hours <= 9 && minutes <= 9) {
      formattedTime = `0${hours}:0${minutes}`;
    } else if (hours <= 9) {
      formattedTime = `0${hours}:${minutes}`;
    } else if (minutes <= 9) {
      formattedTime = `${hours}:0${minutes}`;
    } else {
      formattedTime = `${hours}:${minutes}`;
    }

    return formattedTime;
  }

  getFlightDuration(flightRankInArray: number): string {
    let totalMinutes: number;

    // if direct flight
    if (this.completeFlight.length === 1) {
      totalMinutes = this.completeFlight[0].Duration;
    } else {
      // if indirect flights
      totalMinutes =
        this.completeFlight[this.completeFlight.length - 1].AccumulatedDuration;
    }

    if (totalMinutes > 60) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return `${hours}h ${minutes}m`;
    } else {
      return `${totalMinutes}m`;
    }
  }
  getFlightStops(flightRankInArray: number): string {
    let numberOfFlights: number = this.completeFlight.length;

    if (numberOfFlights === 1) return "Non Stop";
    else if (numberOfFlights === 2) {
      return `${numberOfFlights - 1} Stop`;
    } else {
      return `${numberOfFlights - 1} Stops`;
    }
  }
  getStopsImageUrl(flightRankInArray: number): string {
    let numberOfFlights: number = this.completeFlight.length;

    if (numberOfFlights === 1) {
      // journey is Non-Stop
      return "../../../assets/img/brand/nonStopFlight.png";
    } else if (numberOfFlights === 2) {
      // journey has 1 stop
      return "../../../assets/img/brand/flightStop1.png";
    } else if (numberOfFlights === 3) {
      // journey has 2 stops
      return "../../../assets/img/brand/flightStop2.png";
    } else if (numberOfFlights === 4) {
      // journey has 3 stops
      return "../../../assets/img/brand/flightStop3.png";
    } else {
      // journey has 3+ stops
      return "../../../assets/img/brand/flightStop4.png";
    }
  }

  getFinalDestinationCity(flightRankInArray: number): string {
    const finalDestinationCity =
      this.completeFlight.length === 1
        ? this.completeFlight[0].Destination.Airport.CityName
        : this.completeFlight[this.completeFlight.length - 1].Destination
            .Airport.CityName;

    // Emit the final destination city
    // this.finalDestinationCityEmitter.emit(finalDestinationCity);

    return finalDestinationCity;
  }

  getArrivalTime(flightRankInArray: number): string {
    let arrFlightDateTime: string;

    // if direct flight
    if (this.completeFlight.length === 1) {
      arrFlightDateTime = this.completeFlight[0].Destination.ArrTime;
    } else {
      // if indirect flight
      arrFlightDateTime =
        this.completeFlight[this.completeFlight.length - 1].Destination.ArrTime;
    }

    const newDate = new Date(arrFlightDateTime);
    let hours = newDate.getHours();

    let minutes = newDate.getMinutes();

    // Format the time as a string
    // Format the time as a string
    let formattedTime: string;
    if (hours <= 9 && minutes <= 9) {
      formattedTime = `0${hours}:0${minutes}`;
    } else if (hours <= 9) {
      formattedTime = `0${hours}:${minutes}`;
    } else if (minutes <= 9) {
      formattedTime = `${hours}:0${minutes}`;
    } else {
      formattedTime = `${hours}:${minutes}`;
    }

    return formattedTime;
  }
  getArrDate(flightRankInArray: number): string {
    let arrFlightDateTime: string;

    // if direct flight
    if (this.completeFlight.length === 1) {
      arrFlightDateTime = this.completeFlight[0].Destination.ArrTime;
    } else {
      // if indirect flight
      arrFlightDateTime =
        this.completeFlight[this.completeFlight.length - 1].Destination.ArrTime;
    }

    // console.log(arrFlightDateTime)
    const dateObject = new Date(arrFlightDateTime);

    // Formatting options for the date
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };

    // Format the date using the options
    const formattedDate = dateObject.toLocaleDateString("en-US", options);

    return formattedDate;

    // const newDate = new Date(arrFlightDateTime);

    // const departDay = newDate.getDate();
    // const departMonth = newDate.getMonth();
    // const departYear = newDate.getFullYear();

    // return `${departDay}:${departMonth}:${departYear}`;
  }
}

