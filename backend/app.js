const express = require('express');
const mongoose = require('mongoose')
const User = require("./Routes/user-routes")
const Admin =require ("./Routes/adminRoute")
const cookieParser =require('cookie-parser')
const cors=require('cors');
require('dotenv').config();

const app=express();
app.use(cors({credentials:true,origin:"http://localhost:3000"}));
app.use(cookieParser());
// now we can use the cokkie parser in our application
app.use(express.json());



app.use('/user',User)
app.use('/admin',Admin)

mongoose.connect("mongodb+srv://mishalnunu:nazrin@cluster0.c1hh3mj.mongodb.net/test").then(()=>{
 app.listen(5000);
 console.log("Database is connected! Listening to localhost 5000 ") 
}).catch((err)=>{
  console.log(err)
})




