import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { HotelBookingService } from "src/app/Services/hotels_booking/hotel-booking.service";
import { StoreService } from "src/app/Services/store/store.service";

@Component({
  selector: "app-hotel-info",
  templateUrl: "./hotel-info.component.html",
  styleUrls: ["./hotel-info.component.scss"],
})
export class HotelInfoComponent implements OnInit {
  @Input() hotelOnDisplayDetails;
  @Input() RoomGuests:any;
  @Input() nationality:any;
  @Input() countryCode:any;
  @Input() cityId:any;
  @Input() checkOutDate:any;
  @Input() cityName:any;


  activeSection: string = 'overview';
  // these are being filled in ngOnInit
  hotelFacilitiesArr = [];
  roomsArr = [];
  recommendedRoomCombinationsArr = [];

  data$ = this.store.data$;

  roomArrFromBackend = [];

  finalRoomsArr = [];
  isRecommendedComboSelected = false;

  hotelImagesArr = [];

  isRoomSelectedBool = false;

  @Output() finalRoomsArrChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeDialog: EventEmitter<any> = new EventEmitter<any>();
  tooltipVisibility: boolean[] = [];

  constructor(private store: StoreService,private hotelBook:HotelBookingService,private router:Router) {}

  ngOnInit(): void {
    console.log(this.hotelOnDisplayDetails);

    this.store.data$.subscribe((data) => {
      this.roomArrFromBackend = [...data.trip.RoomGuests];
    });
    if(this.RoomGuests){
      this.roomArrFromBackend=this.RoomGuests
    }


    this.finalRoomsArr = JSON.parse(JSON.stringify(this.roomArrFromBackend));
    console.log(this.finalRoomsArr)

    // these three are for display purposes.
    this.getHotelFacilitiesArr();
    this.getRoomArr();
    this.getRecommendedRoomCombinations();

    this.settingFinalRoomsArrByRoomIdx(
      this.hotelOnDisplayDetails?.room?.GetHotelRoomResult?.RoomCombinations
        ?.RoomCombination[0]?.RoomIndex
    );

    this.gethotelImagesArr();
    this.initializeTooltipVisibilityArray()
  }

  // DONE----------------------------------------------------------------------------------------------
  getHotelFacilitiesArr() {
    // Check if hotelOnDisplayDetails and its nested properties exist and have expected values
    if (
      this.hotelOnDisplayDetails &&
      this.hotelOnDisplayDetails.info &&
      this.hotelOnDisplayDetails.info.HotelInfoResult &&
      this.hotelOnDisplayDetails.info.HotelInfoResult.ResponseStatus === 1 &&
      this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails &&
      this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails
        .HotelFacilities &&
      this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails
        .HotelFacilities.length > 0
    ) {
      // Set hotelFacilitiesArr when all conditions are met
      if (Array.isArray(this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails.HotelFacilities)) {
        // If it's an array, simply assign it to hotelFacilitiesArr
        this.hotelFacilitiesArr = this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails.HotelFacilities;
    } else if (typeof this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails.HotelFacilities === 'string') {
        // If it's a string, split it by commas and assign the result to hotelFacilitiesArr
        this.hotelFacilitiesArr = this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails.HotelFacilities.split(",").map(item => item.trim());
    } else {
        // Handle other types or undefined/null values as per your requirement
        console.error("Invalid type for hotel facilities:", typeof this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails.HotelFacilities);
    }
    } else {
      // Set hotelFacilitiesArr to indicate no facilities are mentioned by the hotel
      this.hotelFacilitiesArr = ["No facilities mentioned by the hotel."];
    }
  }

  // DONE-------------------------------------------------------------------------------
  getRoomArr() {
    if (
      this.hotelOnDisplayDetails &&
      this.hotelOnDisplayDetails.room &&
      this.hotelOnDisplayDetails.room.GetHotelRoomResult &&
      this.hotelOnDisplayDetails.room.GetHotelRoomResult.HotelRoomsDetails &&
      this.hotelOnDisplayDetails.room.GetHotelRoomResult.HotelRoomsDetails
        .length > 0
    ) {
      // Set roomsArr when all conditions are met
      this.roomsArr =
        this.hotelOnDisplayDetails.room.GetHotelRoomResult.HotelRoomsDetails;
    } else {
      // Set roomsArr to indicate that no room details are available
      this.roomsArr = ["No room details available."];
    }
  }

