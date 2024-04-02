import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountriesService } from './countries.service';
import { combineLatest, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/enviroments/environment';;

@Injectable({
  providedIn: 'root'
})
export class PostReqService {

  constructor(
    private http: HttpClient,
    private countriesService: CountriesService,
    private toast: ToastrService,
  ) { }

  sendRequest() {
    // this.countriesService.setResponseData({
    //   "trip": {
    //     "departure_airport": "IXC",
    //     "arrival_airport": "Yerevan Airport",
    //     "start_date": "2024-03-01",
    //     "end_date": "2024-03-15",
    //     "numbers_of_days": 15,
    //     "travellers": "family",
    //     "trip_duration": 15,
    //     "origin_mode_of_transport": "flying",
    //     "nature_of_trip": "family",
    //     "cities": ["Yerevan", "Gyumri", "Vanadzor", "Sevan"]
    //   },
    //   "itinerary": [
    //     {
    //       "day": 1,
    //       "date": "2024-03-01",
    //       "city_name": "Yerevan",
    //       "cityCode": "EVN",
    //       "cityId": "AM001",
    //       "countryCode": "AM",
    //       "suggested_duration": 3,
    //       "suggested_hotelname": "Armenia Marriott Hotel Yerevan",
    //       "transfer_option": "Private car transfer",
    //       "connections": [],
    //       "activities": [
    //         {
    //           "activity_timeperiod": "afternoon",
    //           "activity_name": "Visit Republic Square",
    //           "image": "republic_square.jpg",
    //           "location": "Republic Square, Yerevan"
    //         },
    //         {
    //           "activity_timeperiod": "evening",
    //           "activity_name": "Enjoy Armenian dinner",
    //           "image": "armenian_dinner.jpg",
    //           "location": "Local restaurant, Yerevan"
    //         },
    //         {
    //           "activity_timeperiod": "evening",
    //           "activity_name": "Explore Cascade Complex",
    //           "image": "cascade_complex.jpg",
    //           "location": "Cascade Complex, Yerevan"
    //         }
    //       ]
    //     },
    //     {
    //       "day": 2,
    //       "date": "2024-03-02",
    //       "city_name": "Yerevan",
    //       "cityCode": "EVN",
    //       "cityId": "AM001",
    //       "countryCode": "AM",
    //       "suggested_duration": 3,
    //       "suggested_hotelname": "Armenia Marriott Hotel Yerevan",
    //       "transfer_option": "Private car transfer",
    //       "connections": [],
    //       "activities": [
    //         {
    //           "activity_timeperiod": "morning",
    //           "activity_name": "Visit Matenadaran",
    //           "image": "matenadaran.jpg",
    //           "location": "Matenadaran, Yerevan"
    //         },
    //         {
    //           "activity_timeperiod": "afternoon",
    //           "activity_name": "Explore Vernissage Market",
    //           "image": "vernissage_market.jpg",
    //           "location": "Vernissage Market, Yerevan"
    //         },
    //         {
    //           "activity_timeperiod": "evening",
    //           "activity_name": "Enjoy traditional Armenian music performance",
    //           "image": "armenian_music.jpg",
    //           "location": "Local venue, Yerevan"
    //         }
    //       ]
    //     },
    //     {
    //       "day": 3,
    //       "date": "2024-03-03",
    //       "city_name": "Yerevan",
    //       "cityCode": "EVN",
    //       "cityId": "AM001",
    //       "countryCode": "AM",
    //       "suggested_duration": 3,
    //       "suggested_hotelname": "Armenia Marriott Hotel Yerevan",
    //       "transfer_option": "Private car transfer",
    //       "connections": [],
    //       "activities": [
    //         {
    //           "activity_timeperiod": "morning",
    //           "activity_name": "Visit Erebuni Fortress",
    //           "image": "erebuni_fortress.jpg",
    //           "location": "Erebuni Fortress, Yerevan"
    //         },
    //         {
    //           "activity_timeperiod": "afternoon",
    //           "activity_name": "Explore Cafesjian Center for the Arts",
    //           "image": "cafesjian_center.jpg",
    //           "location": "Cafesjian Center for the Arts, Yerevan"
    //         },
    //         {
    //           "activity_timeperiod": "evening",
    //           "activity_name": "Dine at a traditional Armenian restaurant",
    //           "image": "armenian_restaurant.jpg",
    //           "location": "Local restaurant, Yerevan"
    //         }
    //       ]
    //     },
    //     {
    //       "day": 4,
    //       "date": "2024-03-04",
    //       "city_name": "Gyumri",
    //       "cityCode": "LWN",
    //       "cityId": "AM002",
    //       "countryCode": "AM",
    //       "suggested_duration": 2,
    //       "suggested_hotelname": "Golden Apricot Hotel",
    //       "transfer_option": "Private car transfer",
    //       "connections": [
    //         {
    //           "mode_of_transport": "flying",
    //           "from_city": "Yerevan",
    //           "to_city": "Gyumri",
    //           "total_duration": "4 hours"
    //         }
    //       ],
    //       "activities": [
    //         {
    //           "activity_timeperiod": "afternoon",
    //           "activity_name": "Explore Gyumri Old Town",
    //           "image": "gyumri_old_town.jpg",
    //           "location": "Gyumri Old Town"
    //         },
    //         {
    //           "activity_timeperiod": "evening",
    //           "activity_name": "Enjoy Gyumri Cuisine",
    //           "image": "gyumri_cuisine.jpg",
    //           "location": "Local restaurant, Gyumri"
    //         }
    //       ]
    //     },
    //     {
    //       "day": 5,
    //       "date": "2024-03-05",
    //       "city_name": "Gyumri",
    //       "cityCode": "LWN",
    //       "cityId": "AM002",
    //       "countryCode": "AM",
    //       "suggested_duration": 2,
    //       "suggested_hotelname": "Golden Apricot Hotel",
    //       "transfer_option": "Private car transfer",
    //       "connections": [],
    //       "activities": [
    //         {
    //           "activity_timeperiod": "morning",
    //           "activity_name": "Visit Mother Armenia Statue",
    //           "image": "mother_armenia_statue.jpg",
    //           "location": "Mother Armenia Statue, Gyumri"
    //         },
    //         {
    //           "activity_timeperiod": "afternoon",
    //           "activity_name": "Explore Gyumri History Museum",
    //           "image": "gyumri_museum.jpg",
    //           "location": "Gyumri History Museum"
    //         },
    //         {
    //           "activity_timeperiod": "evening",
    //           "activity_name": "Attend a local cultural performance",
    //           "image": "local_cultural_performance.jpg",
    //           "location": "Local venue, Gyumri"
    //         }
    //       ]
    //     },
    //     {
    //       "day": 6,
    //       "date": "2024-03-06",
    //       "city_name": "Vanadzor",
    //       "cityCode": "LWN",
    //       "cityId": "AM003",
    //       "countryCode": "AM",
    //       "suggested_duration": 2,
    //       "suggested_hotelname": "Hotel Kirovakan",
    //       "transfer_option": "Private car transfer",
    //       "connections": [
    //         {
    //           "mode_of_transport": "flying",
    //           "from_city": "Gyumri",
    //           "to_city": "Vanadzor",
    //           "total_duration": "3 hours"
    //         }
    //       ],
    //       "activities": [
    //         {
    //           "activity_timeperiod": "afternoon",
    //           "activity_name": "Explore Vanadzor Botanical Garden",
    //           "image": "vanadzor_botanical_garden.jpg",
    //           "location": "Vanadzor Botanical Garden"
    //         },
    //         {
    //           "activity_timeperiod": "evening",
    //           "activity_name": "Dine at a local restaurant",
    //           "image": "local_restaurant_vanadzor.jpg",
    //           "location": "Local restaurant, Vanadzor"
    //         }
    //       ]
    //     },
    //     {
    //       "day": 7,
    //       "date": "2024-03-07",
    //       "city_name": "Vanadzor",
    //       "cityCode": "LWN",
    //       "cityId": "AM003",
    //       "countryCode": "AM",
    //       "suggested_duration": 2,
    //       "suggested_hotelname": "Hotel Kirovakan",
    //       "transfer_option": "Private car transfer",
    //       "connections": [],
    //       "activities": [
    //         {
    //           "activity_timeperiod": "morning",
    //           "activity_name": "Visit Vanadzor Fine Arts Museum",
    //           "image": "vanadzor_fine_arts_museum.jpg",
    //           "location": "Vanadzor Fine Arts Museum"
    //         },
    //         {
    //           "activity_timeperiod": "afternoon",
    //           "activity_name": "Explore Saint Astvatsatsin Church",
    //           "image": "saint_astvatsatsin_church.jpg",
    //           "location": "Saint Astvatsatsin Church, Vanadzor"
    //         },
    //         {
    //           "activity_timeperiod": "evening",
    //           "activity_name": "Attend a local cultural performance",
    //           "image": "local_cultural_performance_vanadzor.jpg",
    //           "location": "Local venue, Vanadzor"
    //         }
    //       ]
    //     },
    //     {
    //       "day": 8,
    //       "date": "2024-03-08",
    //       "city_name": "Sevan",
    //       "cityCode": "EVN",
    //       "cityId": "AM004",
    //       "countryCode": "AM",
    //       "suggested_duration": 3,
    //       "suggested_hotelname": "Best Western Bohemian Resort Sevan",
    //       "transfer_option": "Private car transfer",
    //       "connections": [
    //         {
    //           "mode_of_transport": "flying",
    //           "from_city": "Vanadzor",
    //           "to_city": "Sevan",
    //           "total_duration": "2.5 hours"
    //         }
    //       ],
    //       "activities": [
    //         {
    //           "activity_timeperiod": "afternoon",
    //           "activity_name": "Visit Sevanavank Monastery",
    //           "image": "sevanavank_monastery.jpg",
    //           "location": "Sevanavank Monastery, Sevan"
    //         },
    //         {
    //           "activity_timeperiod": "evening",
    //           "activity_name": "Enjoy a lakeside dinner",
    //           "image": "sevan_lakeside_dinner.jpg",
    //           "location": "Lakeside restaurant, Sevan"
    //         }
    //       ]
    //     },
    //     {
    //       "day": 9,
    //       "date": "2024-03-09",
    //       "city_name": "Sevan",
    //       "cityCode": "EVN",
    //       "cityId": "AM004",
    //       "countryCode": "AM",
    //       "suggested_duration": 3,
    //       "suggested_hotelname": "Best Western Bohemian Resort Sevan",
    //       "transfer_option": "Private car transfer",
    //       "connections": [],
    //       "activities": [
    //         {
    //           "activity_timeperiod": "morning",
    //           "activity_name": "Explore Sevan Lake",
    //           "image": "sevan_lake.jpg",
    //           "location": "Sevan Lake"
    //         },
    //         {
    //           "activity_timeperiod": "afternoon",
    //           "activity_name": "Try water sports activities",
    //           "image": "water_sports_sevan.jpg",
    //           "location": "Sevan Lake"
    //         },
    //         {
    //           "activity_timeperiod": "evening",
    //           "activity_name": "Relax at the hotel spa",
    //           "image": "sevan_spa.jpg",
    //           "location": "Best Western Bohemian Resort Sevan"
    //         }
    //       ]
    //     },
    //     // {
    //     //   "day": 10,
    //     //   "date": "2024-03-10",
    //     //   "city_name": "Yerevan",
    //     //   "cityCode": "EVN",
    //     //   "cityId": "AM001",
    //     //   "countryCode": "AM",
    //     //   "suggested_duration": 3,
    //     //   "suggested_hotelname": "Armenia Marriott Hotel Yerevan",
    //     //   "transfer_option": "Private car transfer",
    //     //   "connections": [
    //     //     {
    //     //       "mode_of_transport": "driving",
    //     //       "from_city": "Sevan",
    //     //       "to_city": "Yerevan",
    //     //       "total_duration": "2 hours"
    //     //     }
    //     //   ],
    //     //   "activities": [
    //     //     {
    //     //       "activity_timeperiod": "afternoon",
    //     //       "activity_name": "Visit Tsitsernakaberd Armenian Genocide Memorial Complex",
    //     //       "image": "tsitsernakaberd_memorial.jpg",
    //     //       "location": "Tsitsernakaberd Memorial Complex, Yerevan"
    //     //     },
    //     //     {
    //     //       "activity_timeperiod": "evening",
    //     //       "activity_name": "Explore Yerevan nightlife",
    //     //       "image": "yerevan_nightlife.jpg",
    //     //       "location": "Various venues, Yerevan"
    //     //     }
    //     //   ]
    //     // },
    //     // {
    //     //   "day": 11,
    //     //   "date": "2024-03-11",
    //     //   "city_name": "Yerevan",
    //     //   "cityCode": "EVN",
    //     //   "cityId": "AM001",
    //     //   "countryCode": "AM",
    //     //   "suggested_duration": 3,
    //     //   "suggested_hotelname": "Armenia Marriott Hotel Yerevan",
    //     //   "transfer_option": "Private car transfer",
    //     //   "connections": [],
    //     //   "activities": [
    //     //     {
    //     //       "activity_timeperiod": "morning",
    //     //       "activity_name": "Visit Garni Temple",
    //     //       "image": "garni_temple.jpg",
    //     //       "location": "Garni Temple, Yerevan"
    //     //     },
    //     //     {
    //     //       "activity_timeperiod": "afternoon",
    //     //       "activity_name": "Explore Geghard Monastery",
    //     //       "image": "geghard_monastery.jpg",
    //     //       "location": "Geghard Monastery, Yerevan"
    //     //     },
    //     //     {
    //     //       "activity_timeperiod": "evening",
    //     //       "activity_name": "Enjoy farewell dinner",
    //     //       "image": "farewell_dinner.jpg",
    //     //       "location": "Fine dining restaurant, Yerevan"
    //     //     }
    //     //   ]
    //     // },
    //     // {
    //     //   "day": 12,
    //     //   "date": "2024-03-12",
    //     //   "city_name": "Yerevan",
    //     //   "cityCode": "EVN",
    //     //   "cityId": "AM001",
    //     //   "countryCode": "AM",
    //     //   "suggested_duration": 3,
    //     //   "suggested_hotelname": "Armenia Marriott Hotel Yerevan",
    //     //   "transfer_option": "Private car transfer",
    //     //   "connections": [],
    //     //   "activities": [
    //     //     {
    //     //       "activity_timeperiod": "morning",
    //     //       "activity_name": "Shopping at Vernissage Market",
    //     //       "image": "vernissage_market_shopping.jpg",
    //     //       "location": "Vernissage Market, Yerevan"
    //     //     },
    //     //     {
    //     //       "activity_timeperiod": "afternoon",
    //     //       "activity_name": "Visit Sergei Parajanov Museum",
    //     //       "image": "sergei_parajanov_museum.jpg",
    //     //       "location": "Sergei Parajanov Museum, Yerevan"
    //     //     },
    //     //     {
    //     //       "activity_timeperiod": "evening",
    //     //       "activity_name": "Enjoy traditional Armenian dance show",
    //     //       "image": "armenian_dance_show.jpg",
    //     //       "location": "Local venue, Yerevan"
    //     //     }
    //     //   ]
    //     // },
    //     // {
    //     //   "day": 13,
    //     //   "date": "2024-03-13",
    //     //   "city_name": "Yerevan",
    //     //   "cityCode": "EVN",
    //     //   "cityId": "AM001",
    //     //   "countryCode": "AM",
    //     //   "suggested_duration": 3,
    //     //   "suggested_hotelname": "Armenia Marriott Hotel Yerevan",
    //     //   "transfer_option": "Private car transfer",
    //     //   "connections": [],
    //     //   "activities": [
    //     //     {
    //     //       "activity_timeperiod": "morning",
    //     //       "activity_name": "Visit Blue Mosque",
    //     //       "image": "blue_mosque.jpg",
    //     //       "location": "Blue Mosque, Yerevan"
    //     //     },
    //     //     {
    //     //       "activity_timeperiod": "afternoon",
    //     //       "activity_name": "Explore Yerevan Brandy Company",
    //     //       "image": "yerevan_brandy.jpg",
    //     //       "location": "Yerevan Brandy Company, Yerevan"
    //     //     },
    //     //     {
    //     //       "activity_timeperiod": "evening",
    //     //       "activity_name": "Enjoy dinner at a local restaurant",
    //     //       "image": "local_dinner_yerevan.jpg",
    //     //       "location": "Local restaurant, Yerevan"
    //     //     }
    //     //   ]
    //     // },
    //     // {
    //     //   "day": 14,
    //     //   "date": "2024-03-14",
    //     //   "city_name": "Yerevan",
    //     //   "cityCode": "EVN",
    //     //   "cityId": "AM001",
    //     //   "countryCode": "AM",
    //     //   "suggested_duration": 3,
    //     //   "suggested_hotelname": "Armenia Marriott Hotel Yerevan",
    //     //   "transfer_option": "Private car transfer",
    //     //   "connections": [],
    //     //   "activities": [
    //     //     {
    //     //       "activity_timeperiod": "morning",
    //     //       "activity_name": "Visit History Museum of Armenia",
    //     //       "image": "history_museum_armenia.jpg",
    //     //       "location": "History Museum of Armenia, Yerevan"
    //     //     },
    //     //     {
    //     //       "activity_timeperiod": "afternoon",
    //     //       "activity_name": "Explore Victory Park and statue of Mother Armenia",
    //     //       "image": "victory_park_yerevan.jpg",
    //     //       "location": "Victory Park, Yerevan"
    //     //     },
    //     //     {
    //     //       "activity_timeperiod": "evening",
    //     //       "activity_name": "Farewell dinner with traditional Armenian cuisine",
    //     //       "image": "farewell_dinner_armenian_cuisine.jpg",
    //     //       "location": "Fine dining restaurant, Yerevan"
    //     //     }
    //     //   ]
    //     // },
    //     // {
    //     //   "day": 15,
    //     //   "date": "2024-03-15",
    //     //   "city_name": "Yerevan",
    //     //   "cityCode": "EVN",
    //     //   "cityId": "AM001",
    //     //   "countryCode": "AM",
    //     //   "suggested_duration": 3,
    //     //   "suggested_hotelname": "Armenia Marriott Hotel Yerevan",
    //     //   "transfer_option": "Private car transfer",
    //     //   "connections": [],
    //     //   "activities": [
    //     //     {
    //     //       "activity_timeperiod": "morning",
    //     //       "activity_name": "Final souvenir shopping",
    //     //       "image": "souvenir_shopping.jpg",
    //     //       "location": "Various shops, Yerevan"
    //     //     },
    //     //     {
    //     //       "activity_timeperiod": "afternoon",
    //     //       "activity_name": "Relaxation time at hotel",
    //     //       "image": "hotel_relaxation.jpg",
    //     //       "location": "Armenia Marriott Hotel Yerevan"
    //     //     },
    //     //     {
    //     //       "activity_timeperiod": "evening",
    //     //       "activity_name": "Departure from Yerevan Airport",
    //     //       "image": "departure_from_airport.jpg",
    //     //       "location": "Yerevan Airport"
    //     //     }
    //     //   ]
    //     // }
    //   ]
    // }
    // );
    // return;

    const storedData = window.sessionStorage.getItem('myData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // const selectedTravelers = JSON.parse(parsedData.selectedTravelers)

      const url = 'https://api.openai.com/v1/chat/completions';
      const openAiKey=environment.OPENAI_API_KEY;
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${openAiKey}`);;
      // .set('Authorization', 'Bearer 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');

      const requestBody = {
        "model": "gpt-3.5-turbo-16k",
        "temperature": 1,
        // "max_tokens": 2000,
        "n": 1,
        "messages": [
          {
            "role": "user",
            "content": `
                    As a travel expert, I am planning a trip for my clients to ${parsedData.selectedCountry} starting from the date ${parsedData.selectedStartDate} and end date is ${parsedData.selectedEndDate}. 
                    My departure airport is ${parsedData.selectedAirport}. The nature of my trip is ${parsedData.selectedNature}. I plan to visit 
                    these cities: ${parsedData.selectedCities}. Hotels to stay in each city should be of ${parsedData.selectedStar} category, property type ${parsedData.selectedProperty} 
                    with Price per night between ${parsedData.selectedPrice} that exists in the city, and is nearest to the city center.
                    Can you build me a detailed daywise itinerary with suggested durations, hotel names, connections, activities as JSON which I can process in my application? 
                                        
                    Provide me JSON as given template: Firstly, the main object contains these keys like trip as an object and itinerary as an array of objects. 
                    The Trip object should have these fields like departure_airport, arrival_airport, start_date, end_date, numbers_of_days, travellers, trip_duration as equal to numbers_of_days, nature_of_trip, 
                    origin_mode_of_transport as flying, train or cruise ship or any best mode of transport from origin to the first destination and cities as an array of strings, including all cities where my clients want 
                    to visit. The structure of the itinerary object is defined as day as a number, date as a string, city_name, cityCode, cityId, countryCode, suggested_duration as the number of days of 
                    stay recommended in a particular city, such that the total_suggested_duration across the cities that is the sum of suggested_duration of each city,  matches to
                    the trip_duration (same for all days in the same city), suggested_hotelname as the name of the property type demanded by the client, transfer_option as the best
                    transfer option from city-airport to suggested_hotelname, connections as an array of objects with the structure as given mode_of_transport as driving, flying, or 
                    cruise ship from one city to another, from_city, to_city, and total_duration of traveling, and activities as an array of objects with the structure of 
                    activity_timeperiod as morning, afternoon, evening, morning-afternoon, afternoon-evening, or morning-evening, activity_name, image, and location of the activity 
                    that will take place. The activities should also include airport_transfers to a particular hotel.Set default values of every key in the object according to 
                    the data type and do not add an extra comma in the objects.Connections should only appear once for each city and represent the transfer/connection from the previous city.
                    `
          }
        ],
      };

      this.http.post(url, requestBody, { headers, reportProgress: true, observe: 'body' })
        .pipe(map(ele => {
          console.log(">>> ", ele);

          return ele
        }))
        .subscribe({
          next: (response) => {

            // response here
            const jsonResponse = response as { choices: { message: { content: string } }[] };   //  JSON response
            console.log(jsonResponse);

            const itineraryStr = jsonResponse.choices[0].message.content;
            // console.log(itineraryStr)
            const itinerary = JSON.parse(itineraryStr)
            this.countriesService.setResponseData(itinerary);

          },
          error: (error) => {
            this.toast.error(`Error Generating Itinerary`);
            console.error(error);
          },
          complete: () => {
            console.log('Request completed');
          }
        });
    }

  }

}
