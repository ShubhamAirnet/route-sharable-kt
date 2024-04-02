const express = require("express");
const router = express.Router();
const {db} = require("../firebaseConfig");
const axios = require("axios");


const { getDownloadURL } = require('firebase-admin/storage');
const { admin } = require('../firebaseConfig');
const moment=require('moment')


router.get("/authenticate", async (req, res) => {
  const payload = {
    ClientId: "ApiIntegrationNew",
    UserName: "Airnet",
    Password: " Airnet@1234",
    EndUserIp: "49.43.88.155",
  };

  try {
    const { data } = await axios.post(
      "http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate",
      payload
    );

    res.status(200).json({
      token: data.TokenId,
    });
  } catch (err) {
    console.log("here is the error in last catch");
    res.status(400).json(err);
  }
});

// cancel
router.post("/optimizeSearchResults", async (req, res) => {
  const { flightSet } = req.body;

  function isParticularFlightSimilar(flight1, flight2) {
    return (
      flight1.Baggage === flight2.Baggage &&
      flight1.CabinBaggage === flight2.CabinBaggage &&
      flight1.CabinClass === flight2.CabinClass &&
      flight1.Airline.AirlineCode === flight2.Airline.AirlineCode &&
      flight1.Origin.Airport.AirportCode ===
        flight2.Origin.Airport.AirportCode &&
      flight1.Destination.Airport.AirportCode ===
        flight2.Destination.Airport.AirportCode
    );
  }

  function isOneCompleteFlightSimilarFunction(
    oneCompleteFlight1,
    oneCompleteFlight2
  ) {
    let checkingParticularFlight;
    for (let i = 0; i < oneCompleteFlight1.length; i++) {
      checkingParticularFlight = isParticularFlightSimilar(
        oneCompleteFlight1[i],
        oneCompleteFlight2[i]
      );
      if (!checkingParticularFlight) break;
    }

    return checkingParticularFlight;
  }

  function areFlightSetSegmentsSimilar(flightSet1Segments, flightSet2Segments) {
    let isOneCompleteFlightSimilar;

    for (let i = 0; i < flightSet1Segments.length; i++) {
      isOneCompleteFlightSimilar = isOneCompleteFlightSimilarFunction(
        flightSet1Segments[i],
        flightSet2Segments[i]
      );

      if (!isOneCompleteFlightSimilar) break;
    }

    return isOneCompleteFlightSimilar;
  }

  function areFlightSetsSimilar(flightSet1, flightSet2) {
    return (
      flightSet1.fare.PublishedFare === flightSet2.fare.PublishedFare &&
      flightSet1.isRefundable == flightSet2.isRefundable &&
      flightSet1.isLCC === flightSet2.isLCC &&
      flightSet1.segments.length === flightSet2.segments.length &&
      areFlightSetSegmentsSimilar(flightSet1.segments, flightSet2.segments)
    );
  }

  function groupFlights(flights) {
    const groups = {};

    flights.forEach((flight, index) => {
      let foundGroup = false;
      let i = 0;
      // Check if the flight is similar to any existing group
      for (const groupId in groups) {
        console.log(i);
        console.log(groupId);
        const representativeFlight = groups[groupId][0];
        if (areFlightSetsSimilar(representativeFlight, flight)) {
          groups[groupId].push(flight);
          foundGroup = true;
          break;
        }
        i++;
      }

      // If not similar to any existing group, create a new group
      if (!foundGroup) {
        groups[index] = [flight];
      }
    });

    return groups;
  }

  const hello = groupFlights(flightSet);

  console.log(hello);
  if (hello) res.send(hello);
  else res.send("error in getting hello");

  // if(areFlightSetsSimilar(flightSet1,flightSet2)){
  //   res.send(true)
  // }
  // else{
  //   res.send(false)
  // }
});

router.post("/searchMultiStopFlights", async (req, res) => {
  const { itineraryDocName, flightToken } = req.body;

  console.log(itineraryDocName)
  console.log(flightToken)

  // NO NEED OF THIS FUNCTION NOW
  const DateTimeFormatForApi = (date, timePeriod) => {


    // console.log(date,timePeriod,"params of the function")

    const flightMorningTime = "00:00:00";
    const flightAfternoonTime = "00:00:00";
    const flightEveningTime = "00:00:00";
    const flightNightTime = "00:00:00";

    const dateTime = new Date(date);

    if (timePeriod === "morning" ||  timePeriod === "Morning") {
      dateTime.setHours(
        Number(flightAfternoonTime.split(":")[0]) + dateTime.getHours()
      );
      dateTime.setMinutes(
        Number(flightAfternoonTime.split(":")[1]) + dateTime.getMinutes()
      );
      dateTime.setSeconds(
        Number(flightAfternoonTime.split(":")[2]) + dateTime.getSeconds()
      );
    } else if (timePeriod === "afternoon" || timePeriod === "Afternoon" ) {
      dateTime.setHours(
        Number(flightEveningTime.split(":")[0]) + dateTime.getHours()
      );

      dateTime.setMinutes(
        Number(flightEveningTime.split(":")[1]) + dateTime.getMinutes()
      );

      dateTime.setSeconds(
        Number(flightEveningTime.split(":")[2]) + dateTime.getSeconds()
      );
    } else if (timePeriod === "evening" || timePeriod === "Evening") {
      dateTime.setDate(dateTime.getDate() + 1); // Move to the next date
      dateTime.setHours(
        Number(flightNightTime.split(":")[0]) + dateTime.getHours()
      );
      dateTime.setMinutes(
        Number(flightNightTime.split(":")[1]) + dateTime.getMinutes()
      );
      dateTime.setSeconds(
        Number(flightNightTime.split(":")[2]) + dateTime.getSeconds()
      );
    } else if (timePeriod === "night" || timePeriod === "Night" ) {
      console.log("night");

      dateTime.setDate(dateTime.getDate() + 1); // Move to the next date
      dateTime.setHours(
        Number(flightMorningTime.split(":")[0]) + dateTime.getHours()
      );
      dateTime.setMinutes(
        Number(flightMorningTime.split(":")[1]) + dateTime.getMinutes()
      );
      dateTime.setSeconds(
        Number(flightMorningTime.split(":")[2]) + dateTime.getSeconds()
      );
    } else {
      // Handle the case when the timePeriod is not recognized
      return null;
    }

    // console.log("this is in function")
    // console.log(dateTime);
    // Format the date and time as a string in the desired format
    const formattedDateTime = dateTime.toISOString().slice(0, 19);

    // console.log("this is the date we are getting in DateTimeFormatAPi")
    // console.log(formattedDateTime)
    return formattedDateTime;
  };


  const checkNextTimePeriod=(timePeriod)=>{

    if(timePeriod==="morning")return "afternoon"
    else if(timePeriod==="afternoon")return "evening"
    else if (timePeriod==="evening")return "night"
    else if(timePeriod==="night")return "morning"
    else return null
  }

  let cities;
  let trip;
  let segmentsArray = [];
  let timePeriodArray = [];

  const itineraryRef = db.collection("response-itinerary").doc(itineraryDocName);

  try {
    const itinerary = await itineraryRef.get();

    if (itinerary.exists) {
      cities = itinerary.data().cities;

      trip = itinerary.data().trip;

      // console.log(cities);
      // console.log('-----------------------------------------------------------')
      // console.log(trip)

      const initialOriginDateToDepart = trip.start_date;

      const timePeriodOrigin = trip.trip_start_timeperiod;

      timePeriodArray.push(checkNextTimePeriod(trip.trip_start_timeperiod));

      segmentsArray.push({
        Origin: trip.departure_airport,
        Destination: cities[0].cityDetails.cityCode,
        FlightCabinClass: "1",
        PreferredDepartureTime: DateTimeFormatForApi(
          initialOriginDateToDepart,
          timePeriodOrigin
        ),
        PreferredArrivalTime: DateTimeFormatForApi(
          initialOriginDateToDepart,
          timePeriodOrigin
        ),
      });

      // console.log("REACHED SEGMENTS ARRAY BIT")
      // console.log(segmentsArray)

      let i = 0;
      let ourDate = initialOriginDateToDepart;

      cities.forEach((cityObject) => {
        // console.log("CITY OBJECT ===================================================")
        // console.log(cityObject)
        const daysToAdd = cityObject.noOfNights;

        const initialDate = new Date(ourDate);

        const resultDate = new Date(initialDate);
        resultDate.setDate(resultDate.getDate() + daysToAdd);

        // console.log("this is resultdate in loop  ")
        // console.log(resultDate)
        // this is to assign  final date (from this iteration) as initial date (for next iteration).
        ourDate = resultDate;

        let cityLastDayObject = cityObject.days[cityObject.days.length - 1];

        let lastTimePeriod =
          cityLastDayObject.activities[cityLastDayObject.activities.length - 1]
            .activity_timeperiod;

        // timePeriodArray.push(checkNextTimePeriod(lastTimePeriod));

        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        // console.log(DateTimeFormatForApi(
        //   resultDate,
        //   lastTimePeriod
        // ));

        if (i >= cities.length - 1) {
          segmentsArray.push({
            Origin: cityObject.cityDetails.cityCode,
            Destination: trip.departure_airport,
            FlightCabinClass: "1",
            PreferredDepartureTime: DateTimeFormatForApi(
              resultDate,
              lastTimePeriod
            ),
            PreferredArrivalTime: DateTimeFormatForApi(
              resultDate,
              lastTimePeriod
            ),
          });
        } else {
          segmentsArray.push({
            Origin: cityObject.cityDetails.cityCode,
            Destination: cities[i + 1].cityDetails.cityCode,
            FlightCabinClass: "1",
            PreferredDepartureTime: DateTimeFormatForApi(
              resultDate,
              lastTimePeriod
            ),
            PreferredArrivalTime: DateTimeFormatForApi(
              resultDate,
              lastTimePeriod
            ),
          });
          i++;
        }
      });

      // console.log("before payload segments array!")

      // console.log(segmentsArray)

      const payload = {
        EndUserIp: "49.43.88.177",
        TokenId: flightToken,
        AdultCount: trip.travellers.adultCount,
        ChildCount: trip.travellers.childCount.length,
        InfantCount: trip.travellers.infantCount,
        JourneyType: "3",
        Segments: segmentsArray,
      };

      console.log(payload);

      const { data } = await axios.post(
        "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search",
        payload
      );
        console.log(data.FareRules)

      if (data.Response.Error.ErrorCode !== 0) {
        res.status(500).json({
          message: ErrorMessage,
        });
      } 
      else {

        const flightArray = await data.Response.Results[0];
        const traceId = await data.Response.TraceId;

        function sortByOfferedFare(array) {
          if (!Array.isArray(array)) {
              throw new Error("Input is not an array");
          }
      
          return array.slice().sort((a, b) => a.Fare.OfferedFare - b.Fare.OfferedFare);
        }
      
      
        const sortedFlightArray = sortByOfferedFare(flightArray);
      
      


        console.log(flightArray)
        const getAirlineLogos = async (oneCompleteFlight) => {
          try {
            const imageLinks = await Promise.all(oneCompleteFlight.map(async (flight) => {
              return await getImageLink(flight.Airline.AirlineCode);
            }));
        
            // Now 'imageLinks' is an array of download URLs
            // console.log(imageLinks);
            
            return imageLinks
          
          } catch (err) {
            console.error(err);
            // Handle the error appropriately, e.g., send a response or throw an error
            // res.status(500).send('Internal Server Error');
          }
        };


        const getImageLink=async(airlineCode)=>{
          try {
   
            const storage = admin.storage();
            
            const imagesRef = storage.bucket().file(`allAirlinesLogo/${airlineCode}.gif`);
        
            const downloadURL= await getDownloadURL(imagesRef);

            return downloadURL


          } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
          }
        }


        const processFlights = async () => {
          const keyValueArray = [];
        
          // for-each does not work well with async nature , as it does not wait for an itieration to complete
          for (const flight of sortedFlightArray) {
            const airlineLogos = await Promise.all(flight.Segments.map(oneCompleteFlight => getAirlineLogos(oneCompleteFlight)));
        
            keyValueArray.push({
              isRefundable: flight.IsRefundable,
              isLCC: flight.IsLCC,
              resultIndex: flight.ResultIndex,
              fare: flight.Fare,
              segments: flight.Segments,
              penaltyCharges: flight.PenaltyCharges,
              airlineLogos: airlineLogos,
            });
          }
        
          res
          .status(200)
          .json({TraceId:traceId ,flightsData: keyValueArray});
        };
        
        processFlights();

       
      }
    } else {
      res.status(500).json({
        message: "Not able to fetch the flies from Database.",
      });
    }
  } catch (error) {
    res.send(error);
  }
});




