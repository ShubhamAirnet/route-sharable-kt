const express = require("express");

const app = express();
const cors = require("cors");
const axios = require("axios");

const {db} = require("./firebaseConfig");

var bodyParser = require("body-parser");
const hotelModule = require("./hotels/hotelModule");
const flightModule = require("./flights/flightModule");
const scheduleModule=require("./schedule/schedule")


app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

// app.use(express.json());

app.use("/hotel" ,hotelModule)
app.use("/flight" ,flightModule)
app.use("/schedule", scheduleModule)






// to send mail
app.post('/sendMsg',async(req,res)=>{

    
  const { uid } = req.body;
  const plan=req.body.formValues.plan;
  const days=req.body.formValues.days;
  const email=req.body.formValues.email;
  const password=req.body.formValues.password;
  const name =req.body.formValues.name;
  const currentDate=Date.now();

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
  
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
      timeZone: 'Asia/Kolkata',
    };
  
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  
    return formattedDate;
  }


  const newData={
    start_date:formatTimestamp(currentDate),
    end_date:formatTimestamp(currentDate+days),
    plan: plan==='Free' ? 'plan/free' : plan==='Basic' ? 'plan/basic' ? plan==='Pro' :'plan/pro':'',
    status:'active',
  }

  if (!uid ) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }

  const userDocRef = db.collection('users_login').doc(uid);
  const planCollectionRef = userDocRef.collection('plan');
  const detailsDocRef = planCollectionRef.doc('details');
  
  try {
    // Check if the 'plan' collection exists
    const planCollectionSnapshot = await planCollectionRef.get();
  
    if (planCollectionSnapshot.empty) {
      // If the 'plan' collection doesn't exist, create it
      await planCollectionRef.add({});
      console.log('plan collection created successfully')
  
      // Now, set the data in the 'details' document
      await detailsDocRef.set(newData);
  
      console.log('Plan collection and details document created successfully');
    } else {
      // If the 'plan' collection exists, only update the 'details' document
      await detailsDocRef.set(newData);
  
      console.log('Details document updated successfully');
    }
  } catch (error) {
    console.error('Error creating or updating details:', error);
    // Handle the error as needed
  }

  console.log('Updated Successfully')



  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'routemaestro@gmail.com',
      pass: 'zkxcykgphqpvdkqe'
    }
  });
  
  
  
  var mailOptions = {
    from: 'routemaestro@gmail.com',
    to: email,
    subject: 'Login Credentials',
    text: `Hi ${name},
        Below are your Login credentials for the RouteMaestro ${plan}
        Email : ${email}
        Password: ${password}
        
        Your ${plan} is valid for only ${days} and your account will be deactivated on ${newData.end_date}.
        You can enjoy your ${plan} and use its featured till the ${newData.end_date}
        
        Thanks
        RouteMaestro Team`
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
   
    return res.status(200).json({ message: "Mail Sent Successfully", success: true });
  } catch (error) {

    return res.status(400).send({ message: "Some Error Occurred", success: false });
  }
  
})

// to create order payment links

app.post("/createOrder", (req, res) => {
  console.log(req.body)
  const {form,order_id} = req.body;
  console.log(req.body)

  const date = Date.now();

  let order_expiry_time = new Date(date);

  order_expiry_time.setTime(order_expiry_time.getTime() + 20*60 * 1000);

  const options = {
    method: "POST",
    url: "https://sandbox.cashfree.com/pg/orders",
    headers: {
      accept: "application/json",
      "x-api-version": "2022-09-01",
      "content-type": "application/json",

      // testing mode credentials
      "x-client-id": "28085b84a33b52aabe2231d8058082",
      "x-client-secret": "0b9580593f3dd2488da565ba283f94fe13c4ea4c",
    },
    data: {
      customer_details: {
        customer_id:'11',
        customer_email:form.email,
        customer_phone:''+form.phone,
        customer_name:form.name,
      },
      order_meta: {
        return_url:`http://localhost:4200/success/${order_id}`,
        payment_methods: "cc,dc,nb,upi,paypal,banktransfer",
      },
      order_id:order_id,
      order_amount:form.totalCost,
      order_currency:'INR',
      order_expiry_time, //this is from backend itself
    },
  };

  axios
    .request(options)
    .then((response) => {
      // console.log(response);
      return res.status(200).send({
        success:true,
        message:'Link generated',
        data:response.data
    })
  })
    .catch((error) => {
      console.error(error);
      res.status(401).json({
        message: error.message,
      });
      console.log("hello");
    });
});


app.post('/getPaymentLink',async(req,res)=>{
  console.log(req.body)
  const {form}=req.body
  

const options = {
method: 'POST',
url: 'https://sandbox.cashfree.com/pg/links',
headers: {
  accept: 'application/json',
  'x-api-version': '2022-09-01',
  'content-type': 'application/json',
  'x-client-id': '28085b84a33b52aabe2231d8058082',
  'x-client-secret': '0b9580593f3dd2488da565ba283f94fe13c4ea4c'
},
data: {
  customer_details: {
    customer_phone: form.phone,
    customer_email: form.email,
    customer_name: form.name
  },
  link_notify: {send_sms: true, send_email: true},
  link_id: 'juiuic44'+Date.now(),
  link_currency: 'INR',
  link_amount: form.totalCost,
  link_purpose: 'PAYE'
}
};

axios
.request(options)
.then(function (response) {
  console.log(response.data);
  return res.status(200).send({
      success:true,
      message:'Link generated',
      data:response.data
  })
})
.catch(function (error) {
  console.error(error);
});
})






app.listen(4000, (req, res) => {
  console.log("server is connected to port 4000");
});