  // DONE--------------------------------------------------------------------------
  getRecommendedRoomCombinations() {
    // Check if hotelOnDisplayDetails and its nested properties exist and have expected values
    if (
      this.hotelOnDisplayDetails &&
      this.hotelOnDisplayDetails.room &&
      this.hotelOnDisplayDetails.room.GetHotelRoomResult &&
      this.hotelOnDisplayDetails.room.GetHotelRoomResult.RoomCombinations &&
      this.hotelOnDisplayDetails.room.GetHotelRoomResult.RoomCombinations
        .RoomCombination
    ) {
      // Set recommendedRoomCombinationsArr when all conditions are met

      // RecommendedRoomCombinationsArr is an array containing array of the roomIndexes [[3,4],[5,7]]
      this.recommendedRoomCombinationsArr =
        this.hotelOnDisplayDetails.room.GetHotelRoomResult.RoomCombinations.RoomCombination;
    } else {
      // Set recommendedRoomCombinationsArr to indicate that no recommended room combinations are available
      this.recommendedRoomCombinationsArr = [
        "No recommended room combinations available.",
      ];
    }
  }

  // DONE-----------------------------------------------------------------------
  settingFinalRoomsArrByRoomIdx(roomIdxArr: number[]): void {
    this.resetRoomsInTempRoomsArr();

    roomIdxArr.forEach((idx) => {
      // console.log(idx)
      let room = this.findRoomThroughRoomIdx(idx);
      // console.log(room)
      // Find the first object without a room and update it
      const objToUpdate = this.finalRoomsArr.find((obj) => obj.room === null);
      // console.log(objToUpdate)
      if (objToUpdate) {
        objToUpdate.room = room;
        objToUpdate.checkInDate = this.hotelOnDisplayDetails.checkInDate;
      }
    });

    this.isRecommendedComboSelected = true;

    this.finalRoomsArrChange.emit(this.finalRoomsArr);
    // console.log(this.finalRoomsArr);
  }

  // helper
  resetRoomsInTempRoomsArr(): void {
    this.finalRoomsArr.forEach((obj) => {
      obj.room = null; // You can use an initial state instead of null if needed
    });
    // console.log(this.finalRoomsArr)
  }

  // helper
  findRoomThroughRoomIdx(roomIndex: number) {
    return this.roomsArr.find((particularRoom) => {
      return particularRoom.RoomIndex === roomIndex;
    });
  }

  // DONE
  gethotelImagesArr() {
    // Check if hotelOnDisplayDetails and its nested properties exist and have expected values
    if (
      this.hotelOnDisplayDetails &&
      this.hotelOnDisplayDetails.info &&
      this.hotelOnDisplayDetails.info.HotelInfoResult &&
      this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails &&
      this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails.Images
    ) {
      // Set hotelImagesArr when all conditions are met
      this.hotelImagesArr =
        this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails.Images;
    } else {
      // Set hotelImagesArr to indicate that no hotel images are available
      this.hotelImagesArr = ["No hotel images available."];
    }
  }

  showCarousel: boolean = false;

  toShowCarousel() {
    this.showCarousel = !this.showCarousel;
  }

  // FRONTEND Functions

  getHotelFullName() {
    // Check if hotelOnDisplayDetails and its nested properties exist and have expected values
    if (
      this.hotelOnDisplayDetails &&
      this.hotelOnDisplayDetails.search &&
      this.hotelOnDisplayDetails.search.HotelName
    ) {
      // Return the hotel name if all conditions are met
      return this.hotelOnDisplayDetails.search.HotelName;
    } else {
      // Return an error message if the hotel name cannot be retrieved
      return "Error getting hotel name";
    }
  }

