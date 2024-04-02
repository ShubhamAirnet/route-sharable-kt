import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ItineraryServiceService } from 'src/app/Services/itinerary-service/itinerary-service.service';
import { PackageService } from 'src/app/Services/package/package.service';
import { UrlShortenerService } from 'src/app/Services/url-shorten/url-shortener.service';
@Component({
  selector: 'app-itinerary-preview',
  templateUrl: './itinerary-preview.component.html',
  styleUrls: ['./itinerary-preview.component.scss']
})
export class ItineraryPreviewComponent implements OnInit {
  travelData:any
  responseId:string

  constructor(private itinerary:ItineraryServiceService,private toastr: ToastrService, private route: ActivatedRoute,private short:UrlShortenerService,private pack:PackageService) { }

  ngOnInit(): void {
    // this.shortenUrl()
    
    this.route.params.subscribe((params) => {
      this.responseId = params.id;
      if(this.responseId){
        this.getData(this.responseId)
      }
    })
  }

  showToast() {
    this.toastr.success('Your response has been acknowledged');
  }

  acceptBtn(){
    this.updateStatus(this.responseId,'accepted')
    this.showToast()

  }
  changeBtn(){
    this.updateStatus(this.responseId,'wantsToChange')
    this.showToast()
  }
  async updateStatus(uid:string,status:string){
    try{
      const res=await this.pack.updateStatus(uid,status)
      console.log(res)

    }catch(error){
      console.log(error.message)
    }
  }
  async getData(responseId:string){
    try{
      const res=await this.itinerary.getAllData(responseId);
      console.log(res)
      this.travelData=res
    }catch(error){
      console.log(error)
    }
  }


  // async shortenUrl(){
  //   try{
  //     const res=await this.short.shorten('http://localhost:4200/itinerary-preview/4LNQFdJhRjiMmBwN8pCI');
  //     console.log(res)
  //   }catch(error){
  //     console.log(error)
  //   }
  // }


}
