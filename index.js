require("dotenv").config();


//framework
const express = require("express");
const mongoose = require("mongoose");

//Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

//init express
const shapeAI = express();

//config
shapeAI.use(express.json());

//Establish database connection
mongoose.connect(process.env.MONGO_URL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}).then(()=> console.log("connection established!!!!!"));

//Init Microservices
shapeAI.use("/book",Books);
shapeAI.use("/author",Authors);
shapeAI.use("/publication",Publications);

shapeAI.listen(3000, () => console.log("Server Running!!!"));

