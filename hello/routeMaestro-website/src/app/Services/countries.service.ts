import { Inject, Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { City } from '../model/city.model';
import * as utils from 'src/utils';
import { Firestore, collection, CollectionReference, DocumentData, onSnapshot, doc, getDoc, Query, orderBy, query, addDoc } from '@angular/fire/firestore';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private responseData = new BehaviorSubject<string>('');
  private selectedCountrySubject = new BehaviorSubject<string>('');
  private selectedMonthSubject = new BehaviorSubject<string>('');
  private selectedDateSubject = new BehaviorSubject<string>('');
  private selectedAirportSubject = new BehaviorSubject<string>('');
  private selectedDaysSubject = new BehaviorSubject<string>('');
  private selectedNatureSubject = new BehaviorSubject<string>('');
  private selectedStarSubject = new BehaviorSubject<string>('');
  private selectedPriceSubject = new BehaviorSubject<string>('');
  private selectedPropertySubject = new BehaviorSubject<string>('');
  private selectedTravelersSubject = new BehaviorSubject<string>('');
  private selectedAdultsSubject = new BehaviorSubject<string>('');
  private selectedChildrenSubject = new BehaviorSubject<string>('');
  private selectedVisaTypeSubject = new BehaviorSubject<string>('');
  private selectedCitiesSubject = new BehaviorSubject<string[]>([]);
  selectedMonth!: string;

  collectionSubject = new BehaviorSubject<any[]>(null)
  collectionRetrieved: boolean = false

  collectionRef!: CollectionReference

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private firestore: Firestore,
  ) { }

  getWindowRef = (): Window => this.doc.defaultView as Window;
  getCollectionRef = (collectionName: string): CollectionReference<DocumentData> => collection(this.firestore, collectionName);

  public get timeoutInterval(): number {
    return 10000;
  }

  setResponseData(data: any) {
    this.responseData.next(data);
  }

  getResponseData(): Observable<any> {
    return this.responseData.asObservable();
  }

  setSelectedCountry(country: string): void {
    this.selectedCountrySubject.next(country);
  }

  getSelectedCountry(): Observable<string> {
    return this.selectedCountrySubject.asObservable();
  }

  setSelectedMonth(month: string): void {
    this.selectedMonthSubject.next(month);
    this.selectedMonth = month;
  }

  getSelectedMonth(): Observable<string> {
    return this.selectedMonthSubject.asObservable();
  }

  setSelectedDate(date: string): void {
    this.selectedDateSubject.next(date);
  }

  getSelectedDate(): Observable<string> {
    return this.selectedDateSubject.asObservable();
  }

  setSelectedAirport(airport: string): void {
    this.selectedAirportSubject.next(airport);
  }

  getSelectedAirport(): Observable<string> {
    return this.selectedAirportSubject.asObservable();
  }

  setSelectedDays(days: string): void {
    this.selectedDaysSubject.next(days);
  }

  getSelectedDays(): Observable<string> {
    return this.selectedDaysSubject.asObservable();
  }

  setSelectedNature(nature: string): void {
    this.selectedNatureSubject.next(nature);
  }

  getSelectedNature(): Observable<string> {
    return this.selectedNatureSubject.asObservable();
  }

  setSelectedStar(star: string): void {
    this.selectedStarSubject.next(star);
  }

  getSelectedStar(): Observable<string> {
    return this.selectedStarSubject.asObservable();
  }

  setSelectedPrice(price: string): void {
    this.selectedPriceSubject.next(price);
  }

  getSelectedPrice(): Observable<string> {
    return this.selectedPriceSubject.asObservable();
  }

  setSelectedProperty(property: string): void {
    this.selectedPropertySubject.next(property);
  }

  getSelectedProperty(): Observable<string> {
    return this.selectedPropertySubject.asObservable();
  }

  setSelectedTravelers(travelers: string) {
    this.selectedTravelersSubject.next(travelers);
  }

  getSelectedTravelers(): Observable<string> {
    return this.selectedTravelersSubject.asObservable();
  }

  setSelectedAdults(adults: string) {
    this.selectedAdultsSubject.next(adults);
  }

  getSelectedAdults(): Observable<string> {
    return this.selectedAdultsSubject.asObservable();
  }

  setSelectedChildren(children: string) {
    this.selectedChildrenSubject.next(children);
  }

  getSelectedChildren(): Observable<string> {
    return this.selectedChildrenSubject.asObservable();
  }

  setSelectedVisaType(visaType: string) {
    this.selectedVisaTypeSubject.next(visaType);
  }

  getSelectedVisaType(): Observable<string> {
    return this.selectedVisaTypeSubject.asObservable();
  }

  setSelectedCities(cities: string[]): void {
    this.selectedCitiesSubject.next(cities);
  }

  getSelectedCities(): Observable<string[]> {
    return this.selectedCitiesSubject.asObservable();
  }

  async getCollections(){
    const unsub = onSnapshot(this.getCollectionRef(utils.RESPONSE_COLLECTION), (snapshot) => {
      this.collectionSubject.next(snapshot.docs.map(e => {
        return e.data()
      }))
      this.getWindowRef().setTimeout(() => unsub, this.timeoutInterval * 6)
    }) 
  }

}