  getHotelStars() {
    // Check if hotelOnDisplayDetails and its nested properties exist and have expected values
    if (this.hotelOnDisplayDetails && this.hotelOnDisplayDetails.search) {
      const starsCount = this.hotelOnDisplayDetails.search.StarRating;

      // Check if star rating is a valid number
      if (!isNaN(starsCount) && starsCount >= 1 && starsCount <= 5) {
        // Return the appropriate star rating symbol based on the star count
        switch (starsCount) {
          case 1:
            return "★";
          case 2:
            return "★★";
          case 3:
            return "★★★";
          case 4:
            return "★★★★";
          case 5:
            return "★★★★★";
          default:
            return "★"; // Default to one star if star count is not within the expected range
        }
      } else {
        return "★"; // Default to one star if star rating is not a valid number
      }
    } else {
      return "★"; // Default to one star if hotel details are not available
    }
  }

  getPropertyAddress() {
    // Using optional chaining to safely access nested properties
    return (
      this.hotelOnDisplayDetails?.search?.HotelAddress ??
      "Error getting property address"
    );
  }

  getDescriptionForOverview() {
    const description = this.getHotelDescription();

    // Create a temporary element to parse the HTML
    const tempElement = document.createElement("div");
    tempElement.innerHTML = description;

    // Get the first <p> tag
    const firstPTag = tempElement.querySelector("p");

    // Extract the text content of the first <p> tag
    const headline = firstPTag ? firstPTag.textContent.trim() : "";

    // Show the headline with an ellipsis if it exceeds a certain length
    const maxLength = 50; // Adjust as needed
    const truncatedHeadline =
      headline.length > maxLength
        ? headline.substring(0, maxLength) + "..."
        : headline;

    console.log(truncatedHeadline); // Output: "HeadLine : Near Old Port of Montreal..."

    return truncatedHeadline;
  }

  getHotelDescription() {
    if (
      this.hotelOnDisplayDetails &&
      this.hotelOnDisplayDetails.info &&
      this.hotelOnDisplayDetails.info.HotelInfoResult &&
      this.hotelOnDisplayDetails.info.HotelInfoResult.ResponseStatus === 1 &&
      this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails &&
      this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails.Description
    ) {
      // Set hotelFacilitiesArr when all conditions are met
      return this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails
        .Description;
    } else {
      // Set hotelFacilitiesArr to indicate no facilities are mentioned by the hotel
      return "No description mentioned by the hotel.";
    }
  }

  
  // ROOMS FUNCTIONS

  getHeadingForRoomCombination(roomCombination: any): string {
    try {
      // Check if roomCombination and RoomIndex are defined and RoomIndex is an array
      if (roomCombination && Array.isArray(roomCombination.RoomIndex)) {
        const roomIndexLength = roomCombination.RoomIndex.length;
        let roomName;
        if(roomIndexLength===1){
          roomName=this.findRoomThroughRoomIdx(roomCombination.RoomIndex[0]);

        }
        // Return a string indicating the length of the room combination
        return roomIndexLength > 1
          ? `${roomIndexLength} Nights Combo`
          :roomName.RoomTypeName ;
      } else {
        // Handle the case where roomCombination or RoomIndex is undefined or not an array
        return "Invalid room combination";
      }
    } catch (error) {
      // Handle any exceptions that occur during execution
      console.error("Error in getHeadingForRoomCombination:", error);
      return "Error retrieving room combination";
    }
  }

  getCombRoomName(roomIndex: number) {
    try {
      // Find the room using roomIndex
      const room = this.findRoomThroughRoomIdx(roomIndex);

      // Check if a valid room object is found
      if (!room) {
        throw new Error("Room not found for the given roomIndex");
      }

      // Check if RoomTypeName is a non-empty string
      if (
        typeof room.RoomTypeName !== "string" ||
        room.RoomTypeName.trim() === ""
      ) {
        throw new Error("Invalid RoomTypeName");
      }

      // Split the RoomTypeName by comma to get individual items
      const items = room.RoomTypeName.split(",");

      // Format each item to display on a separate line
      const formattedResponse = items.map((item) => item.trim()).join("<br>");

      return formattedResponse;
    } catch (error) {
      console.error("Error occurred:", error.message);
      // Handle the error by returning an appropriate message or value
      return "Error occurred while formatting room details";
    }
  }


