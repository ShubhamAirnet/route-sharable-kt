import { Component, OnInit,Input, Output, EventEmitter, OnChanges,SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-customize-own-combo',
  templateUrl: './customize-own-combo.component.html',
  styleUrls: ['./customize-own-combo.component.scss']
})
export class CustomizeOwnComboComponent implements OnInit,OnChanges {

  @Input() roomsArr;
  @Input() roomArrFromBackend;
  @Input() isRecommendedComboSelected;

  @Output() createdRoomCombination: EventEmitter<any> = new EventEmitter<any>();

  tooltipVisibility: boolean[] = [];
  numberOfRoomsFilled=0
  tempRoomsArr=[];

  activeRoomSelection:number=1;

  constructor() { }

  ngOnInit(): void {

    // console.log(this.isRecommendedComboSelected);

    this.emptyCustomizedCombo();
    this.initializeTooltipVisibilityArray()
    
    this.tempRoomsArr = JSON.parse(JSON.stringify(this.roomArrFromBackend));

    // console.log(this.tempRoomsArr)
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if the 'isRecommendedComboSelected' input has changed
    if (changes.isRecommendedComboSelected) {
      const updatedValue = changes.isRecommendedComboSelected.currentValue;
      // Handle the updated value as needed
      // console.log('isRecommendedComboSelected changed:', updatedValue);

      // Trigger any logic based on the updated value
      this.emptyCustomizedCombo();
    }
  }

  emptyCustomizedCombo(){
    if(this.isRecommendedComboSelected){
      this.tempRoomsArr = JSON.parse(JSON.stringify(this.roomArrFromBackend));
      this.activeRoomSelection=1;
      // console.log("we go some data from parent as recommed room selected.")
    }
  }

  resetRoomsInTempRoomsArr(): void {
    this.tempRoomsArr.forEach((obj) => {
        obj.room = null; // You can use an initial state instead of null if needed
    });
    // console.log(this.tempRoomsArr)
}
  
roomNameArr=[];
  getRoomTypeName(room: any) {
   this. roomNameArr= this.splitStringToList(room.RoomTypeName);
  //  console.log(this.roomNameArr)
   return true;
  }
  splitStringToList(inputString) {
    return inputString.split(',').map(item => item.trim());
  }
  getValue(roomName){
    // console.log(roomName)
    return roomName;
  }
  getRoomInclusions(room: any) {
    // Check if room and room.Inclusion are defined and room.Inclusion is an array
    room
    if (room && room.Inclusion && Array.isArray(room.Inclusion)) {
      const inclusionsArr = room.Inclusion;
      return inclusionsArr.join(" | ");
    } else {
      // Handle the case where room or room.Inclusion is undefined or not an array
      return "No inclusions available";
    }
  }

  
  getLastCancellationDate(room: any): string {
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

  formatIndianNumber(number:any) {
    if (isNaN(number)) {
        return "Invalid Number";
    }

    // Convert the number to a string
    let numStr = number.toString();

    // Split the string into integer and decimal parts (if any)
    let parts = numStr.split('.');

    // Format the integer part with commas
    let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Combine the integer and decimal parts (if any)
    let formattedNumber = parts.length > 1 ? integerPart + ',' + parts[1] : integerPart;

    return formattedNumber;
  }

  getPriceOfRoom(room:any) {
    const price = room.Price.PublishedPriceRoundedOff;
    return this.formatIndianNumber(price);
  }

  getAgentIncentive(room:any){
    return this.formatIndianNumber(room.Price.AgentCommission)
  }


  // ==========================================================



  addToSelectedRooms(index: number, room): void {
   
 
    if (index >= 0 && index <= this.tempRoomsArr.length) {

       // Create a new array with the modified object at the specified index
       this.tempRoomsArr = this.tempRoomsArr.map((item, i) => 
         i === index-1 ? { ...item, room: { ...room } } : item
       );

       this.numberOfRoomsFilled+=1;

       if(this.activeRoomSelection< this.tempRoomsArr.length) {
          this.activeRoomSelection += 1;
       }
     
      //  console.log(this.numberOfRoomsFilled,"in the function")
    }
    
    if(this.numberOfRoomsFilled>=this.tempRoomsArr.length){
      this.sendRoomCombination();
    }
    // console.log(this.tempRoomsArr);
 
 }

 sendRoomCombination(){
  // console.log("We are sending the customized data bakc to parent")
  this.createdRoomCombination.emit(this.tempRoomsArr);
 }

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

findRoomThroughRoomIdx(roomIndex: number) {
  return this.roomsArr.find((particularRoom) => {
    return particularRoom.RoomIndex === roomIndex;
  });
}


 
getCancellation(roomIndex:number){
  const room = this.findRoomThroughRoomIdx(roomIndex);
  const cancellationPolicy=room?.CancellationPolicies;
  return cancellationPolicy
}

}
  