//  cancel
router.post("/assigningTimePeriodsToFlightSets", async (req, res) => {
  const { flightsData,timePeriod } = req.body;


  const checkTimeToTimePeriod=(dateTimeString)=>{

    const currDate=new Date(dateTimeString);

    if(currDate.getHours()<=11 && currDate.getHours()>=5){
      return "morning"
    }
    else if(currDate.getHours()<=15 && currDate.getHours()>=12){
      return "afternoon"
    }
    else if(currDate.getHours()<=20 && currDate.getHours()>=16){
      return "evening"
    }
    else if((currDate.getHours()<=23  && currDate.getHours()>=21) || (currDate.getHours()<=4 && currDate.getHours()>=0) ){
      return "night"
    }
    else return null
  }


  const groups = [];
  let x=0;
  flightsData.forEach((flightSet) => {

      let value=false;

      for(let i=0;i<timePeriod.length;i++){
        
        console.log(i +"In for loop i")
        console.log(flightSet.resultIndex);
        console.log( flightSet.segments[2][0].Origin.DepTime);
        console.log(timePeriod[2] + "--->  Yeh wal From DB");
        console.log(checkTimeToTimePeriod(flightSet.segments[2][0].Origin.DepTime) + "---> This is of the curr flightSet");



        if(checkTimeToTimePeriod(flightSet.segments[2][0].Origin.DepTime)===timePeriod[i]){
          console.log("Hello buddy")
          value=true;
        }
        else{
          value=false;
        }

        if(!value)break;

      }

      if(value){
        groups.push(flightSet)
      }
     
    
x++;
  });

  res.send(groups)
});


// common
router.post("/fareRule",async(req,res)=>{

  const {traceId,flightToken,resultIndex}=req.body;

  const payload = {
    EndUserIp: "49.43.88.155",
    TokenId: flightToken,
    TraceId: traceId,
    ResultIndex: resultIndex,
  };

  try {

    console.log(payload)
    const { data } = await axios.post(
      "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareRule",
      payload
    );

    console.log(data)

    return res.status(200).send({ fareRule: data });
  } catch (err) {
    return res.status(400).json(err);
  }



})
// common
router.post("/fareQuote",async(req,res)=>{
 
  const {flightToken,traceId,resultIndex}=req.body
 
  const payload = {
    EndUserIp: "49.43.88.177",
    TokenId: flightToken,
    TraceId: traceId,
    ResultIndex: resultIndex,
  };
  console.log(payload)

  try {
    const { data } = await axios.post(
      "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote",
      payload
    );
      console.log(data)
    return res.status(200).send({fareQuote:data});

  } catch (error) {
    return res.status(400).json(error);
  }
})

// common
router.post("/ssr",async(req,res)=>{


  const {flightToken,traceId,resultIndex}=req.body
 
  const payload = {
    EndUserIp: "49.43.88.177",
    TokenId: flightToken,
    TraceId: traceId,
    ResultIndex: resultIndex,
  };
console.log(payload)
  console.log(payload)
  try {
    const {data}=await axios.post("http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SSR",payload);

    console.log(data)

    return res.status(200).send({ssr:data});
  } catch (error) {
    return res.status(400).json(error);
    
  }

})


// Your route handler file

