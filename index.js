//Frame Work
const express = require("express");

//import data from database
const database = require("./database/index");
//initialising
const shapeAI = express();

//configurations

shapeAI.use(express.json());

shapeAI.get("/", (req, res) => {
  return res.json({ books: database.books });
});

shapeAI.listen(3000, () => console.log("Server is Running Bitch 🚀"));