  getCancellation(roomIndex:number){
    const room = this.findRoomThroughRoomIdx(roomIndex);
    const cancellationPolicy=room?.CancellationPolicies;
    return cancellationPolicy
  }
  getCombPrice(roomCombination) {
    // console.log(roomCombination);

    const filteredRooms = this.roomsArr.filter((room) =>
      roomCombination.RoomIndex.includes(room.RoomIndex)
    );
    // console.log(roomCombination.RoomIndex);
    // console.log(filteredRooms);

    let totalPrice = 0;
    filteredRooms.forEach((room) => {
      totalPrice += room.Price.PublishedPriceRoundedOff;
    });

    // console.log(totalPrice);
    return totalPrice;
  }

  getCombRoomInclusions(roomIndex: number) {
    return this.getRoomInclusions(this.findRoomThroughRoomIdx(roomIndex));
  }

 

  getCurrRoomIdx(): number[] {
    // console.log(this.finalRoomsArr.map((roomObject) => roomObject))
    return this.finalRoomsArr.map((roomObject) => roomObject.room.RoomIndex);
  }

  areArraysEqual(roomCombination): boolean {
    let roomIndexArr = roomCombination.RoomIndex;
    let currRoomIdxArr = this.getCurrRoomIdx();

    if (roomIndexArr.length !== currRoomIdxArr.length) {
      return false;
    }

    for (let i = 0; i < roomIndexArr.length; i++) {
      if (roomIndexArr[i] !== currRoomIdxArr[i]) {
        return false;
      }
    }

    return true;
  }

  // ================================================================================================
  gotCustomizedCombo(data) {
    this.isRecommendedComboSelected = false;

    this.finalRoomsArr = JSON.parse(JSON.stringify(data));
    // this.finalRoomsArr={...data};
    console.log(this.finalRoomsArr);
    this.finalRoomsArrChange.emit(this.finalRoomsArr);

    return;
  }

  getRoomInclusions(room: any) {
    // Check if room and room.Inclusion are defined and room.Inclusion is an array

    if (room && room.Inclusion && Array.isArray(room.Inclusion)) {
      const inclusionsArr = room.Inclusion;
      return inclusionsArr.join(" | ");
    } else {
      // Handle the case where room or room.Inclusion is undefined or not an array
      return "No inclusions available";
    }
  }

  // IN FOOTER
  getCurrentRoomsPrice(){
    const selectedRooms=this.finalRoomsArr;

    let totalPrice=0;
    selectedRooms.forEach(room=>{
      totalPrice+=room?.room.Price.PublishedPriceRoundedOff
    })

    return totalPrice;
  }

  isOpen = true;

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
    this.closeDialog.emit()
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
  @HostListener('window:scroll', ['$event'])
 

  // NOT BEING USED RIGHT NOW
  getAdditionalFacilitesNumber() {
    return (
      this.hotelOnDisplayDetails.info.HotelInfoResult.HotelDetails
        .HotelFacilities.length - 5
    );
  }

  // DICEY
  getClasses(i: number) {
    if (i == 0) {
    }
    return {
      selectedCombo: this.isRoomSelectedBool,
      notSelectedCombo: !this.isRoomSelectedBool,
    };
  }