router.get('/getImageLink', async (req, res) => {
  try {
   
    const storage = admin.storage();
    
    const imagesRef = storage.bucket().file('allAirlinesLogo/0B.gif');

    const downloadURL= await getDownloadURL(imagesRef);

    res.status(200).json({
      url:downloadURL
    })

    // res.send(imagesRef);
    // Rest of your code...
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

function calculateAgeAtEndDate(dob, endDate) {
  const birthDate = new Date(dob);
  const currentDate = new Date(endDate);

  // Calculate the difference in years
  let age = currentDate.getFullYear() - birthDate.getFullYear();

  // Adjust the age if the birthdate hasn't occurred yet this year
  if (currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}


// non lccc flight hold request
router.post('/flightBook', async (req, res) => {
  const { flightToken, traceId, resultIndex,fareQuote,uid ,Origin,Destination,ssr,collection} = req.body;
  let guests = [];

  try {
    const doc = await db.collection(collection).doc(uid).get();

    // const itinerary=await db.collection('Demo_Itinerary').doc('updated_Itinerary').get()

    if (doc.exists) {
      guests = doc.data().passengers;
      // console.log('guests', guests);
    } else {
      console.log("No such document!");
      return res.status(400).json({ error: "No such document" });
    }

    // if(itinerary.exists){
    //   trip=itinerary.data().trip;
    // }else {
    //   console.log("No such document!");
    //   return res.status(400).json({ error: "No such document" });
    // }

    const fareBreakdown = fareQuote;
    
    let adult = {};
    let child = {};
    let infant = {};

    fareBreakdown.forEach((fare) => {
      const newObject = {
        Currency: "INR",
        BaseFare: 0,
        Tax: 0,
        YQTax: 0,
        AdditionalTxnFeePub: 0,
        AdditionalTxnFeeOfrd: 0,
        OtherCharges: 0,
        Discount: 0,
        PublishedFare: 0,
        OfferedFare: 0,
        TdsOnCommission: 0,
        TdsOnPLB: 0,
        TdsOnIncentive: 0,
        ServiceFee: 0
      };
      const passengerType = fare.PassengerType;
      const passengerCount = fare.PassengerCount;
    
      if (passengerType === 1) {
        newObject.BaseFare += fare.BaseFare / passengerCount;
        newObject.Tax += fare.Tax / passengerCount;
        newObject.YQTax += fare.YQTax / passengerCount;
        newObject.AdditionalTxnFeePub += fare.AdditionalTxnFeePub / passengerCount;
        newObject.AdditionalTxnFeeOfrd += fare.AdditionalTxnFeeOfrd / passengerCount;
        newObject.PublishedFare = newObject.BaseFare + newObject.Tax + newObject.YQTax + newObject.AdditionalTxnFeePub + newObject.OtherCharges;
        newObject.OfferedFare = newObject.PublishedFare - newObject.Discount;
        newObject.TdsOnCommission = (newObject.BaseFare + newObject.Tax) * 0.01; // Assuming 1% commission
        newObject.TdsOnPLB = newObject.PublishedFare * 0.02; // Assuming 2% PLB
        newObject.TdsOnIncentive = newObject.OfferedFare * 0.01; // Assuming 1% incentive
        newObject.ServiceFee = 0;
        adult=newObject;
     
      } else if (passengerType === 2) {
        newObject.BaseFare += fare.BaseFare / passengerCount;
        newObject.Tax += fare.Tax / passengerCount;
        newObject.YQTax += fare.YQTax / passengerCount;
        newObject.AdditionalTxnFeePub += fare.AdditionalTxnFeePub / passengerCount;
        newObject.AdditionalTxnFeeOfrd += fare.AdditionalTxnFeeOfrd / passengerCount;
        newObject.PublishedFare = newObject.BaseFare + newObject.Tax + newObject.YQTax + newObject.AdditionalTxnFeePub + newObject.OtherCharges;
        newObject.OfferedFare = newObject.PublishedFare - newObject.Discount;
        newObject.TdsOnCommission = (newObject.BaseFare + newObject.Tax) * 0.01; // Assuming 1% commission
        newObject.TdsOnPLB = newObject.PublishedFare * 0.02; // Assuming 2% PLB
        newObject.TdsOnIncentive = newObject.OfferedFare * 0.01; // Assuming 1% incentive
        newObject.ServiceFee = 0;
        child=newObject;
      }else if (passengerType === 3) {
        newObject.BaseFare += fare.BaseFare / passengerCount;
        newObject.Tax += fare.Tax / passengerCount;
        newObject.YQTax += fare.YQTax / passengerCount;
        newObject.AdditionalTxnFeePub += fare.AdditionalTxnFeePub / passengerCount;
        newObject.AdditionalTxnFeeOfrd += fare.AdditionalTxnFeeOfrd / passengerCount;
        newObject.PublishedFare = newObject.BaseFare + newObject.Tax + newObject.YQTax + newObject.AdditionalTxnFeePub + newObject.OtherCharges;
        newObject.OfferedFare = newObject.PublishedFare - newObject.Discount;
        newObject.TdsOnCommission = (newObject.BaseFare + newObject.Tax) * 0.01; // Assuming 1% commission
        newObject.TdsOnPLB = newObject.PublishedFare * 0.02; // Assuming 2% PLB
        newObject.TdsOnIncentive = newObject.OfferedFare * 0.01; // Assuming 1% incentive
        newObject.ServiceFee = 0;
        infant=newObject;
      }
    });
    
   
    
    // console.log('adult',adult);
    // console.log('child',child);
    // console.log('infant',infant);

    let passengers = [];
    // console.log('guests', guests);

    for (let i = 0; i < guests.length; i++) {
      const { PAN, ...restPersonalInfo } = guests[i].personalInfo;
      const dob = guests[i].personalInfo.Age;
    
      // Format DateOfBirth, PassportIssueDate, and PassportExpiry
      const formattedDateOfBirth = guests[i].personalInfo.DateOfBirth ? new Date(guests[i].personalInfo.DateOfBirth).toISOString() : null;
      const formattedPassportIssueDate = guests[i].personalInfo.PassportIssueDate ? new Date(guests[i].personalInfo.PassportIssueDate).toISOString() : null;
      const formattedPassportExpiry = guests[i].personalInfo.PassportExpiry ? new Date(guests[i].personalInfo.PassportExpiry).toISOString() : null;
    
      
      const isPassportValid = guests[i].personalInfo.PassportExpiry && guests[i].personalInfo.PassportIssueDate;
      const isBaggageValid=guests[i].ssr.extraBaggage ||  guests[i]?.ssr1?.extraBaggage || guests[i]?.ssr2?.extraBaggage
      const isMealValid=guests[i].ssr.meal ||  guests[i]?.ssr1?.meal || guests[i]?.ssr2?.meal
      const isSeatValid=guests[i].ssr.seat ||  guests[i]?.ssr1?.seat || guests[i]?.ssr2?.seat
      if (guests[i].personalInfo.Age >= 12) {
        const combinedObject = {
          ...restPersonalInfo,
          GSTCompanyAddress:'Ludhiana',
          GSTCompanyContactNumber:'9855336721',
          GSTCompanyName:'Airent',
          GSTNumber:'22AAAAA0000A1Z5',
          GSTCompanyEmail:'airent1@gmail.com',
          PaxType: 1,
          Gender: guests[i].personalInfo.Gender === 'Male' ? 1 : 2,
          Fare: adult,
          IsLeadPax: true,
          DateOfBirth: formattedDateOfBirth,
          ...(isPassportValid ? {
            PassportIssueDate: guests[i].personalInfo.PassportIssueDate ? new Date(guests[i].personalInfo.PassportIssueDate).toISOString() : null,
            PassportExpiry: guests[i].personalInfo.PassportExpiry ? new Date(guests[i].personalInfo.PassportExpiry).toISOString() : null,
          } : {}),
          ...(isBaggageValid ? {
            Baggage:ssr===0? [guests[i]?.ssr?.extraBaggage] : ssr===1 ? [guests[i].ssr1?.extraBaggage] : ssr===2 ? [guests[i]?.ssr2?.extraBaggage] : null,

          } : {}),
          ...(isMealValid ? {
            Meal: ssr===0? [guests[i]?.ssr?.meal] : ssr===1 ? [guests[i].ssr1?.meal] : ssr===2 ? [guests[i]?.ssr2?.meal] : null,

          } : {}), 
          ...(isSeatValid ? {
            SeatPreference:ssr===0? guests[i]?.ssr?.seat : ssr===1 ? guests[i].ssr1?.seat : ssr===2 ? guests[i]?.ssr2?.seat : null,

          }:{})
        };
    
        passengers.push(combinedObject);
      } else if (guests[i].personalInfo.Age > 2) {
        const combinedObject = {
          ...restPersonalInfo,
          GSTCompanyAddress:'Ludhiana',
          GSTCompanyContactNumber:'9855336721',
          GSTCompanyName:'Airent',
          GSTNumber:'22AAAAA0000A1Z5',
          GSTCompanyEmail:'airent1@gmail.com',
          GuardianDetails: guests[i].guardianDetails,
          PaxType: 2,
          Gender: guests[i].personalInfo.Gender === 'Male' ? 1 : 2,
          Fare: child,
          IsLeadPax: false,
          DateOfBirth: formattedDateOfBirth,
          ...(isPassportValid ? {
            PassportIssueDate: guests[i].personalInfo.PassportIssueDate ? new Date(guests[i].personalInfo.PassportIssueDate).toISOString() : null,
            PassportExpiry: guests[i].personalInfo.PassportExpiry ? new Date(guests[i].personalInfo.PassportExpiry).toISOString() : null,
          } : {}),
          ...(isBaggageValid ? {
            Baggage:ssr===0? [guests[i]?.ssr?.extraBaggage] : ssr===1 ? [guests[i].ssr1?.extraBaggage] : ssr===2 ? [guests[i]?.ssr2?.extraBaggage] : null,

          } : {}),
          ...(isMealValid ? {
            MealDynamic: ssr===0? [guests[i]?.ssr?.meal] : ssr===1 ? [guests[i].ssr1?.meal] : ssr===2 ? [guests[i]?.ssr2?.meal] : null,

          } : {}), 
          ...(isSeatValid ? {
            SeatDynamic:ssr===0? guests[i]?.ssr?.seat : ssr===1 ? guests[i].ssr1?.seat : ssr===2 ? guests[i]?.ssr2?.seat : null,

          }:{})
        };
    
        passengers.push(combinedObject);
      } else {
        const combinedObject = {
          ...restPersonalInfo,
          GSTCompanyAddress:'Ludhiana',
          GSTCompanyContactNumber:'9855336721',
          GSTCompanyName:'Airent',
          GSTNumber:'22AAAAA0000A1Z5',
          GSTCompanyEmail:'airent1@gmail.com',
          GuardianDetails: guests[i].guardianDetails,
          PaxType: 3,
          Gender: guests[i].personalInfo.Gender === 'Male' ? 1 : 2,
          Fare: infant,
          IsLeadPax: false,
          DateOfBirth: formattedDateOfBirth,
          ...(isPassportValid ? {
            PassportIssueDate: guests[i].personalInfo.PassportIssueDate ? new Date(guests[i].personalInfo.PassportIssueDate).toISOString() : null,
            PassportExpiry: guests[i].personalInfo.PassportExpiry ? new Date(guests[i].personalInfo.PassportExpiry).toISOString() : null,
          } : {}),
          ...(isBaggageValid ? {
            Baggage:ssr===0? [guests[i]?.ssr?.extraBaggage] : ssr===1 ? [guests[i].ssr1?.extraBaggage] : ssr===2 ? [guests[i]?.ssr2?.extraBaggage] : null,

          } : {}),
          ...(isMealValid ? {
            MealDynamic: ssr===0? [guests[i]?.ssr?.meal] : ssr===1 ? [guests[i].ssr1?.meal] : ssr===2 ? [guests[i]?.ssr2?.meal] : null,

          } : {}), 
          ...(isSeatValid ? {
            SeatDynamic:ssr===0? guests[i]?.ssr?.seat : ssr===1 ? guests[i].ssr1?.seat : ssr===2 ? guests[i]?.ssr2?.seat : null,

          }:{})
        };
    
        passengers.push(combinedObject);
      }
    }

    const payload = {
      ResultIndex: resultIndex,
      EndUserIp: "49.43.88.155",
      TokenId: flightToken,
      TraceId: traceId,
      Passengers: passengers,
    };

    console.log(payload);
    try {
      const { data } = await axios.post("http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Book", payload);
    
      console.log(data);
      console.log(data.Response.Response.FlightItinerary);
      if(data.Response.Response.Status){
        let status;
       if(data.Response.Response.Status===1){
        status="Booked"
       }else if(data.Response.Response.Status===2){
        status="Failed"
       
       }else if(data.Response.Response.Status===5){
        status="BookedOther "
       
       }else if(data.Response.Response.Status===6){
        status="NotConfirmed "
       }
      }
    
      // Store BookingId and PNR in Firestore
      if (data && data.Response && data.Response.Response && data.Response?.Error?.ErrorCode===0) {
     
    
        const itineraryRef = db.collection(collection).doc(uid);
        const existingData = (await itineraryRef.get()).data();
        const flightDetails = existingData && existingData.flight_details ? existingData.flight_details : {};
    
        // Ensure booking_details is defined before updating
        const bookingId = data.Response.Response.BookingId;
        const pnr = data.Response.Response.PNR;
        const status = data.Response.Response.Status;
      
        const bookingValue = {
          BookingId: bookingId,
          PNR: pnr,
          Status: status,
          Origin: Origin,
          Destination: Destination
        };
      
        // Ensure bookingDetails is defined before updating
        if (!flightDetails.bookingDetails) {
          flightDetails.bookingDetails = [];
        }
        if(!flightDetails.status){
          flightDetails.status=status
        }
      
        // Check if the booking with the same PNR already exists
        const existingBookingIndex = flightDetails.bookingDetails.findIndex(booking => booking.PNR === pnr);
      
        if (existingBookingIndex !== -1) {
          // If the booking with the same PNR exists, update it
          flightDetails.bookingDetails[existingBookingIndex] = bookingValue;
        } else {
          // If the booking with the same PNR does not exist, add the new booking
          flightDetails.bookingDetails.push(bookingValue);
        }
        await itineraryRef.update({
          flight_details: flightDetails,
        });
    
        return res.status(200).json({ data: data });
      } else {
        console.error("No valid response data from API call.");
        return res.status(400).json({ error: "No valid response data from API call" });
      }
    } catch (error) {
      console.error("Error in API call:", error.message);
      return res.status(400).json({ error: "Error in API call", apiError: error.message });
    }
  } catch (error) {
    console.error("Error getting document:", error.message);
    return res.status(400).json({ error: error.message });
  }
});

// lcc ticket request
router.post('/ticketLCC', async (req, res) => {
  const { flightToken, traceId, resultIndex,fareQuote,uid,Origin,Destination,ssr,collection } = req.body;
  let guests = [];
  
  console.log(req.body)

  try {
    const doc = await db.collection(collection).doc(uid).get();
    if (doc.exists) {
      guests = doc.data().passengers;
      console.log(doc.data())


      // console.log('guests', guests);
    } else {
      console.log("No such document!");
      return res.status(400).json({ error: "No such document" });
    }



  

   
    const fareBreakdown = fareQuote;
    
    let adult = {};
    let child = {};
    let infant = {};

    fareBreakdown.forEach((fare) => {
      const newObject = {
        Currency: "INR",
        BaseFare: 0,
        Tax: 0,
        YQTax: 0,
        AdditionalTxnFeePub: 0,
        AdditionalTxnFeeOfrd: 0,
        OtherCharges: 0,
        Discount: 0,
        PublishedFare: 0,
        OfferedFare: 0,
        TdsOnCommission: 0,
        TdsOnPLB: 0,
        TdsOnIncentive: 0,
        ServiceFee: 0
      };
      const passengerType = fare.PassengerType;
      const passengerCount = fare.PassengerCount;
    
      if (passengerType === 1) {
        newObject.BaseFare += fare.BaseFare / passengerCount;
        newObject.Tax += fare.Tax / passengerCount;
        newObject.YQTax += fare.YQTax / passengerCount;
        newObject.AdditionalTxnFeePub += fare.AdditionalTxnFeePub / passengerCount;
        newObject.AdditionalTxnFeeOfrd += fare.AdditionalTxnFeeOfrd / passengerCount;
        newObject.PublishedFare = newObject.BaseFare + newObject.Tax + newObject.YQTax + newObject.AdditionalTxnFeePub + newObject.OtherCharges;
        newObject.OfferedFare = newObject.PublishedFare - newObject.Discount;
        newObject.TdsOnCommission = (newObject.BaseFare + newObject.Tax) * 0.01; // Assuming 1% commission
        newObject.TdsOnPLB = newObject.PublishedFare * 0.02; // Assuming 2% PLB
        newObject.TdsOnIncentive = newObject.OfferedFare * 0.01; // Assuming 1% incentive
        newObject.ServiceFee = 0;
        adult=newObject;
     
      } else if (passengerType === 2) {
        newObject.BaseFare += fare.BaseFare / passengerCount;
        newObject.Tax += fare.Tax / passengerCount;
        newObject.YQTax += fare.YQTax / passengerCount;
        newObject.AdditionalTxnFeePub += fare.AdditionalTxnFeePub / passengerCount;
        newObject.AdditionalTxnFeeOfrd += fare.AdditionalTxnFeeOfrd / passengerCount;
        newObject.PublishedFare = newObject.BaseFare + newObject.Tax + newObject.YQTax + newObject.AdditionalTxnFeePub + newObject.OtherCharges;
        newObject.OfferedFare = newObject.PublishedFare - newObject.Discount;
        newObject.TdsOnCommission = (newObject.BaseFare + newObject.Tax) * 0.01; // Assuming 1% commission
        newObject.TdsOnPLB = newObject.PublishedFare * 0.02; // Assuming 2% PLB
        newObject.TdsOnIncentive = newObject.OfferedFare * 0.01; // Assuming 1% incentive
        newObject.ServiceFee = 0;
        child=newObject;
      }else if (passengerType === 3) {
        newObject.BaseFare += fare.BaseFare / passengerCount;
        newObject.Tax += fare.Tax / passengerCount;
        newObject.YQTax += fare.YQTax / passengerCount;
        newObject.AdditionalTxnFeePub += fare.AdditionalTxnFeePub / passengerCount;
        newObject.AdditionalTxnFeeOfrd += fare.AdditionalTxnFeeOfrd / passengerCount;
        newObject.PublishedFare = newObject.BaseFare + newObject.Tax + newObject.YQTax + newObject.AdditionalTxnFeePub + newObject.OtherCharges;
        newObject.OfferedFare = newObject.PublishedFare - newObject.Discount;
        newObject.TdsOnCommission = (newObject.BaseFare + newObject.Tax) * 0.01; // Assuming 1% commission
        newObject.TdsOnPLB = newObject.PublishedFare * 0.02; // Assuming 2% PLB
        newObject.TdsOnIncentive = newObject.OfferedFare * 0.01; // Assuming 1% incentive
        newObject.ServiceFee = 0;
        infant=newObject;
      }
    });
    
   
    
    console.log('adult',adult);
    console.log('child',child);
    console.log('infant',infant);
    console.log('guests',guests)

    let passengers = [];
    // console.log('guests', guests);

    for (let i = 0; i < guests.length; i++) {
      const { PAN, ...restPersonalInfo } = guests[i].personalInfo;
      const dob = guests[i].personalInfo.Age;
    
      // Format DateOfBirth, PassportIssueDate, and PassportExpiry
      const formattedDateOfBirth = guests[i].personalInfo.DateOfBirth ? new Date(guests[i].personalInfo.DateOfBirth).toISOString() : null;
      const formattedPassportIssueDate = guests[i].personalInfo.PassportIssueDate ? new Date(guests[i].personalInfo.PassportIssueDate).toISOString() : null;
      const formattedPassportExpiry = guests[i].personalInfo.PassportExpiry ? new Date(guests[i].personalInfo.PassportExpiry).toISOString() : null;
    
      // Validate if PassportExpiry and PassportIssueDate are present
      const isPassportValid = guests[i].personalInfo.PassportExpiry && guests[i].personalInfo.PassportIssueDate;
      const isBaggageValid=guests[i].ssr.extraBaggage ||  guests[i]?.ssr1?.extraBaggage || guests[i]?.ssr2?.extraBaggage
      const isMealValid=guests[i].ssr.meal ||  guests[i]?.ssr1?.meal || guests[i]?.ssr2?.meal
      const isSeatValid=guests[i].ssr.seat ||  guests[i]?.ssr1?.seat || guests[i]?.ssr2?.seat
      if (guests[i].personalInfo.Age >= 12) {
        const combinedObject = {
          ...restPersonalInfo,
          PaxType: 1,
          GSTCompanyAddress:'Ludhiana',
          GSTCompanyContactNumber:'9855336721',
          GSTCompanyName:'Airent',
          GSTNumber:'22AAAAA0000A1Z5',
          GSTCompanyEmail:'airent1@gmail.com',
          Gender: guests[i].personalInfo.Gender === 'Male' ? 1 : 2,
          Fare: adult,
          IsLeadPax: true,
          DateOfBirth: formattedDateOfBirth,
          ...(isPassportValid ? {
            PassportIssueDate: guests[i].personalInfo.PassportIssueDate ? new Date(guests[i].personalInfo.PassportIssueDate).toISOString() : null,
            PassportExpiry: guests[i].personalInfo.PassportExpiry ? new Date(guests[i].personalInfo.PassportExpiry).toISOString() : null,
          } : {}),
          ...(isBaggageValid ? {
            Baggage:ssr===0? [guests[i]?.ssr?.extraBaggage] : ssr===1 ? [guests[i].ssr1?.extraBaggage] : ssr===2 ? [guests[i]?.ssr2?.extraBaggage] : null,

          } : {}),
          ...(isMealValid ? {
            MealDynamic: ssr===0? [guests[i]?.ssr?.meal] : ssr===1 ? [guests[i].ssr1?.meal] : ssr===2 ? [guests[i]?.ssr2?.meal] : null,

          } : {}), 
          ...(isSeatValid ? {
            SeatDynamic:ssr===0? guests[i]?.ssr?.seat : ssr===1 ? guests[i].ssr1?.seat : ssr===2 ? guests[i]?.ssr2?.seat : null,

          }:{})
        };
    
        passengers.push(combinedObject);
      } else if (guests[i].personalInfo.Age > 2) {
        const combinedObject = {
          ...restPersonalInfo,
          GSTCompanyAddress:'Ludhiana',
          GSTCompanyContactNumber:'9855336721',
          GSTCompanyName:'Airent',
          GSTNumber:'22AAAAA0000A1Z5',
          GSTCompanyEmail:'airent1@gmail.com',
          GuardianDetails: guests[i].guardianDetails,
          PaxType: 2,
          Gender: guests[i].personalInfo.Gender === 'Male' ? 1 : 2,
          Fare: child,
          IsLeadPax: false,
          DateOfBirth: formattedDateOfBirth,
          ...(isPassportValid ? {
            PassportIssueDate: guests[i].personalInfo.PassportIssueDate ? new Date(guests[i].personalInfo.PassportIssueDate).toISOString() : null,
            PassportExpiry: guests[i].personalInfo.PassportExpiry ? new Date(guests[i].personalInfo.PassportExpiry).toISOString() : null,
          } : {}),
          ...(isBaggageValid ? {
            Baggage:ssr===0? [guests[i]?.ssr?.extraBaggage] : ssr===1 ? [guests[i].ssr1?.extraBaggage] : ssr===2 ? [guests[i]?.ssr2?.extraBaggage] : null,

          } : {}),
          ...(isMealValid ? {
            MealDynamic: ssr===0? [guests[i]?.ssr?.meal] : ssr===1 ? [guests[i].ssr1?.meal] : ssr===2 ? [guests[i]?.ssr2?.meal] : null,

          } : {}), 
          ...(isSeatValid ? {
            SeatDynamic:ssr===0? guests[i]?.ssr?.seat : ssr===1 ? guests[i].ssr1?.seat : ssr===2 ? guests[i]?.ssr2?.seat : null,

          }:{})
        };
    
        passengers.push(combinedObject);
      }  else {
        const combinedObject = {
          ...restPersonalInfo,
          GuardianDetails: guests[i].guardianDetails,
          GSTCompanyAddress:'Ludhiana',
          GSTCompanyContactNumber:'9855336721',
          GSTCompanyName:'Airent',
          GSTNumber:'22AAAAA0000A1Z5',
          GSTCompanyEmail:'airent1@gmail.com',
          PaxType:3,
          Gender: guests[i].personalInfo.Gender === 'Male' ? 1 : 2,
          Fare: infant,
          IsLeadPax: false,
          DateOfBirth: formattedDateOfBirth,
          ...(isPassportValid ? {
            PassportIssueDate: guests[i].personalInfo.PassportIssueDate ? new Date(guests[i].personalInfo.PassportIssueDate).toISOString() : null,
            PassportExpiry: guests[i].personalInfo.PassportExpiry ? new Date(guests[i].personalInfo.PassportExpiry).toISOString() : null,
          } : {}),
          ...(isBaggageValid ? {
            Baggage:ssr===0? [guests[i]?.ssr?.extraBaggage] : ssr===1 ? [guests[i].ssr1?.extraBaggage] : ssr===2 ? [guests[i]?.ssr2?.extraBaggage] : null,

          } : {}),
          ...(isMealValid ? {
            MealDynamic: ssr===0? [guests[i]?.ssr?.meal] : ssr===1 ? [guests[i].ssr1?.meal] : ssr===2 ? [guests[i]?.ssr2?.meal] : null,

          } : {}), 
          ...(isSeatValid ? {
            SeatDynamic:ssr===0? guests[i]?.ssr?.seat : ssr===1 ? guests[i].ssr1?.seat : ssr===2 ? guests[i]?.ssr2?.seat : null,

          }:{})
        };
    
        passengers.push(combinedObject);
      }
    }

    const payload = {
      ResultIndex: resultIndex,
      EndUserIp: "49.43.88.155",
      TokenId: flightToken,
      TraceId: traceId,
      Passengers: passengers,
    };
    console.log(payload)

    const { data } = await axios.post('http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket', payload);
    console.log(data);
  
    const updatedItineraryRef = db.collection(collection).doc(uid);
    const existingData = (await updatedItineraryRef.get()).data();
    let flightDetails = existingData && existingData.flight_details ? existingData.flight_details : {};
  
// Save Booking Details
    if(data.Response?.Error?.ErrorCode===0){
      if (data.Response && data.Response.Response && data.Response.Response.BookingId && data.Response.Response.PNR) {
        const bookingId = data.Response.Response.BookingId;
        const pnr = data.Response.Response.PNR;
        const status = data.Response.Response.Status;
      
        const bookingValue = {
          BookingId: bookingId,
          PNR: pnr,
          Status: status,
          Origin: Origin,
          Destination: Destination
        };
      
        // Ensure bookingDetails is defined before updating
        if (!flightDetails.bookingDetails) {
          flightDetails.bookingDetails = [];
        }
      
        if (!flightDetails.status) {
          flightDetails.status = "booked"
        }
      
        // Check if the booking with the same PNR already exists
        const existingBookingIndex = flightDetails.bookingDetails.findIndex(booking => booking.PNR === pnr);
      
        if (existingBookingIndex !== -1) {
          // If the booking with the same PNR exists, update it
          flightDetails.bookingDetails[existingBookingIndex] = bookingValue;
        } else {
          // If the booking with the same PNR does not exist, add the new booking
          flightDetails.bookingDetails.push(bookingValue);
        }
      }
      
      // Save Ticket Details
      if (data.Response && data.Response.Response && data.Response.Response.FlightItinerary && data.Response.Response.FlightItinerary.Passenger) {
        const ticketDetails = data.Response.Response.FlightItinerary.Passenger.map(item => ({
          Ticket: item.Ticket,
          firstName: item.FirstName,
          lastName: item.LastName,
          DateOfBirth:item.DateOfBirth,
          Gender:item.Gender,
          Origin: Origin,
          Destination: Destination
        }));
      
        // Ensure ticketDetails is defined before updating
        if (!flightDetails.ticket_details) {
          flightDetails.ticket_details = [];
        }
      
        // Add the new ticket details to the existing ones
        flightDetails.ticket_details = [...flightDetails.ticket_details, ...ticketDetails];
      }
      
      // Update the itinerary with the merged flight details
      await updatedItineraryRef.update({
        flight_details: flightDetails,
      });
    }

// Send the response
res.status(200).json({ success: true, data });

  } catch (error) {
    console.error("Error getting document:", error.message);
    return res.status(400).json({ error: error.message });
  }
});

// non lcc ticket reuqest
router.post('/ticketNonLCC', async (req, res) => {
  try {
    const { flightToken, traceId, uid,Origin,Destination,collection } = req.body;
    let guests = [];
    let bookingDetails;

    const itineraryRef = db.collection(collection).doc(uid);

    // Wait for the promise to resolve
    const doc = await itineraryRef.get();

    if (doc.exists) {
      guests = doc.data().passenger_details;
      bookingDetails = doc.data().flight_details.bookingDetails;
    } else {
      console.log("No such document!");
      return res.status(400).json({ success: false, error: "No such document" });
    }

    const promises = bookingDetails.map(async (item) => {
      try {
        const payload = {
          EndUserIp: "49.43.88.155",
          TokenId: flightToken,
          TraceId: traceId,
          PNR: item.PNR,
          BookingId: item.BookingId,
        };

        const { data } = await axios.post("http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket", payload);
        console.log('nonLcc', data);

        let flightDetails = {}; // Initialize flightDetails as an empty object

      if(data.Response?.Error?.ErrorCode===0){
        if (data?.Response?.Response?.FlightItinerary?.Passenger) {
          const ticketDetails = data.Response.Response.FlightItinerary.Passenger.map(item => ({
              Ticket: item.Ticket,
              firstName: item.FirstName,
              lastName: item.LastName,
              DateOfBirth: item.DateOfBirth,
              Gender: item.Gender,
              Origin: Origin,
              Destination: Destination
          }));
          console.log(ticketDetails);
      
          const updatedItineraryRef = db.collection(collection).doc(uid);
          const existingData = (await updatedItineraryRef.get()).data();
          let flightDetails = existingData && existingData.flight_details ? { ...existingData.flight_details } : {};
      
          // Ensure ticketDetails and bookingDetails are defined before updating
          flightDetails.ticket_details = flightDetails.ticket_details || [];
      
          // Merge the new ticket details with the existing ones
          flightDetails.ticket_details = [...flightDetails.ticket_details, ...ticketDetails];
          flightDetails.status="booked"
      
          await updatedItineraryRef.update({
              flight_details: flightDetails
          });
      }
      
      }
        

        return { success: true, data };
      } catch (error) {
        console.error('An error occurred during ticket booking:', error.message);
        return { success: false, error: error.message };
      }
    });

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    // Send the response after all promises are resolved
    res.status(200).json(results);

  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});



router.post('/getFlightBookingDetails',async(req,res)=>{
  const {flightToken,uid,collection}=req.body;
  const itineraryRef = db.collection(collection).doc(uid);
  let bookingDetails;
  // Wait for the promise to resolve
  const doc = await itineraryRef.get();

  if (doc.exists) {
    guests = doc.data().passengers;
    bookingDetails = doc.data().flight_details.bookingDetails;
  } else {
    console.log("No such document!");
  }

  // Assuming bookingDetails is an array of items
  let flightData=[]
const promises = bookingDetails.map(async (item) => {
  const payload = {
    TokenId: flightToken,
    EndUserIp: "49.43.88.155",
    BookingId: item.BookingId,
    PNR: item.PNR,
  };

  console.log(payload);

  try {
    const { data } = await axios.post(
      'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetBookingDetails',
      payload
    );

    console.log(data);
    flightData.push(data)

    if (data.Response.FlightItinerary.Passenger && data.Response.FlightItinerary.Passenger[0].Ticket) {
      const tickets = data.Response.FlightItinerary.Passenger.map((passenger) => ({
        Ticket: passenger.Ticket,
        firstName: passenger.FirstName,
        lastName: passenger.LastName,
      }));

      return tickets;
    }

    return null;
  } catch (error) {
    console.error(error.message);
    return null;
  }
});

// Wait for all promises to resolve
const ticketDetailsArray = await Promise.all(promises);

// Filter out null results (failed requests)
const validTicketDetails = ticketDetailsArray.filter((tickets) => tickets !== null);

// Update Firestore with ticket details if there are any
if (validTicketDetails.length > 0) {
  const updatedItineraryRef = db.collection(collection).doc(uid);
  const existingData = (await updatedItineraryRef.get()).data();
  const flightDetails = existingData && existingData.flight_details ? existingData.flight_details : {};

  // Assuming you want to concatenate ticket details
  flightDetails.ticket_details = flightDetails.ticket_details ? [...flightDetails.ticket_details, ...validTicketDetails.flat()] : validTicketDetails.flat();

  await updatedItineraryRef.update({
    flight_details: flightDetails,
  });
}

// Respond to the client
return res.send({ message: 'Booking details fetched and ticket details updated successfully.' , flightData});

})

// ----------- CANCELLATION ---------------------

// COMMON
// this method is used to cancel hold bookings
router.post('/releasePNR',async(req,res)=>{
  const {flightToken,uid}=req.body
  const itineraryRef = db.collection("package_data").doc(uid);
  const bookingIds=(await itineraryRef.get()).data().flight_details.bookingDetails;
  const source=fareQuote.Source;

  const releasePNRPromises = bookingIds.map(async (item) => {
    const payload = {
      EndUserIp: "49.43.88.155",
      TokenId: flightToken,
      BookingId: item.BookingId,
      Source: source,
    };
  
    try {
      const { data } = await axios.post(
        'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/ReleasePNRRequest',
        payload
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error; // Propagate the error to Promise.all
    }
  });
  
  try {
    const releasePNRResponses = await Promise.all(releasePNRPromises);
    // Handle the array of releasePNRResponses here
    res.send(releasePNRResponses);
  } catch (error) {
    // Handle errors from any of the promises
    console.error('Error during ReleasePNR requests:', error.message);
    res.status(500).send({ error: 'Internal Server Error' });
  }
  

  

})

// COMMON
// to get the cancellation  charges for lcc flights
router.post('/getCancelCharges',async(req,res)=>{
  const {flightToken,requestType,uid}=req.body
  const itineraryRef = db.collection("package_data").doc(uid);
  const bookingIds=(await itineraryRef.get()).data().flight_details.bookingDetails;

  const cancellationPromises = bookingIds.map(async (bookingId) => {
    const payload = {
      EndUserIp: "49.43.88.155",
      TokenId: flightToken,
      BookingId: bookingId,
      RequestType: requestType,
    };
  
    try {
      const { data } = await axios.post(
        'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetCancellationCharges',
        payload
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error; // Propagate the error to Promise.all
    }
  });
  
  try {
    const cancellationResponses = await Promise.all(cancellationPromises);
    // Handle the array of cancellationResponses here
    res.send(cancellationResponses);
  } catch (error) {
    // Handle errors from any of the promises
    console.error('Error during cancellation requests:', error.message);
    res.status(500).send({ error: 'Internal Server Error' });
  }
  
})


// **************************** PACKAGE CANCELLATION *****************

//for packages to send the cancellation request
router.post('/sendChangeRequest', async (req, res) => {
  try {
    const { flightToken, requestType, cancellationType, remarks,uid } = req.body;
    const itineraryRef = db.collection("package_data").doc(uid);
    
    const itineraryData = await itineraryRef.get();
    const bookingId = itineraryData.data().flight_details.bookingDetails;

    const tickets = itineraryData.data().flight_details.ticket_details.map((item) => {
      return item.TicketId;
    });
    let changeRequestId=[]

    const payload = {
      EndUserIp: "49.43.88.155",
      TokenId: flightToken,
      BookingId: bookingId,
      RequestType: requestType,
      CancellationType: cancellationType,
      Remarks: remarks,
      // TicketId: tickets,
      // Sectors: sectors
    };
    console.log(payload)
    const { data } = await axios.post('http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SendChangeRequest', payload);
    
    console.log(data);
    
    if(data.Response.TicketCRInfo){
      data.Response.TicketCRInfo.map((item)=>{
        changeRequestId.push(item.ChangeRequestId)
      })
      const updatedItineraryRef = db.collection("package_data").doc(uid);
      const existingData = (await updatedItineraryRef.get()).data();
      let flightDetails = existingData && existingData.flight_details ? existingData.flight_details : {};
    
      flightDetails.changeRequestId = changeRequestId;
    
      await updatedItineraryRef.update({
        flight_details: flightDetails
      });
    }


    return res.send(data); // You may want to send the response back to the client

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message); // Handle error and send an appropriate response
  }
});

// for package to send the partial cancellation request
router.post('/sendChangeRequestPartial', async (req, res) => {
  try {
    const { flightToken, requestType, cancellationType, remarks, sectors,uid } = req.body;
    const itineraryRef = db.collection("package_data").doc(uid);
    
    const itineraryData = await itineraryRef.get();
    const bookingId = itineraryData.data().flight_details.bookingDetails.BookingId;

    const tickets = itineraryData.data().flight_details.ticket_details.map((item) => {
      return item.Ticket.TicketId;
    });
    let changeRequestId=[]
     // Create a new array with the desired structure, excluding cityName
    //  const sanitizedSectors = sectors.map(({ Origin, Destination }) => ({ Origin, Destination }));
    const sampleSectors=[{Origin:'ZRH',Destination:'VCE'}]

    const payload = {
      EndUserIp: "49.43.88.155",
      TokenId: flightToken,
      BookingId: bookingId,
      RequestType: requestType,
      CancellationType: cancellationType,
      Remarks: remarks,
      TicketId: tickets,
      Sectors: sampleSectors
    };
    console.log(payload)
    const { data } = await axios.post('http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SendChangeRequest', payload);
    
    console.log(data);
    
    if(data.Response.TicketCRInfo){
      data.Response.TicketCRInfo.map((item)=>{
        changeRequestId.push(item.ChangeRequestId)
      })
      const updatedItineraryRef = db.collection("package_data").doc(uid);
      const existingData = (await updatedItineraryRef.get()).data();
      let flightDetails = existingData && existingData.flight_details ? existingData.flight_details : {};
    
      flightDetails.changeRequestId = changeRequestId;
    
      await updatedItineraryRef.update({
        flight_details: flightDetails
      });
    }


    return res.send(data); // You may want to send the response back to the client

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message); // Handle error and send an appropriate response
  }
});


// ******************************************************


// ------------------SINGLE CANCELLATION ---------------
// for single search TO send the cancellation request
router.post('/singleSendChangeRequest', async (req, res) => {
  try {
    const { flightToken, requestType, cancellationType, remarks,uid,collection } = req.body;
    const itineraryRef = db.collection(collection).doc(uid);
    
    const itineraryData = await itineraryRef.get();
    const bookingId = itineraryData.data().flight_details.bookingDetails;

   
    
    const axiosPromises = bookingId.map(async (item) => {
      const payload = {
          EndUserIp: "49.43.88.155",
          TokenId: flightToken,
          BookingId: item.BookingId,
          RequestType: requestType,
          CancellationType: cancellationType,
          Remarks: remarks,
      };

      const { data } = await axios.post('http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SendChangeRequest', payload);
      console.log(data)
      if (data.Response.TicketCRInfo) {
          const changeRequestIds = data.Response.TicketCRInfo.map((item) => item.ChangeRequestId);
          return changeRequestIds;
      } else {
          return [];
      }
  });

  // Wait for all promises to resolve
  const responses = await Promise.all(axiosPromises);

  // Flatten the array of arrays of change request IDs
  const allChangeRequestIds = responses.flat();

  // Update the database with all change request IDs
  const updatedItineraryRef = db.collection(collection).doc(uid);
  const existingData = (await updatedItineraryRef.get()).data();
  let flightDetails = existingData && existingData.flight_details ? existingData.flight_details : {};

  flightDetails.RequestIds = allChangeRequestIds;

  await updatedItineraryRef.update({
      flight_details: flightDetails
  });


    return res.send(allChangeRequestIds); // You may want to send the response back to the client

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message); // Handle error and send an appropriate response
  }
});


// FOR SINGLE PARTIAL CANCELLATION
router.post('/singleSendChangeRequestPartial', async (req, res) => {
  try {
    const { flightToken, requestType, cancellationType, remarks, sectors, uid, collection } = req.body;

    // Retrieve itinerary data from Firestore
    const sanitizedSectors = sectors.map(({ Origin, Destination }) => ({ Origin, Destination }));
    const itineraryRef = db.collection(collection).doc(uid);
    const itinerarySnapshot = await itineraryRef.get();

    if (!itinerarySnapshot.exists) {
      return res.status(404).send("Itinerary not found");
    }

    const itineraryData = itinerarySnapshot.data();
    const bookingDetails = itineraryData.flight_details.bookingDetails;
    const ticketDetails = itineraryData.flight_details.ticket_details;

    // Extract ticket IDs

    let changeRequestIds = [];

    // Iterate through sectors and process change request for matching tickets
    for (const sector of sanitizedSectors) {
      for (const booking of bookingDetails) {
        if (booking.Origin === sector.Origin && booking.Destination === sector.Destination) {
          const journeyTickets = ticketDetails
          .filter(ticket => ticket.Origin === sector.Origin && ticket.Destination === sector.Destination)
          .map(ticket => ticket.Ticket.TicketId);          
          // Construct payload for change request
          const payload = {
            EndUserIp: "49.43.88.155",
            TokenId: flightToken,
            BookingId: booking.BookingId,
            RequestType: requestType,
            CancellationType: cancellationType,
            Remarks: remarks,
            TicketId: journeyTickets,
            Sectors: sanitizedSectors // Send only the current sector in the payload
          };
          console.log(payload)

          // Make API call to initiate change request
          const response = await axios.post('http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SendChangeRequest', payload);
          
          // Extract and store change request IDs
          if (response.data.Response && response.data.Response.TicketCRInfo) {
            response.data.Response.TicketCRInfo.forEach(item => {
              changeRequestIds.push(item.ChangeRequestId);
            });
          }
        }
      }
    }

    // Update itinerary with change request IDs
    await itineraryRef.update({ flight_details:{
      ...itineraryData.flight_details,
      RequestIds:changeRequestIds
    } });

    // Send response
    return res.json({ changeRequestIds });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --------------------------------------

router.post('/getChangeRequest', async (req, res) => {
  const { flightToken,uid,collection } = req.body;
  const updatedItineraryRef = db.collection(collection).doc(uid);
  const requestId = (await updatedItineraryRef.get()).data().flight_details.RequestIds
  console.log(requestId)
  let responseArray = [];

  // Use map to create an array of Promises
  const requests = requestId.map(async (item) => {
    const payload = {
      EndUserIp: "49.43.88.155",
      TokenId: flightToken,
      ChangeRequestId: item
    };

    try {
      const { data } = await axios.post('http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetChangeRequestStatus', payload);
      console.log(data);
      responseArray.push(data);
    } catch (error) {
      console.log(error);
    }
  });

  try {
    // Wait for all Promises to resolve using Promise.all
    await Promise.all(requests);
    const updatedItineraryRef = db.collection(collection).doc(uid);
    const existingData = (await updatedItineraryRef.get()).data();
    let flightDetails = existingData && existingData.flight_details ? existingData.flight_details : {};
  
    flightDetails.getChangeResponse =responseArray;
  
    await updatedItineraryRef.update({
      flight_details: flightDetails
    });
  
    // Now, all requests have completed, and responseArray is populated
    return res.send(responseArray);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

// TO GET THE AIRPORT CODES FILE LINK
router.get('/airportCodes',async(req,res)=>{
  try {

    const storage = admin.storage();
    
    const imagesRef = storage.bucket().file(`all_country.csv`);

    const downloadURL= await getDownloadURL(imagesRef);

    return res.send(downloadURL)


  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}
)

//  TO GET THE CSV DATA
router.get('/getCsvData',async(req,res)=>{
  const csvUrl = 'https://firebasestorage.googleapis.com/v0/b/boardthetrip-bc9f0.appspot.com/o/Domestic%20City%20Codes.csv?alt=media&token=6baf31b7-ab28-44b7-b4f4-eba66365017b';
  const csvResponse = await fetch(csvUrl);
  const csvText = await csvResponse.text();

  // Set CORS headers (customize as needed)
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  res.send(csvText);
})

// GET THE COUNTRY CODE DATA
router.get('/getCountryData',async(req,res)=>{
  const csvUrl = 'https://firebasestorage.googleapis.com/v0/b/boardthetrip-bc9f0.appspot.com/o/all_country.csv?alt=media&token=3a926be2-531b-44f2-925c-c3c7d468cd30';
  const csvResponse = await fetch(csvUrl);
  const csvText = await csvResponse.text();

  // Set CORS headers (customize as needed)
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  res.send(csvText);
})

// only flight booking



// TO FOMAT DATE ACCORDING TO THE REQUEST PARAMETERS
function formatDate(date) {
  return moment(date, 'YYYY-M-D').format('YYYY-MM-DDTHH:mm:ss');
}


// SEARCH REQUEST FOR SINGLE SEARCH

router.post('/searchflight', async (req, res) => {
  console.log(req.body);

  const formattedSegments = req.body.Segments.map(segment => ({
    ...segment,
    PreferredDepartureTime: formatDate(segment.PreferredDepartureTime),
    PreferredArrivalTime: formatDate(segment.PreferredArrivalTime),
  }));

  // Update the Segments in the request body
  req.body.Segments = formattedSegments;
  console.log(req.body);
  req.body = {
    ...req.body,
    EndUserIp: "49.43.88.155"
  };

  try {
    const search = await axios.post('http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search', req.body);

    // Use JSON.stringify with a replacer function to handle circular references
    const jsonString = JSON.stringify(search, getCircularReplacer());
    // console.log(jsonString);
    // console.log(JSON.parse(jsonString).data);

    if(req.body.JourneyType!==2){
      if (JSON.parse(jsonString).data.Response.Error.ErrorCode !== 0) {
        return res.status(500).json({
          message: ErrorMessage,
        });
      } else {
        const flightArray = await JSON.parse(jsonString).data.Response.Results[0];
        const traceId = await JSON.parse(jsonString).data.Response.TraceId;
        console.log(flightArray)
        function sortByOfferedFare(array) {
          if (!Array.isArray(array)) {
            throw new Error("Input is not an array");
          }
  
          return array.slice().sort((a, b) => a.Fare.OfferedFare - b.Fare.OfferedFare);
        }
       
        const sortedFlightArray = sortByOfferedFare(flightArray);
  
        console.log(sortedFlightArray);
  
        const getAirlineLogos = async (oneCompleteFlight) => {
          try {
            const imageLinks = await Promise.all(oneCompleteFlight.map(async (flight) => {
              return await getImageLink(flight.Airline.AirlineCode);
            }));
  
            // Now 'imageLinks' is an array of download URLs
            // console.log(imageLinks);
            return imageLinks;
          } catch (err) {
            console.error(err);
            // Handle the error appropriately, e.g., send a response or throw an error
            // res.status(500).send('Internal Server Error');
          }
        };
        const getImageLink = async (airlineCode) => {
          try {
            const storage = admin.storage();
            const imagesRef = storage.bucket().file(`allAirlinesLogo/${airlineCode}.gif`);
            const downloadURL = await getDownloadURL(imagesRef);
        
            return downloadURL;
          } catch (err) {
            console.error(`Error fetching image link for airline code ${airlineCode}:`, err);
            // Propagate the error further or handle it appropriately
            throw err;
          }
        };
  
        const processFlights = async () => {
          const keyValueArray = [];
  
          // for-each does not work well with async nature, as it does not wait for an iteration to complete
          for (const flight of sortedFlightArray) {
            
            const airlineLogos = await Promise.all(flight.Segments.map(oneCompleteFlight => getAirlineLogos(oneCompleteFlight)));
  
            keyValueArray.push({
              isRefundable: flight.IsRefundable,
              isLCC: flight.IsLCC,
              resultIndex: flight.ResultIndex,
              fare: flight.Fare,
              segments: flight.Segments,
              penaltyCharges: flight.PenaltyCharges,
              airlineLogos: airlineLogos,
            });
          }
  
          return res
            .status(200)
            .json({ TraceId: traceId, flightsData: keyValueArray });
        };
  
        // Call the processFlights function here
        await processFlights();
      }
    }else if(req.body.JourneyType===2){
      if (JSON.parse(jsonString).data.Response.Error.ErrorCode !== 0) {
        return res.status(500).json({
          message: ErrorMessage,
        });
      } else {
        const flightArray1 = await JSON.parse(jsonString).data.Response.Results[0];
        const flightArray2 = await JSON.parse(jsonString).data.Response.Results[1];
        const traceId = await JSON.parse(jsonString).data.Response.TraceId;
  
        function sortByOfferedFare(array) {
          if (!Array.isArray(array)) {
            throw new Error("Input is not an array");
          }
  
          return array.slice().sort((a, b) => a.Fare.OfferedFare - b.Fare.OfferedFare);
        }
        console.log(flightArray1)
        console.log(flightArray2)
        const sortedFlightArray1 = sortByOfferedFare(flightArray1);
        const sortedFlightArray2 = sortByOfferedFare(flightArray2);
  
        console.log(sortedFlightArray1);
        console.log(sortedFlightArray2);
  
        const getAirlineLogos = async (oneCompleteFlight) => {
          try {
            const imageLinks = await Promise.all(oneCompleteFlight.map(async (flight) => {
              return await getImageLink(flight.Airline.AirlineCode);
            }));
  
            // Now 'imageLinks' is an array of download URLs
            // console.log(imageLinks);
            return imageLinks;
          } catch (err) {
            console.error(err);
            // Handle the error appropriately, e.g., send a response or throw an error
            // res.status(500).send('Internal Server Error');
          }
        };
        const getImageLink = async (airlineCode) => {
          try {
            const storage = admin.storage();
            const imagesRef = storage.bucket().file(`allAirlinesLogo/${airlineCode}.gif`);
            const downloadURL = await getDownloadURL(imagesRef);
        
            return downloadURL;
          } catch (err) {
            console.error(`Error fetching image link for airline code ${airlineCode}:`, err);
            // Propagate the error further or handle it appropriately
            throw err;
          }
        };
  
        const processFlights = async () => {
          const keyValueArray1 = [];
          const keyValueArray2 = [];
        
          // Process sortedFlights1
          for (const flight of sortedFlightArray1) {
            const airlineLogos = await Promise.all(flight.Segments.map(oneCompleteFlight => getAirlineLogos(oneCompleteFlight)));
        
            keyValueArray1.push({
              isRefundable: flight.IsRefundable,
              isLCC: flight.IsLCC,
              resultIndex: flight.ResultIndex,
              fare: flight.Fare,
              segments: flight.Segments,
              penaltyCharges: flight.PenaltyCharges,
              airlineLogos: airlineLogos,
            });
          }
        
          // Process sortedFlights2
          for (const flight of sortedFlightArray2) {
            const airlineLogos = await Promise.all(flight.Segments.map(oneCompleteFlight => getAirlineLogos(oneCompleteFlight)));
        
            keyValueArray2.push({
              isRefundable: flight.IsRefundable,
              isLCC: flight.IsLCC,
              resultIndex: flight.ResultIndex,
              fare: flight.Fare,
              segments: flight.Segments,
              penaltyCharges: flight.PenaltyCharges,
              airlineLogos: airlineLogos,
            });
          }
        
          return res.status(200).json({
            TraceId: traceId,
            flightsData1: keyValueArray1,
            flightsData2: keyValueArray2,
          });
        };
  
        // Call the processFlights function here
        await processFlights();
      }
    }

  } catch (error) {
    console.log(error.message);
    return res.send({ message: 'something went wrong' });
  }
});

// Helper function to handle circular references
function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}


// TO GET THE CALENDAR FARE FOR ONE WAY TRIP
router.post('/calendarFare', async (req, res) => {
  console.log(req.body)
  const formattedSegments = req.body.Segments.map(segment => ({
    ...segment,
    PreferredDepartureTime: formatDate(segment.PreferredDepartureTime),
    PreferredArrivalTime: formatDate(segment.PreferredArrivalTime),
  }));
  req.body.Segments = formattedSegments;
  console.log(req.body);
  req.body = {
    ...req.body,
    EndUserIp: "49.43.88.155"
  };

  try {
    const search = await axios.post('http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetCalendarFare', req.body);

    // Use JSON.stringify with a replacer function to handle circular references
    const jsonString = JSON.stringify(search, getCircularReplacer());
    // console.log(jsonString);
    console.log(JSON.parse(jsonString));
    const data=JSON.parse(jsonString)
    res.status(200).json({ message: 'POST request successful',data });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// TO SEARCH THE FLIGHT FOR THE REISSUANCE CASE
router.post('/searchFlightReissuance', async (req, res) => {
  console.log(req.body);

  const formattedSegments = req.body.Segments.map(segment => ({
    ...segment,
    PreferredDepartureTime: formatDate(segment.PreferredDepartureTime),
    PreferredArrivalTime: formatDate(segment.PreferredArrivalTime),
  }));

  // Update the Segments in the request body
  req.body.Segments = formattedSegments;
  req.body = {
    ...req.body,
    EndUserIp: "49.43.88.155",
    SearchType:1,

  };
  console.log(req.body);

  

  try {
    const search = await axios.post('http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search', req.body);
    console.log(search)
    // Use JSON.stringify with a replacer function to handle circular references
    const jsonString = JSON.stringify(search, getCircularReplacer());
    // console.log(jsonString);
    // console.log(JSON.parse(jsonString).data);

    if(req.body.JourneyType!==2){
      if (JSON.parse(jsonString).data.Response.Error.ErrorCode !== 0) {
        return res.status(500).json({
          message: ErrorMessage,
        });
      } else {
        const flightArray = await JSON.parse(jsonString).data.Response.Results[0];
        const traceId = await JSON.parse(jsonString).data.Response.TraceId;
        console.log(flightArray)
        function sortByOfferedFare(array) {
          if (!Array.isArray(array)) {
            throw new Error("Input is not an array");
          }
  
          return array.slice().sort((a, b) => a.Fare.OfferedFare - b.Fare.OfferedFare);
        }
       
        const sortedFlightArray = sortByOfferedFare(flightArray);
  
        console.log(sortedFlightArray);
  
        const getAirlineLogos = async (oneCompleteFlight) => {
          try {
            const imageLinks = await Promise.all(oneCompleteFlight.map(async (flight) => {
              return await getImageLink(flight.Airline.AirlineCode);
            }));
  
            // Now 'imageLinks' is an array of download URLs
            // console.log(imageLinks);
            return imageLinks;
          } catch (err) {
            console.error(err);
            // Handle the error appropriately, e.g., send a response or throw an error
            // res.status(500).send('Internal Server Error');
          }
        };
        const getImageLink = async (airlineCode) => {
          try {
            const storage = admin.storage();
            const imagesRef = storage.bucket().file(`allAirlinesLogo/${airlineCode}.gif`);
            const downloadURL = await getDownloadURL(imagesRef);
        
            return downloadURL;
          } catch (err) {
            console.error(`Error fetching image link for airline code ${airlineCode}:`, err);
            // Propagate the error further or handle it appropriately
            throw err;
          }
        };
  
        const processFlights = async () => {
          const keyValueArray = [];
  
          // for-each does not work well with async nature, as it does not wait for an iteration to complete
          for (const flight of sortedFlightArray) {
            
            const airlineLogos = await Promise.all(flight.Segments.map(oneCompleteFlight => getAirlineLogos(oneCompleteFlight)));
  
            keyValueArray.push({
              isRefundable: flight.IsRefundable,
              isLCC: flight.IsLCC,
              resultIndex: flight.ResultIndex,
              fare: flight.Fare,
              segments: flight.Segments,
              penaltyCharges: flight.PenaltyCharges,
              airlineLogos: airlineLogos,
            });
          }
  
          return res
            .status(200)
            .json({ TraceId: traceId, flightsData: keyValueArray });
        };
  
        // Call the processFlights function here
        await processFlights();
      }
    }else if(req.body.JourneyType===2){
      if (JSON.parse(jsonString).data.Response.Error.ErrorCode !== 0) {
        return res.status(500).json({
          message: ErrorMessage,
        });
      } else {
        const flightArray1 = await JSON.parse(jsonString).data.Response.Results[0];
        const flightArray2 = await JSON.parse(jsonString).data.Response.Results[1];
        const traceId = await JSON.parse(jsonString).data.Response.TraceId;
  
        function sortByOfferedFare(array) {
          if (!Array.isArray(array)) {
            throw new Error("Input is not an array");
          }
  
          return array.slice().sort((a, b) => a.Fare.OfferedFare - b.Fare.OfferedFare);
        }
        console.log(flightArray1)
        console.log(flightArray2)
        const sortedFlightArray1 = sortByOfferedFare(flightArray1);
        const sortedFlightArray2 = sortByOfferedFare(flightArray2);
  
        console.log(sortedFlightArray1);
        console.log(sortedFlightArray2);
  
        const getAirlineLogos = async (oneCompleteFlight) => {
          try {
            const imageLinks = await Promise.all(oneCompleteFlight.map(async (flight) => {
              return await getImageLink(flight.Airline.AirlineCode);
            }));
  
            // Now 'imageLinks' is an array of download URLs
            // console.log(imageLinks);
            return imageLinks;
          } catch (err) {
            console.error(err);
            // Handle the error appropriately, e.g., send a response or throw an error
            // res.status(500).send('Internal Server Error');
          }
        };
        const getImageLink = async (airlineCode) => {
          try {
            const storage = admin.storage();
            const imagesRef = storage.bucket().file(`allAirlinesLogo/${airlineCode}.gif`);
            const downloadURL = await getDownloadURL(imagesRef);
        
            return downloadURL;
          } catch (err) {
            console.error(`Error fetching image link for airline code ${airlineCode}:`, err);
            // Propagate the error further or handle it appropriately
            throw err;
          }
        };
  
        const processFlights = async () => {
          const keyValueArray1 = [];
          const keyValueArray2 = [];
        
          // Process sortedFlights1
          for (const flight of sortedFlightArray1) {
            const airlineLogos = await Promise.all(flight.Segments.map(oneCompleteFlight => getAirlineLogos(oneCompleteFlight)));
        
            keyValueArray1.push({
              isRefundable: flight.IsRefundable,
              isLCC: flight.IsLCC,
              resultIndex: flight.ResultIndex,
              fare: flight.Fare,
              segments: flight.Segments,
              penaltyCharges: flight.PenaltyCharges,
              airlineLogos: airlineLogos,
            });
          }
        
          // Process sortedFlights2
          for (const flight of sortedFlightArray2) {
            const airlineLogos = await Promise.all(flight.Segments.map(oneCompleteFlight => getAirlineLogos(oneCompleteFlight)));
        
            keyValueArray2.push({
              isRefundable: flight.IsRefundable,
              isLCC: flight.IsLCC,
              resultIndex: flight.ResultIndex,
              fare: flight.Fare,
              segments: flight.Segments,
              penaltyCharges: flight.PenaltyCharges,
              airlineLogos: airlineLogos,
            });
          }
        
          return res.status(200).json({
            TraceId: traceId,
            flightsData1: keyValueArray1,
            flightsData2: keyValueArray2,
          });
        };
  
        // Call the processFlights function here
        await processFlights();
      }
    }

  } catch (error) {
    console.log(error.message);
    return res.send({ message: 'something went wrong' });
  }
});

module.exports = router;
