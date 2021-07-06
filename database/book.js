const mongoose = require("mongoose");

// creating schema
const BookSchema = mongoose.Schema({
  ISBN: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 10,
  }, //validating with mongoose: so that it cannot be entered empty
  title: String,
  authors: [Number],
  language: String,
  pubDate: String,
  numOfPage: Number,
  category: [String],
  publication: Number,
});

//create a book model

const bookModel = mongoose.model("books", BookSchema);

module.exports = bookModel;
