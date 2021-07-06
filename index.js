//to hide our sensitive details
require("dotenv").config();

//Frame Work
const express = require("express");
//mongoose for mongoDB
const mongoose = require("mongoose");

//import data from database
const database = require("./database/index");

//models
const bookModel = require("./database/book");
const authorModel = require("./database/author");
const publicationModel = require("./database/publication");

//initialising
const shapeAI = express();

//initialising microservices routes

const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publication = require("./API/Publication");

//establish data connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connection Established😎"));

//INITIALISING MICROSERVICES PREFIX

shapeAI.use("/book", Books);
shapeAI.use("/author", Authors);
shapeAI.use("/publication", Publication);

//configurations

shapeAI.use(express.json());



shapeAI.listen(3000, () => console.log("Server is Running 🚀"));
