import { Component, Input, OnInit } from '@angular/core';
import { HotelsService } from 'src/app/Services/hotels_api/hotels.service';

@Component({
  selector: 'app-route-overview',
  templateUrl: './route-overview.component.html',
  styleUrls: ['./route-overview.component.scss']
})
export class RouteOverviewComponent implements OnInit {

  @Input() travelData:any;
  constructor(private hotels:HotelsService) { }

  ngOnInit(): void {
  }

  async getData() {
    console.log('fetching');
    
    try {
      const res = await this.hotels.getSearchInfo();
      console.log(res);
  
      if (res) {
        this.travelData = res;
        
       

        
        console.log(this.travelData);
        
        
      } else {
        console.log("No data received from getSearchInfo");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
