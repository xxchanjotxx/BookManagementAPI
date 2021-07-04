const mongoose = require("mongoose");

// creating schema
const BookSchema = mongoose.Schema({
  ISBN: String,
  title: String,
  authors: [Number],
  language: String,
  pubDate: String,
  numOfPage: Number,
  category: [String],
  publication: Number,
});

//create a book model

const bookModel = mongoose.model(BookSchema);

module.exports = bookModel; 
