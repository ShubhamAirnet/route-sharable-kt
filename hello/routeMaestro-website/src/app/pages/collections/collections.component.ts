import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CountriesService } from 'src/app/Services/countries.service';
import { TripCity } from 'src/app/classes/resForm';


@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  collectionList: TripCity[] = []
  collectionSub: Subscription

  collectionId: string;

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute, 
    private countryService: CountriesService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe((value) => {
      this.collectionId = value.collectionId ?? null
      this.getData(value.collectionId ?? null)      
    }) 
  }

  getData(collectionId: string | null = null){
    if(collectionId === null){
      this.countryService.getCollections()
      this.collectionSub = this.countryService.collectionSubject.subscribe((list) => {
        if(list != null){
          this.collectionList = list
        }
        console.log(this.collectionList)
      })
    } else {
      this.countryService.getCollections()
      this.collectionSub = this.countryService.collectionSubject.subscribe((list) => {
        this.collectionList = list.map(e => e as TripCity)
      })
    }
  }

}
