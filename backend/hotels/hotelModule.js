const express = require("express");
const router = express.Router();
const {db} = require("../firebaseConfig");
const axios = require("axios");
const hotel_details=require('./hotels')
const hotelSample=require('./sampleHotel')
const firebase=require('.././firebaseConfig')
const { getDownloadURL, getStorage } = require('firebase-admin/storage');
const {admin}=require('../firebaseConfig')
const moment = require('moment');
// const serviceAccount = require('../boardthetrip-bc9f0-firebase-adminsdk-2oma4-531279e458.json'); // Replace with the path to your service account key file




router.get("/authenticate", async (req, res) => {
  const payload = {
    ClientId: "ApiIntegrationNew",
    UserName: "Airnet",
    Password: " Airnet@1234",
    EndUserIp: "49.43.88.177",
  };

  try {
    const { data } = await axios.post(
      "http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate",
      payload
    );

    // console.log(data);
    res.status(200).json({
      token: data.TokenId,
    });
  } catch (err) {
    console.log("here is the error in last catch");
    res.status(400).json(err);
  }
});


router.get('/countryList',async(req,res)=>{

    const {tokenId}=req.body;

    const payload = {
        ClientId: "ApiIntegrationNew",
        EndUserIp: "49.43.88.177",
        TokenId:tokenId
    };
    
      try {
        const { data } = await axios.post(
          "http://api.tektravels.com/SharedServices/SharedData.svc/rest/CountryList",
          payload
        );
    
        // console.log(data);
        res.status(200).json({
          data:data.CountryList
        });
      } catch (err) {
        console.log("here is the error in last catch");
        res.status(400).json(err);
      }

})

router.get("/destinationCityList",async(req,res)=>{

    const {tokenId,searchType}=req.body;

    const payload = {
        ClientId: "ApiIntegrationNew",
        EndUserIp: "49.43.88.177",
        TokenId:tokenId,
        SearchType:searchType,
        CountryCode:"IN"
    };

    try {
        const { data } = await axios.post(
          "http://api.tektravels.com/SharedServices/StaticData.svc/rest/GetDestinationSearchStaticData",
          payload
        );
    
        // console.log(data);
        res.status(200).json({
          data:data.Destinations
        });
      } catch (err) {
        console.log("here is the error in last catch");
        res.status(400).json(err);
      }
})

router.get("/topDestinations",async(req,res)=>{

    const {tokenId}=req.body;

    const payload = {
        ClientId: "ApiIntegrationNew",
        EndUserIp: "49.43.88.177",
        TokenId:tokenId,
        CountryCode:"IN"
    };

    
    try {
        const { data } = await axios.post(
          "http://api.tektravels.com/SharedServices/SharedData.svc/rest/TopDestinationList",
          payload
        );
    
        // console.log(data);
        res.status(200).json({
          data:data
        });
      } catch (err) {
        console.log("here is the error in last catch");
        res.status(400).json(err);
      }


})

