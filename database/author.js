const mongoose = require("mongoose");

// creating schema
const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

//create an author model

const authorModel = mongoose.model("authors",AuthorSchema);

module.exports = authorModel; 
