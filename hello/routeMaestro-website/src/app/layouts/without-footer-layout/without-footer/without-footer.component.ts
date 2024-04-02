import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-without-footer',
  templateUrl: './without-footer.component.html',
  styleUrls: ['./without-footer.component.scss']
})
export class WithoutFooterComponent implements OnInit {
  isToggle:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }
  handleToggle(){
    this.isToggle=!this.isToggle
    console.log(this.isToggle)
  }
}
