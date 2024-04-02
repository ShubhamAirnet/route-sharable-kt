import { Timestamp } from "@angular/fire/firestore";

  export interface ItineraryDay {
    day: number;
    date: string;
    city_name: string;
    suggested_duration: number;
    suggested_hotelname: string;
    connections: any[]; 
    activities: ItineraryActivity[];
  }
  
  export interface TripData {
    itineraryName: string;
    companyName: string;
    responseId:string;
    trip: {
      departure_airport: string;
      arrival_airport: string;
      start_date: string;
      end_date: string;
      numbers_of_days: number;
      travellers: string;
      trip_duration: string;
      nature_of_trip: string;
      cities: string[];
    };
    itinerary: ItineraryDay[];
    createdOn: Timestamp;
  }

export interface TripCity {
  responseId: string;
  itineraryName: string;
  companyName: string;
  createdOn: Date;
  cities: Array<CityData> ;
  trip: {
    departure_airport: string;
    arrival_airport: string;
    start_date: string;
    end_date: string;
    numbers_of_days: number;
    travellers: string;
    trip_duration: string;
    nature_of_trip: string;
    cities: string[];
  };
}

export interface CityData {
  day: number;
  activities: ItineraryActivity[];
  date: string;
  suggested_duration: number;
  suggested_hotelname: string;
  connections: ItineraryConnections[];
  noOfNights: number;
  noOfDays: number;
  noOfProperties: number;
}

export interface ItineraryActivity {
  activity_timeperiod: string;
  activity_timestamp: string;
  activity_name: string;
  image?: string;
  location: string;
}

export interface ItineraryConnections {
  from_city: string;
  mode_of_transport: string;
  to_city: string;
  total_duration: string;
}