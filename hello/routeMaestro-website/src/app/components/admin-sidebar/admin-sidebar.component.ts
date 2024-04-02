import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global/global.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  isContainerExpanded: boolean = true;
  isItineararyExpanded:boolean=false;
  isTravelExpanded:boolean=false;
  @Input() isToggle:boolean;
  // @Output() handleToggle:EventEmitter<any>=new EventEmitter<any>
  constructor(private router: Router,private global:GlobalService) { }

  ngOnInit(): void {
    console.log('admin')
  }
  // to toggle when the sidebar is expanded
  toggleExpanded() {
    this.isContainerExpanded = !this.isContainerExpanded;
  this.global.handleToggle()
}

  toggleItinerary(){
    this.isItineararyExpanded=!this.isItineararyExpanded;
  }
  toggleTravel(){
    this.isTravelExpanded=!this.isTravelExpanded;
  }
    // to toggle sub itinerary
  toggleSubItinerary(){
    this.toggleExpanded()
    this.toggleItinerary()
  }
  // to toggle sub travller
  toggleSubTravel(){
    this.toggleExpanded()
    this.toggleTravel()
  }

  // to get the current active url
  isActive(url: string) {
    return this.router.isActive(url, true);
  }
} 