  // tooltip hover
  // Assuming you have a function to determine charge type based on the charge type code
getChargeType(chargeType: number,currency:string): string {
  switch (chargeType) {
      case 1:
          return currency;
      case 2:
          return "%";
      case 3:
          return "Nights";
      default:
          return "";
  }
}

transform(inputDate: string): string {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

  
getLastCancellationDate(roomIndex: number): string {
  const room=this.findRoomThroughRoomIdx(roomIndex)
  let dateString = room.LastCancellationDate;
  const dateObject = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
  };

  // Format the date using the options
  const formattedDate = dateObject.toLocaleDateString('en-US', options);
  return formattedDate;
}


initializeTooltipVisibilityArray() {
  this.tooltipVisibility = new Array(this.roomsArr.length).fill(false);
}

showCancellationPolicies(event: MouseEvent, roomIndex: number) {
  event.stopPropagation();
  this.tooltipVisibility[roomIndex] = true;
  console.log(this.tooltipVisibility)
}

hideCancellationPolicies(roomIndex: number) {
  this.tooltipVisibility[roomIndex] = false;
  console.log(this.tooltipVisibility)
}

mapSmokingPreference(smokingPreference: string): number {
  switch (smokingPreference) {
      case 'NoPreference':
          return 0;
      case 'Smoking':
          return 1;
      case 'NonSmoking':
          return 2;
      case 'Either':
          return 3;
      default:
          return -1; // or whatever default value you prefer for unknown values
  }
}
async handleBook(){
  console.log(this.finalRoomsArr)
  const hotelInfo={
    hotelName:this.hotelOnDisplayDetails?.info?.HotelInfoResult?.HotelDetails?.HotelName || '',
    hotelCode:this.hotelOnDisplayDetails?.info?.HotelInfoResult?.HotelDetails?.HotelCode || '',
    hotelPolicy:this.hotelOnDisplayDetails?.info?.HotelInfoResult?.HotelDetails?.HotelPolicy || '',
    specialInstructions:this.hotelOnDisplayDetails?.info?.HotelInfoResult?.HotelDetails?.SpecialInstructions || '',
    description:this.hotelOnDisplayDetails?.info?.HotelInfoResult?.HotelDetails?.Description || '',
    contactNo:this.hotelOnDisplayDetails?.info?.HotelInfoResult?.HotelDetails?.HotelContactNo || '',
    pincode:this.hotelOnDisplayDetails?.info?.HotelInfoResult?.HotelDetails?.PinCode || '',
    isUnderCancellationAllowed:this.hotelOnDisplayDetails?.room?.GetHotelRoomResult?.IsUnderCancellationAllowed,
    address:this.hotelOnDisplayDetails?.info?.HotelInfoResult?.HotelDetails?.Address,
    checkInDate:this.hotelOnDisplayDetails?.checkInDate,
    checkOutDate:this.checkOutDate
    
    // pincode:this.hotelOnDisplayDetails?.info?.HotelInfoResult?.HotelDetails?.PinCode,
  }
  const updatedRoomArr = this.finalRoomsArr.map((item) => {
    const amenties=item?.room?.Amenities
    const cancellationPolicy=item?.room?.CancellationPolicies
    const cancelPolicy=item?.room?.CancellationPolicy
    const lastCancellationDate=item?.room?.LastCancellationDate
    const lastVoucherDate=item?.room?.LastVoucherDate
    if(item.room){
      const {
        BedTypes,
        Price,
        RatePlanCode,
        RoomTypeName,
        RoomTypeCode,
        RoomIndex,
        SmokingPreference,
        Supplements
    } = item.room;

    const room= {
        BedTypes: BedTypes ?? '',
        Price: Price ?? '',
        RatePlanCode: RatePlanCode ?? '',
        RoomTypeName: RoomTypeName ?? '',
        RoomTypeCode: RoomTypeCode ?? '',
        RoomIndex: RoomIndex ?? '',
        SmokingPreference: this.mapSmokingPreference(SmokingPreference) ?? '',
        Supplements: Supplements ?? ''
    };
    return {
      ...item,
      room:room,
      amenties:amenties,
      cancelPolicy:cancelPolicy,
      cancellationPolicy:cancellationPolicy,
      lastCancellationDate:lastCancellationDate,
      lastVoucherDate:lastVoucherDate
    }
    }

  
  
  
});

console.log(updatedRoomArr)
console.log(hotelInfo)
console.log(hotelInfo)

try{
  const res=await this.hotelBook.createNewPackage(updatedRoomArr,this.hotelOnDisplayDetails?.checkInDate,this.checkOutDate, this.hotelOnDisplayDetails?.search?.HotelName,this.hotelOnDisplayDetails?.search?.ResultIndex,this.hotelOnDisplayDetails?.search?.HotelCode,this.cityName,this.hotelOnDisplayDetails?.info?.HotelInfoResult?.HotelDetails?.CountryName,this.RoomGuests,this.nationality,this.countryCode,this.cityId,hotelInfo)
  console.log(res)
  sessionStorage.setItem('hotel_uid',res)
  sessionStorage.setItem('hotel_traceId',this.hotelOnDisplayDetails?.room?.GetHotelRoomResult?.TraceId)
  this.router.navigate(['/package-checkout-hotels'])
}catch(error){
  console.log(error.message)
}
}

}