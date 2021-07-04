const mongoose = require("mongoose");

// creating schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

//create a publication model

const publicationModel = mongoose.model(PublicationSchema);

module.exports = publicationModel; 
