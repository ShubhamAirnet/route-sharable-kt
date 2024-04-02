import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { StoreService } from "src/app/Services/store/store.service";

@Component({
  selector: "app-city-schedule",
  templateUrl: "./city-schedule.component.html",
  styleUrls: ["./city-schedule.component.scss"],
})
export class CityScheduleComponent implements OnInit {
  data$ = this.store.data$;

  @Input() citySchedule: any;
  @Input() allHotels: any;
  @Input() currentFlightSet: any;
  @Input() docUid:any;

  dialog: boolean = false;
  selectedHotel: any = null;
  allPropInCityCurrentHotelArr: any[] = [];
  @Output() currHotelsForParticularCity: EventEmitter<any> =
    new EventEmitter<any>();

  cityProperties = [];
  daysScheduleInCity = [];

  roomArrFromBackend = [];

  finalRoomsArr;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    
    this.store.data$.subscribe((data) => {
      // console.log(data.trip.RoomGuests);
      this.roomArrFromBackend = [...data.trip.RoomGuests];

      console.log(this.roomArrFromBackend);
    });

    this.finalRoomsArr = JSON.parse(JSON.stringify(this.roomArrFromBackend));

    this.getPropertiesFortheCity(this.citySchedule);
    this.findHotelWithLowestPrice(this.allHotels);

    console.log(this.allPropInCityCurrentHotelArr);

    this.emitCurrCityHotels(); // Emit initial data
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("HotelCardsComponent ngOnChanges", changes);
    // You can add logic here to handle input changes if needed
  }

  truncateText(text: string, maxLength: number): string {
    if (text === "" || text === null) return "No hotel present";
    if (text.length > maxLength) {
      // console.log(text.substring(0, maxLength) + '...')
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  handleAddToItinerary(selectedHotel: any): void {
    this.selectedHotel = selectedHotel;
    if (this.selectedHotel) {
      this.allPropInCityCurrentHotelArr.forEach((item) => {
        if (item.checkInDate === this.selectedHotel.checkInDate) {
          item.hotel = this.selectedHotel;
        }
      });
      this.emitCurrCityHotels(); // Emit updated data
    }
  }

  isHotelInfo = false;

  showHotelInfo() {
    this.isHotelInfo = !this.isHotelInfo;
  }

  dialogbox() {
    this.dialog = !this.dialog;

    console.log("click registered , should opne dialog box");
  }

  getDefaultRoomDetails(lowestPriceHotel) {
    let roomIndexArr =
      lowestPriceHotel.room.GetHotelRoomResult.RoomCombinations
        .RoomCombination[0].RoomIndex;

    let roomsArr = lowestPriceHotel.room.GetHotelRoomResult.HotelRoomsDetails;

    let filteredRooms = roomsArr.filter((room) =>
      roomIndexArr.includes(room.RoomIndex)
    );

    this.finalRoomsArr = this.finalRoomsArr.map((item, index) => {
      return { ...item, room: filteredRooms[index] };
    });

    // this.finalRoomsArr = JSON.parse(JSON.stringify(filteredRooms));

    return;
  }

  findHotelWithLowestPrice(allHotels: any) {
    let lowestPriceHotel;
    const cityNameOfCurrCitySchedule = this.citySchedule.cityName;
    this.citySchedule?.Properties.map((item) => {
      if (allHotels && allHotels.length > 0) {
        // Initialize lowestPrice here before iterating through hotels
        let lowestPrice = Number.MAX_VALUE; // Start with a high value
        // Iterate through all hotels
        for (const hotel of allHotels) {
          if (
            hotel?.cityName == this.citySchedule?.cityName &&
            item?.date[0] === hotel?.checkInDate
          ) {
            // Initialize lowestPrice here before iterating through responses
            for (const response of hotel?.Response) {
              const currentPrice = response?.search?.Price?.PublishedPrice;
              if (currentPrice !== undefined && currentPrice < lowestPrice) {
                lowestPrice = currentPrice;
                lowestPriceHotel = response || "";
              }
            }
          }
        }
        // Check if a valid lowest price was found before pushing into the array
        if (lowestPrice !== Number.MAX_VALUE) {
          console.log(lowestPriceHotel);
          this.getDefaultRoomDetails(lowestPriceHotel);

          this.allPropInCityCurrentHotelArr.push({
            checkInDate: item?.date[0],
            hotel: lowestPriceHotel,
            city: cityNameOfCurrCitySchedule,
            roomDetails: this.finalRoomsArr,
          });
        }
      }
    });
  }

  getHotelNameToDisplay(currentHotel) {
    return this.truncateText(currentHotel.hotel.search.HotelName, 15);
  }

  gotFinalRoomsArr(finalRoomsArr) {
    console.log(finalRoomsArr);

    let checkInAsUid = finalRoomsArr[0].checkInDate;

    let roomsTobeChanged = this.allPropInCityCurrentHotelArr.find(
      (cityProp) => cityProp.checkInDate === checkInAsUid
    );

    if (roomsTobeChanged) {
      roomsTobeChanged.roomDetails = JSON.parse(JSON.stringify(finalRoomsArr));
    }

    this.emitCurrCityHotels();
  }

  emitCurrCityHotels() {
    this.currHotelsForParticularCity.emit(this.allPropInCityCurrentHotelArr);
  }

  // schedule frontend functions

  getNumberOfDaysInCity(citySchedule) {
    const days = citySchedule.days.length;
    // console.log(days)
    this.getDaysScheduleForCity(citySchedule);
    return days;
  }

  getCityName(citySchedule) {
    // console.log("hello");
    return citySchedule.cityName;
  }

  getPropertiesFortheCity(citySchedule) {
    this.cityProperties = citySchedule.Properties;

    return;
  }

  getNumberOfDaysInProperty(property) {
    // console.log(property.date.length)
    return property.date.length;
  }
  getCheckInDate(property) {
    // console.log(property.date[0])
    return property;
  }

  getDaysScheduleForCity(citySchedule) {
    this.daysScheduleInCity = citySchedule.days;

    // console.log(this.daysScheduleInCity)
  }

  getMorningActivity(oneDaySchedule) {
    let activity = null;
    oneDaySchedule.activities.filter((timePeriod) => {
      // console.log(timePeriod)
      if (timePeriod.activity_timeperiod === "morning") {
        // console.log(timePeriod.activity_name)
        activity = timePeriod.activity_name;
      }
    });
    // console.log(activity)
    if (activity === null) return "Leisure Time";
    return activity;
  }

  getAfternoonActivity(oneDaySchedule) {
    let activity = null;

    oneDaySchedule.activities.filter((timePeriod) => {
      if (timePeriod.activity_timeperiod === "afternoon")
        activity = timePeriod.activity_name;
    });
    // console.log(activity)
    if (activity === null) return "Leisure Time";
    return activity;
  }

  getEveningActivity(oneDaySchedule) {
    let activity = null;

    oneDaySchedule.activities.filter((timePeriod) => {
      if (timePeriod.activity_timeperiod === "evening")
        activity = timePeriod.activity_name;
    });

    if (activity === null) return "Leisure Time";
    return activity;
  }

  getNightActivity(oneDaySchedule) {
    let activity = null;

    oneDaySchedule.activities.filter((timePeriod) => {
      if (timePeriod.activity_timeperiod === "night")
        activity = timePeriod.activity_name;
    });

    if (activity === null) return "Leisure Time";
    return activity;
  }
}
