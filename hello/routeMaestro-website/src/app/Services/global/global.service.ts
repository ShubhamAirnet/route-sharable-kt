import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  isToggle:boolean=true;
  constructor() { }

  handleToggle(){
    this.isToggle=!this.isToggle
  }
}