router.post("/getIternary", async (req, res) => {
  try {
    let hotelData = [];
    const { resultCount, token, docUid } = req.body;
    if (!resultCount || !token || !docUid) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const itineraryRef = db.collection("response-itinerary").doc(docUid);
    // calling this function to set the checkIn dates for the Hotels search request
    await updateCheckInDates(itineraryRef);
    const itinerary = await itineraryRef.get();
    if (!itinerary.exists) {
      return res
        .status(404)
        .json({ success: false, message: "Itinerary not found" });
    }
    const cities = itinerary.data().cities;
    console.log(cities)
    const trip = itinerary.data().trip;
    const NoOfRooms = trip.RoomGuests.length;
    await Promise.all(
      cities.map(async (city) => {
        //  in a particular city
        await Promise.all(
          city.Properties.map(async (item) => {
            // properties of that particular city
            await getHotelSearchData(
              city,
              item.checkInDate,
              item.numberOfNights,
              NoOfRooms,
              resultCount,
              trip.RoomGuests,
              token,
              hotelData
            );
          })
        );
      })
    );
    console.log("JESUS SAVED ME -------------------------------------------------------")
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      fullJourneyHotels: hotelData,
      // count: i,
    });
  } catch (error) {
    console.error("Error in fetching itinerary:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
async function getHotelSearchData(
  city,
  checkInDate,
  NoOfNights,
  NoOfRooms,
  resultCount,
  RoomGuests,
  token,
  hotelData
) {
  try {
    const formattedCheckInDate = moment(checkInDate, "DD/MM/YYYY").format(
      "DD/MM/YYYY"
    );
    const payload = {
      EndUserIp: "49.43.88.155",
      TokenId: token,
      CheckInDate: formattedCheckInDate,
      NoOfNights: NoOfNights,
      CountryCode: city.cityDetails.countryCode,
      CityId: city.cityDetails.cityId,
      PreferredCurrency: "INR",
      GuestNationality: "IN",
      NoOfRooms: NoOfRooms,
      RoomGuests: RoomGuests,
      MaxRating: 5,
      MinRating: 1,
      ResultCount: resultCount,
    };
    // console.log(payload)
    const { data } = await axios.post(
      "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelResult/",
      payload
    );
    if(data) console.log("got data")
    if (!data || !data.HotelSearchResult) {
      console.error("Invalid API response: Missing hotel search data")
      throw new Error("Invalid API response: Missing hotel search data");
    }
    const hotelSearchData = data.HotelSearchResult;
    hotelSearchData.CityName = city.cityDetails.cityName;
   if(hotelSearchData && city && token && checkInDate) console.log("got everything and sent to getAllData" )
  //  console.log(hotelSearchData);
    const cityData = await getAllData(
      hotelSearchData,
      city,
      token,
      checkInDate
    );
    hotelData.push(cityData);
    return hotelData;
  } catch (error) {
    return handleRequestError(error,"In getHotelSearchData");
  }
}
async function getAllData(hotelSearchData, city, token, checkInDate) {
  try {
    let cityData = {};
    let response = [];
    console.log(hotelSearchData)
    if (hotelSearchData.HotelResults) {
      console.log("In if condn")
      await Promise.all(
        hotelSearchData.HotelResults.map(async (item) => {
          try {
            const [info, room] = await Promise.all([
              getHotelInfoData(
                item.ResultIndex,
                item.HotelCode,
                hotelSearchData.TraceId,
                token
              ),
              getHotelRoomInfoData(
                item.ResultIndex,
                item.HotelCode,
                hotelSearchData.TraceId,
                token
              ),
            ]);
            if (!info || !room) {
              // If either info or room data is missing, handle appropriately
              console.error("Hotel info or room data is missing");
              return;
            }
            response.push({
              search: item,
              info: info,
              room: room,
              resultIndex: item.ResultIndex,
              checkInDate: checkInDate,
            });
          } catch (error) {
            console.error(
              "Error fetching hotel info or room data:",
              error.message
            );
            // Handle error appropriately
            return handleRequestError(error);
          }
        })
      );
      console.log("GOT ALL DATA SUCCESSFULLY")
    }
    cityData["cityName"] = city.cityDetails.cityName;
    cityData["Response"] = response;
    cityData["checkInDate"] = checkInDate;
    return cityData;
  } catch (error) {
    console.error("Error in getAllData:", error.message);
    // Handle error appropriately
    return handleRequestError(error,"In getAllData");
  }
}
async function getHotelInfoData(resultIndex, hotelCode, traceId, token) {
  try {
    console.log(" in getHotelInfoData")
    const payload = {
      EndUserIp: "49.43.88.155",
      TokenId: token,
      ResultIndex: resultIndex,
      HotelCode: hotelCode,
      TraceId: traceId,
    };
    const { data } = await axios.post(
      "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelInfo",
      payload
    );
    if(data)console.log("got info data")
    return data;
  } catch (error) {
    console.error("Error fetching hotel info data:", error.message);
    // Handle error appropriately
    return handleRequestError(error,"In getHotelInfoData");
  }
}
async function getHotelRoomInfoData(resultIndex, hotelCode, traceId, token) {
  try {
    console.log("In getHotelRoomInfoData")
    const payload = {
      EndUserIp: "49.43.88.155",
      TokenId: token,
      ResultIndex: resultIndex,
      HotelCode: hotelCode,
      TraceId: traceId,
    };
    const { data } = await axios.post(
      "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelRoom",
      payload
    );
    if(data)console.log("got room data")
    return data;
  } catch (error) {
    console.error("Error fetching hotel room info data:", error.message);
    // Handle error appropriately
    return handleRequestError(error,"In getHotelRoomInfoData");
  }
}
function handleRequestError(error, where) {
  let errorCode = null;
  let errorMessage = "Unknown error occurred";
  // Check if the error has a code
  if (error.ErrorCode !== undefined) {
    errorCode = error.ErrorCode;
  }
  // Handle errors based on their codes
  switch (errorCode) {
    case 0: // NotSet
      errorMessage = "Not set error occurred";
      break;
    case 1: // General
      errorMessage = "General error occurred";
      break;
    case 2: // TechnicalError
      errorMessage = "Technical error occurred";
      break;
    case 3: // InvalidRequest
      errorMessage = "Invalid request error occurred";
      break;
    case 4: // InCorrectUserName
      errorMessage = "Incorrect username error occurred";
      break;
    case 5: // InValidSession
      errorMessage = "Invalid session error occurred";
      break;
    case 6: // InvalidToken
      errorMessage = "Invalid token error occurred";
      break;
    case 14: // Failed
      errorMessage = "Failed error occurred";
      break;
    case 19: // DuplicateBooking
      errorMessage = "Duplicate booking error occurred";
      break;
    case 20: // InSufficientBalance
      errorMessage = "Insufficient balance error occurred";
      break;
    case 23: // SupplierError
      errorMessage = "Supplier error occurred";
      break;
    case 24: // SupplierInteractionFailed
      errorMessage = "Supplier interaction failed error occurred";
      break;
    case 25: // NoResult
      errorMessage = "No result error occurred";
      break;
    case 26: // SourceNotActive
      errorMessage = "Source not active error occurred";
      break;
    case 27: // NoSSRFound
      errorMessage = "No SSR found error occurred";
      break;
    case 28: // SessionInProgress
      errorMessage = "Session in progress error occurred";
      break;
    case 31: // NotConfirmed
      errorMessage = "Not confirmed error occurred";
      break;
    case 35: // ClassNotAvailable
      errorMessage = "Class not available error occurred";
      break;
    default:
      break;
  }
  // Log the error
  console.error(`Request error in ${where}:`, errorMessage);
}










// hotel search
router.post('/hotelSearch',async(req,res)=>{
  
  // const {token,checkInDate,NoOfnights,CountryCode,CityId,NoOfRooms,RoomGuests}=req.body
  const formattedCheckInDate = moment(req.body.CheckInDate, 'YYYY-MM-DD').format('DD/MM/YYYY');

  const payload = {
    EndUserIp:"49.43.88.155",
    TokenId:req.body.TokenId,
    CheckInDate:formattedCheckInDate,
    NoOfNights:req.body.NoOfNights,
    CountryCode:req.body.CountryCode,
    CityId:req.body.CityId,
    PreferredCurrency:"INR",
    GuestNationality:req.body.GuestNationality,
    NoOfRooms:req.body.NoOfRooms,
    RoomGuests:req.body.RoomGuests,
    MaxRating:5,
    MinRating:1,
    ResultCount:req.body.ResultCount
  };
  console.log(payload)
  const hotelData=[]

  try {
    const { data } = await axios.post(
      "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelResult/",
      payload
    );

    const hotelSearchData = data.HotelSearchResult;
    hotelSearchData.CityName = req.body.CityName;
    let city={
      cityDetails:{
        cityName:req.body.CityName
      }
    }
    console.log('in  all data')
    const cityData=await getAllData(hotelSearchData,city,req.body.TokenId,formattedCheckInDate)
    // Return hotelSearchData as an array
    hotelData.push(cityData);

    
    // console.log('hotelData ',hotelData)
    
    return res.status(200).json({
      data:hotelData
    });
  } catch (err) {
    console.log("here is the error in last catch");
    return  res.status(400).json(err);
  }

})

// hotel Info data
router.post('/hotelInfo',async(req,res)=>{
  const {tokenId,traceId,hotelCode,resultIndex}=req.body;

  const payload ={
  
  EndUserIp: "49.43.88.155",
  TokenId: tokenId,
  ResultIndex: resultIndex,
  HotelCode: hotelCode,
  TraceId:traceId
  }

  try{
    const {data}=await axios.post('http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelInfo',payload)
    console.log(data);
    res.status(200).json({
      data:data
    });
  }catch(error){
    console.log("There is the error in last catch");
    res.status(400).json(error);
  }
})

// hotel room info

router.post('/hotelRoomInfo',async(req,res)=>{
  const {tokenId,traceId,resultIndex,hotelCode}=req.body;

  const payload ={
    ResultIndex:resultIndex,
  HotelCode: hotelCode,
  EndUserIp: "49.43.88.155",
  TokenId: tokenId,
  TraceId: traceId
  }

  try{
    console.log(payload)
    const {data}=await axios.post('http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelRoom',payload)
    console.log(data);
    return res.status(200).json({
      data:data
    });
  }catch(error){
    console.log("here is the error in last catch");
    return res.status(400).json(error);
  }
})


            

// hotel static data
router.get('/hotelStaticData',async(req,res)=>{
  const {tokenId}=req.body;

  const payload ={
    CityId: "130443",
  ClientId: "ApiIntegrationNew",
  EndUserIp: "49.43.88.155",
  TokenId: tokenId,
  IsCompactData: "true",
  HotelId: "1011671",
  }

  try{
    const {data}=await axios.post('http://api.tektravels.com/SharedServices/StaticData.svc/rest/GetHotelStaticData',payload)
    console.log(data);
    return res.status(200).json({
      data:data
    });
  }catch(error){
    console.log("here is the error in last catch");
    return res.status(400).json(error);
  }
})

// hotel block room

router.post('/hotelBlockRoom', async (req, res) => {
  const { token, traceId } = req.body;
  const responseArray = [];

  try {
    await Promise.all(Object.values(hotelSample).map(async (hotelArray) => {
      let rooms = [];

      await Promise.all(hotelArray.map(async (hotelObject) => {
        const search = hotelArray[0].search;
        const RoomIndex = hotelObject.room.RoomIndex;
        const RoomTypeCode = hotelObject.room.RoomTypeCode;
        const RoomTypeName = hotelObject.room.RoomTypeName;
        const RatePlanCode = hotelObject.room.RatePlanCode;
        const BedTypes = hotelObject.room.BedTypes;
        const SmokingPreference = hotelObject.room.SmokingPreference;
        const Supplements = hotelObject.room.HotelSupplements;
        const Price = hotelObject.room.Price;

        rooms.push({
          RoomIndex: RoomIndex,
          RoomTypeCode: RoomTypeCode,
          RoomTypeName: RoomTypeName,
          RatePlanCode: RatePlanCode,
          SmokingPreference: SmokingPreference === 'NoPreference' ? 0 : SmokingPreference === 'Smoking' ? 1 : SmokingPreference === 'NonSmoking' ? 2 : 3,
          Price: Price,
          BedTypes: BedTypes
        });
      }));

      const payload = {
        ResultIndex: hotelArray[0].search.ResultIndex,
        HotelCode: hotelArray[0].search.HotelCode,
        HotelName: hotelArray[0].search.HotelName,
        GuestNationality: "IN",
        NoOfRooms: hotelArray.length,
        IsVoucherBooking: "true",
        HotelRoomsDetails: rooms,
        EndUserIp: "49.43.88.155",
        TokenId: token,
        TraceId: hotelArray[0].traceId
      };

      try {
        const { data } = await axios.post('http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/BlockRoom', payload);
        console.log(data);
        responseArray.push(data); // Collect the response
      } catch (error) {
        console.log("Error in axios.post:", error.message);
        // Handle the error if needed, but don't send a response here
      }
    }));
  } catch (outerError) {
    console.log("Error in Promise.all:", outerError.message);
    // Handle the error if needed, but don't send a response here
  }

  return res.status(200).json({
    data: responseArray,
  });
});





// hotel book room
router.post('/hotelBookRoom', async (req, res) => {
  const { token,collection,uid } = req.body;
  let guests;
 

  try {
    const doc = await db.collection(collection).doc(uid).get();

    if (doc.exists) {
      guests = doc.data();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log("Error getting document:", error);
    return res.status(400).json(error);
  }

  const allHotelBookingDetails = [];

  for (const hotelArray of Object.values(hotelSample)) {
    const roomDetails = [];
    let count = 0;

    for (const hotelObject of hotelArray) {
      const hotelPassengers = []; // Initialize hotelPassengers here for each roomObject

      const search = hotelArray[0].search;
      const RoomIndex = hotelObject.room.RoomIndex;
      const RoomTypeCode = hotelObject.room.RoomTypeCode;
      const RoomTypeName = hotelObject.room.RoomTypeName;
      const RatePlanCode = hotelObject.room.RatePlanCode;
      const BedTypes = hotelObject.room.BedTypes;
      const SmokingPreference = hotelObject.room.SmokingPreference;
      const Supplements = hotelObject.room.HotelSupplements;
      const Price = hotelObject.room.Price;
      const totalGuest = hotelObject.NoOfAdults + hotelObject.NoOfChild;

      for (let i = 0; i < totalGuest && count < guests.passengers.length; i++) {
        // Get the date strings and create Date objects
        const dateOfBirth = new Date(guests.passengers[count].personalInfo.DateOfBirth);
        const passportIssueDate = new Date(guests.passengers[count].personalInfo.PassportIssueDate);
        const passportExpiry = new Date(guests.passengers[count].personalInfo.PassportExpiry);
    
        // Format the date strings in the desired format
        const formattedDateOfBirth = dateOfBirth.toISOString().split('T')[0];
        const formattedPassportIssueDate = passportIssueDate.toISOString().split('T')[0];
        const formattedPassportExpiry = passportExpiry.toISOString().split('T')[0];
    
        // Update the personalInfo object with the formatted dates
        guests.passengers[count].personalInfo.DateOfBirth = formattedDateOfBirth;
        guests.passengers[count].personalInfo.PassportIssueDate = formattedPassportIssueDate;
        guests.passengers[count].personalInfo.PassportExpiry = formattedPassportExpiry;
    
        // Push the updated personalInfo to the hotelPassengers array
        hotelPassengers.push(guests.passengers[count].personalInfo);
    
        count++;
    }
    

      const roomObject = {
        RoomIndex: RoomIndex,
        RoomTypeCode: RoomTypeCode,
        RoomTypeName: RoomTypeName,
        RatePlanCode: RatePlanCode,
        SmokingPreference: SmokingPreference === 'NoPreference' ? 0 : SmokingPreference === 'Smoking' ? 1 : SmokingPreference === 'NonSmoking' ? 2 : 3,
        Price: Price,
        BedTypes: BedTypes,
        HotelPassenger: hotelPassengers,
      };
      console.log(hotelPassengers)
      roomDetails.push(roomObject);
      console.log(roomDetails)
      
    }

    const payload = {
      ResultIndex: hotelArray[0].search.ResultIndex,
      HotelCode: hotelArray[0].search.HotelCode,
      HotelName: hotelArray[0].search.HotelName,
      GuestNationality: "IN",
      NoOfRooms: hotelArray.length,
      IsVoucherBooking: "true",
      HotelRoomsDetails: roomDetails,
      EndUserIp: "49.43.88.155",
      TokenId: token,
      TraceId: hotelArray[0].traceId,
    };
    // console.log('payload',payload)
    // console.log('roomdetails',roomDetails)

    try {
      const { data } = await axios.post('http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/Book', payload);
      console.log(data);
      allHotelBookingDetails.push({ data, cityName: hotelArray[0]?.cityName,hotelName:hotelArray[0]?.search?.HotelName });

    } catch (error) {
      console.log("Error in the last catch block:", error.message);
      return res.status(400).json(error);
    }
  }

  // Store hotel booking details array in Firestore
  const itineraryRef = db.collection(collection).doc(uid);
  const existingData = (await itineraryRef.get()).data().hotel_details;
  let existingHotelBookingDetails = existingData && existingData.hotelBookingDetails ? existingData.hotelBookingDetails : [];

  existingHotelBookingDetails = [...allHotelBookingDetails];

  await itineraryRef.update({
    hotel_details:{
      ...hotel_details,
      hotelBookingDetails: existingHotelBookingDetails
    }
    
  });

  return res.status(200).json({
    data: allHotelBookingDetails,
  });
});


router.post('/singleHotelBlockRoom', async (req, res) => {
  
  
  req.body={
    ...req.body,
    EndUserIp:"49.43.88.155"
  }
  console.log(req.body)
  try {
    const { data } = await axios.post('http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/BlockRoom', req.body);
    console.log(data);
    return res.send(data); // Send the response back to the client
  } catch (error) {
    console.log("Error in axios.post:", error.message);
    // Send an error response back to the client
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});
function formatDate(dateString) {
  const originalDateTime = new Date(dateString);
  const newDateTime = new Date("2019-05-21T18:18:00");
  return newDateTime.toISOString();
}

router.post('/singleHotelBookRoom', async (req, res) => {
  const { token, collection, uid, traceId,voucher } = req.body;
  console.log(req.body);
  try {
    const doc = await db.collection(collection).doc(uid).get();

    if (!doc.exists) {
      console.log("No such document!");
      return res.status(404).json({ error: "Document not found" });
    }

    const guests = await doc.data();
    console.log(guests);

    if (!guests || !guests.passengers) {
      console.log("Error: Guests or passengers not found");
      return res.status(400).json({ error: "Invalid guest data" });
    }

    const roomDetails = [];
    const allHotelBookingDetails = [];

    for (const hotelObject of guests.hotel_details.rooms) {
      const hotelPassengers = [];

      const totalGuests = hotelObject.NoOfAdults + hotelObject.NoOfChild;

      for (let i = 0; i < totalGuests; i++) {
        const isPassportValid = guests.passengers[0].personalInfo.PassportExpiry && guests.passengers[0].personalInfo.PassportIssueDate;

        const passenger = guests.passengers[i];
        const formattedPassenger = {
          ...passenger.personalInfo,
          DateOfBirth: new Date(passenger.personalInfo.DateOfBirth).toISOString(),
          ...(isPassportValid ? {
            PassportIssueDate: passenger.personalInfo.PassportIssueDate ? new Date(passenger.personalInfo.PassportIssueDate).toISOString() : null,
            PassportExpiry: passenger.personalInfo.PassportExpiry ? new Date(passenger.personalInfo.PassportExpiry).toISOString() : null,
          } : {})
        };
        console.log(formattedPassenger)
        hotelPassengers.push(formattedPassenger);
      }
      console.log(hotelPassengers)

      const roomObject = {
        RoomIndex: hotelObject.room.RoomIndex,
        RoomTypeCode: hotelObject.room.RoomTypeCode,
        RoomTypeName: hotelObject.room.RoomTypeName,
        RatePlanCode: hotelObject.room.RatePlanCode,
        SmokingPreference: hotelObject.room.SmokingPreference,
        Price: hotelObject.room.Price,
        BedTypes: hotelObject.room.BedTypes,
        HotelPassenger: hotelPassengers,
      };
      console.log(hotelPassengers)

      roomDetails.push(roomObject);
    }
    const payload = {
      ResultIndex: guests.hotel_details.resultIndex,
      HotelCode: guests.hotel_details.hotelCode,
      HotelName: guests.hotel_details.hotelName,
      GuestNationality: guests.trip.nationality,
      NoOfRooms: guests?.hotel_details?.rooms.length,
      IsVoucherBooking: voucher,
      HotelRoomsDetails: roomDetails,
      EndUserIp: "49.43.88.155",
      TokenId: token,
      TraceId: traceId,
    };
    
if (guests.transportData && guests.transportData.ArrivalTransport) {
  const { ArrivalTransport } = guests.transportData;
  if (ArrivalTransport.TransportInfoId && ArrivalTransport.Time && ArrivalTransport.ArrivalTransportType) {
      payload.ArrivalTransport = { ...ArrivalTransport };
      payload.ArrivalTransport.Time = formatDate(payload.ArrivalTransport.Time);
  }
}

if (guests.transportData && guests.transportData.DepartureTransport) {
  const { DepartureTransport } = guests.transportData;
  if (DepartureTransport.TransportInfoId && DepartureTransport.Time && DepartureTransport.DepartureTransportType) {
      payload.DepartureTransport = { ...DepartureTransport };
      payload.DepartureTransport.Time = formatDate(payload.DepartureTransport.Time);
  }
}

    
    console.log(payload);

    const { data } = await axios.post('http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/Book', payload);
    console.log(data)

    if(data.BookResult.Status){
      let status;
     if(data.BookResult.Status===0){
      status="Failed"
     }else if(data.BookResult.Status===1){
      status="Confirmed"
     
     }else if(data.BookResult.Status===3){
      status="VerifyPrice"
     
     }else if(data.BookResult.Status===6){
      status="Cancelled"
     }

     const itineraryRef = db.collection(collection).doc(uid);
     const existingData = (await itineraryRef.get()).data().hotel_details;
    
   
     await itineraryRef.update({
       hotel_details:{
         ...existingData,
         status:status
         
       }
       
     });
    }
  
    if(data.BookResult.Error.ErrorCode===0){
      console.log(data)
      allHotelBookingDetails.push({ data, cityName: guests.trip.cityName, hotelName: guests.hotel_details.hotelName });

    // Store hotel booking details array in Firestore
    const itineraryRef = db.collection(collection).doc(uid);
    const existingData = (await itineraryRef.get()).data().hotel_details;
    let existingHotelBookingDetails = existingData && existingData.hotelBookingDetails ? existingData.hotelBookingDetails : [];
  
    existingHotelBookingDetails = [...existingHotelBookingDetails,...allHotelBookingDetails];
  
    await itineraryRef.update({
      hotel_details: {
        ...existingData,
        hotelBookingDetails: existingHotelBookingDetails,
        
      }
    });
    
    }

    return res.status(200).json({ data: allHotelBookingDetails });
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});



// get voucher 
router.get('/getVoucher',async(req,res)=>{

  const {tokenId,bookingId}=req.body;
  const payload={
    TokenId:tokenId,
    BookingId:bookingId,
    EndUserIp:"49.43.88.155"
  }

  try{
    const {data}=await axios.post('http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GenerateVoucher',payload);
    console.log(data)
    return res.status(200).send({
      data:data})
  }catch(error){
    console.log(error);
  }
})


router.post('/getBookingDetails', async (req, res) => {
  const { tokenId,collection,uid } = req.body;

  const itineraryRef = db.collection(collection).doc(uid);
  let bookingId = [];

  const itineraryData = await itineraryRef.get();
  const hotelBookingDetails = itineraryData.data().hotel_details.hotelBookingDetails || [];

  for (const item of hotelBookingDetails) {
    const payload = {
      TokenId: tokenId,
      BookingId: item.data.BookResult.BookingId,
      EndUserIp: "49.43.88.155",
      // TraceId: item.data.BookResult.TraceId,
    };

    try {
      const { data } = await axios.post('http://api.tektravels.com/BookingEngineService_Hotel/HotelService.svc/rest/GetBookingDetail', payload);
      console.log(data);
      bookingId.push(data)

      // Check if BookingId is present in the response
      if (data.BookingHistory && data.BookingHistory.length > 0 && data.BookingHistory[0].BookingId) {
        // Update item.BookingId
        item.BookingId = data.BookingHistory[0].BookingId;
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  // Update or create the hotelBookingDetails array in Firestore
  await itineraryRef.update({
    hotelBookingDetails: hotelBookingDetails,
  });

  return res.status(200).json({
    message: "Booking details updated successfully",
    bookingId
  });
});




router.post('/sendChangeRequest', async (req, res) => {
  try {
    const { token, requestType, remarks } = req.body;
    const itineraryRef = db.collection("package_data").doc('QNHo0JCIB4bDXBSNqKo9');
    let changeRequestId = [];

    const itineraryData = await itineraryRef.get();
    const hotelBookingDetails = itineraryData.data().hotelBookingDetails || [];

    // Use Promise.all to wait for all async operations to complete
    await Promise.all(hotelBookingDetails.map(async (item) => {
      const payload = {
        EndUserIp: "49.43.88.155",
        TokenId: token,
        BookingId: item.data.BookResult.BookingId,
        RequestType: requestType,
        Remarks: remarks
      };
      
      try {
        const response = await axios.post('http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/SendChangeRequest', payload);
        const responseData = response.data;

        // Check if the response is successful
        if (responseData) {
          changeRequestId.push(responseData);
        } else {
          console.log("API response indicates failure:", responseData);
          // Handle failure if needed
        }

      } catch (error) {
        console.log("Error sending change request:", error.message);
        // Handle errors here if needed
      }
    }));

    console.log(changeRequestId)

    // Update or create the hotelChangeRequestId array in Firestore
    await itineraryRef.update({
      hotelChangeRequestId: changeRequestId
    });

    res.status(200).json({
      data: changeRequestId,
    });
    
  } catch (error) {
    console.log("Server error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/singleSendChangeRequest', async (req, res) => {
  try {
    const { token, requestType, remarks,collection,uid } = req.body;
    const itineraryRef = db.collection(collection).doc(uid);
    let changeRequestId = [];

    const itineraryData = await itineraryRef.get();
    const hotelBookingDetails = itineraryData.data().hotel_details.hotelBookingDetails || [];

    // Use Promise.all to wait for all async operations to complete
    await Promise.all(hotelBookingDetails.map(async (item) => {
      const payload = {
        EndUserIp: "49.43.88.155",
        TokenId: token,
        BookingId: item.data.BookResult.BookingId,
        RequestType: requestType,
        Remarks: remarks
      };
      
      try {
        const response = await axios.post('http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/SendChangeRequest', payload);
        const responseData = response.data;

        // Check if the response is successful
        if (responseData) {
          changeRequestId.push(responseData);
        } else {
          console.log("API response indicates failure:", responseData);
          // Handle failure if needed
        }

      } catch (error) {
        console.log("Error sending change request:", error.message);
        // Handle errors here if needed
      }
    }));

    console.log(changeRequestId)

    // Update or create the hotelChangeRequestId array in Firestore
    await itineraryRef.update({
      hotelChangeRequestId: changeRequestId
    });

    res.status(200).json({
      data: changeRequestId,
    });
    
  } catch (error) {
    console.log("Server error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post('/sendChangeRequestPartial', async (req, res) => {
  try {
    const { token, requestType, remarks,cities } = req.body;
    const itineraryRef = db.collection("package_data").doc('QNHo0JCIB4bDXBSNqKo9');
    let changeRequestId = [];

    const itineraryData = await itineraryRef.get();
    const hotelBookingDetails = itineraryData.data().hotelBookingDetails || [];

    // Use Promise.all to wait for all async operations to complete
    for(let i=0;i<cities.length;i++){
      await Promise.all(hotelBookingDetails.map(async (item) => {
        if(item.cityName===cities[i].cityName && item.hotelName === cities[i].hotelName){
          const payload = {
            EndUserIp: "49.43.88.155",
            TokenId: token,
            BookingId: item.data.BookResult.BookingId,
            RequestType: requestType,
            Remarks: remarks
          };
          console.log(payload)
          
          try {
            const response = await axios.post('http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/SendChangeRequest', payload);
            const responseData = response.data;
    
            // Check if the response is successful
            if (responseData) {
              changeRequestId.push(responseData);
            } else {
              console.log("API response indicates failure:", responseData);
              // Handle failure if needed
            }
    
          } catch (error) {
            console.log("Error sending change request:", error.message);
            // Handle errors here if needed
          }
        }
      }));
    }

    console.log(changeRequestId)

    // Update or create the hotelChangeRequestId array in Firestore
    await itineraryRef.update({
      hotelChangeRequestId: changeRequestId
    });

    res.status(200).json({
      data: changeRequestId,
    });
    
  } catch (error) {
    console.log("Server error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});




router.post('/getChangeRequest', async (req, res) => {
  try {
    const { token } = req.body;
    const itineraryRef = db.collection("package_data").doc('QNHo0JCIB4bDXBSNqKo9');
   
   let changes=[]

    const itineraryData = await itineraryRef.get();
    const hotelChangeRequestId = itineraryData.data().hotelChangeRequestId || [];

    // Use Promise.all to wait for all async operations to complete
    await Promise.all(hotelChangeRequestId.map(async (item) => {
      const payload = {
        EndUserIp:"49.43.88.155",
        TokenId: token,
        ChangeRequestId:item.HotelChangeRequestResult.ChangeRequestId
      };
      console.log(payload)
      try {
        const { data } = await axios.post('http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetChangeRequestStatus/', payload);
        console.log(data);
        changes.push(data)
       

      } catch (error) {
        console.log(error);
        // Handle errors here if needed
      }
    }));

    await itineraryRef.update({
      hotelCancelCharges: changes
    });

    res.status(200).json({
      data: changes,
    });
    
  } catch (error) {
    console.log("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post('/singleGetChangeRequest', async (req, res) => {
  try {
    const { token,collection,uid } = req.body;
    const itineraryRef = db.collection(collection).doc(uid);
   
   let changes=[]

    const itineraryData = await itineraryRef.get();
    const hotelChangeRequestId = itineraryData.data().hotelChangeRequestId || [];

    // Use Promise.all to wait for all async operations to complete
    await Promise.all(hotelChangeRequestId.map(async (item) => {
      const payload = {
        EndUserIp:"49.43.88.155",
        TokenId: token,
        ChangeRequestId:item.HotelChangeRequestResult.ChangeRequestId
      };
      console.log(payload)
      try {
        const { data } = await axios.post('http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetChangeRequestStatus/', payload);
        console.log(data);
        changes.push(data)
       

      } catch (error) {
        console.log(error);
        // Handle errors here if needed
      }
    }));

    await itineraryRef.update({
      hotelCancelCharges: changes
    });

    res.status(200).json({
      data: changes,
    });
    
  } catch (error) {
    console.log("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// save citycode


// const storageRef = getStorage(firebase);





router.get('/getCsvData',async(req,res)=>{
  const csvUrl = 'https://firebasestorage.googleapis.com/v0/b/boardthetrip-bc9f0.appspot.com/o/NewCityListHotel.csv?alt=media&token=574af765-85dd-47b3-a7ad-17513eadc666';
  const csvResponse = await fetch(csvUrl);
  const csvText = await csvResponse.text();

  // Set CORS headers (customize as needed)
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  res.send(csvText);
})


router.post('/updateCityId', async (req, res) => {
  try {
    const { responseId, jsonData } = req.body;
    const itineraryRef = db.collection("response-itinerary").doc(responseId);

    const itineraryData = (await itineraryRef.get()).data();
    console.log(itineraryData);

    // Update the cityId in the local itineraryData object
    itineraryData.cities.forEach((item) => {
      jsonData.forEach((city) => {
       

        
        if (item.cityDetails.CityName!=='New Delhi' && item.cityDetails.cityName === city.DESTINATION && item.cityDetails.countryCode === city.COUNTRYCODE) {
          item.cityDetails.cityId = city.CITYID;
        }else if(item.cityDetails.CityName==='New Delhi' && item.cityDetails.countryCode===city.COUNTRYCODE){
          item.cityDetails.cityId=city.CITYID
        }
      });
    });

    // Now, update the Firestore document with the modified itineraryData
    await itineraryRef.update({ cities: itineraryData.cities });

    return res.send(itineraryData);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
});

module.exports = router;
