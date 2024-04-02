const express=require('express');
const app=express();

const dotenv=require('dotenv');
dotenv.config();


// for body parsing
app.use(express.json());




app.use()









app.listen(process.env.PORT, (req,res)=>{
    console.log(`Connected to ${process.env.PORT}`)
})