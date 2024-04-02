const express = require("express");
const router = express.Router();
const {db} = require("../firebaseConfig");
const axios = require("axios");

router.post("/getItinerarySchedule",async(req,res)=>{
  const {uid}=req.body
  const itineraryRef = db.collection("response-itinerary").doc(uid);

  try{
    const itinerary = await itineraryRef.get();

    if (itinerary.exists) {
      cities = itinerary.data().cities;

      trip = itinerary.data().trip;

      console.log(cities);
      console.log(trip)
      res.status(200).json({
        cities,trip
      })
    }
    

  }
  catch(err){

    console.log(err);
    res.status(500).json({
      message:"not able to fetch the schedule from the database",
      errorMEssage:err.message
    })

  }


})








module.exports = router;
