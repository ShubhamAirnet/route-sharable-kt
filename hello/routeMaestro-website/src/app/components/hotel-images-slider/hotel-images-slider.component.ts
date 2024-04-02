import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotel-images-slider',
  templateUrl: './hotel-images-slider.component.html',
  styleUrls: ['./hotel-images-slider.component.scss']
})
export class HotelImagesSliderComponent implements OnInit {

  @Input() hotelImagesArr;

  constructor() { }

  ngOnInit(): void {
    console.log(this.hotelImagesArr)
  }
  currentIndex: number = 0;

  setActiveImage(index: number): void {
    this.currentIndex = index;
  }

  moveLeft(): void {
    this.currentIndex = (this.currentIndex - 1 + this.hotelImagesArr.length) % this.hotelImagesArr.length;
  }

  moveRight(): void {
    this.currentIndex = (this.currentIndex + 1) % this.hotelImagesArr.length;
  }





  
  isOpen = true;

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }
}
