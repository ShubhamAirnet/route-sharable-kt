import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-flight-seat-map',
  templateUrl: './flight-seat-map.component.html',
  styleUrls: ['./flight-seat-map.component.scss']
})
export class FlightSeatMapComponent implements OnInit {
  @Input() seatMapDialog: boolean;
  @Input() ssr: any;
  @Input() ssrNo: number;
  @Input() index:number;
  @Input() seatsArray=[]as any;
  @Output() seatMapData = new EventEmitter<any>();

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();
  ssrData: any;
  seatMapForm:any;
  row:number=null;
  seatType:number=null;
  selectedSeat:any;
  

  constructor(private fb: FormBuilder) {
    this.seatMapForm = new FormControl()
  }

  ngOnInit(): void {
    this.ssrData = this.ssr;
    console.log(this.ssr)
    console.log(this.ssrNo)
    console.log(this.index)

    // Initialize the form
   


    
  }
  
  handleChange() {
    // Your logic when the selected row changes
    console.log('Selected Row:', this.row);
  }

  handleClick(event: any) {
    
    console.log('Selected Seat:', this.selectedSeat);
    this.seatsArray[this.index]=this.selectedSeat;
    console.log(this.seatsArray)
  }

  emitSeatMapData() {
    // Emit the form data to the parent component
    console.log(this.seatsArray)

      this.seatMapData.emit({seat:this.selectedSeat,index:this.index});
  

    this.closeDialog.emit()
  }

  close() {
    this.closeDialog.emit();
  }
}
