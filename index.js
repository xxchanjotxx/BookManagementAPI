//Frame Work
const express = require("express");

//import data from database
const database = require("./database/index");
//initialising
const shapeAI = express();

//configurations

shapeAI.use(express.json());

/*
 Route              /
 Description        get all the books
 Access             public 
 Parameters         none    
 Method             GET

*/

//printing all the books at root location
shapeAI.get("/", (req, res) => {
  return res.json({ books: database.books });
});

/*
 Route              /is
 Description        printing a specific book through isbn
 Access             public 
 Parameters         isbn   
 Method             GET

*/

//filtering the data base books and retrieving the specific book
shapeAI.get("/is/:isbn", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  //getSpecificBook has details of the specific book

  //checks if the isbn is wrong and url is invalid and returns a specific message
  if (getSpecificBook.length === 0) {
    return res.json({
      error: `NO BOOK FOUND FOR THE ISBN OF ${req.params.isbn}`,
    });
  }

  //when the url and isbn is valid, will return the info of specific book
  return res.json({ book: getSpecificBook });
});

/*
 Route              /c/
 Description        printing a specific books through categories
 Access             public 
 Parameters         category   
 Method              GET

*/

//using book.category.includes(req.params.category) to check if category is present and filtering it out
shapeAI.get("/c/:category", (req, res) => {
  const getSpecificBooks = database.books.filter((book) =>
    book.category.includes(req.params.category)
  );

  //checks if the category is absent(if array empty) and returns an error message
  if (getSpecificBooks.length === 0) {
    return res.json({
      error: `NO BOOK FOUND FOR THE CATEGORY OF ${req.params.category}`,
    });
  }

  //if category presents, display
  return res.json({ books: getSpecificBooks });
});

/*
 Route              /a/
 Description        printing a specific books through authors
 Access             public 
 Parameters         authors 
 Method              GET

*/


//------------------------TASK LEFT------------------------------

/*
 Route              /authors
 Description        printing all authors
 Access             public 
 Parameters         none
 Method             GET

*/
//-------------------------------------------

shapeAI.get("/authors", (req, res) => {
  return res.json({ authors: database.authors });
});

/*
 Route              /authors
 Description        printing a specific author
 Access             public 
 Parameters         none
 Method             GET

*/

shapeAI.get("/authors/:id", (req, res) => {
  const specificAuthor = database.authors.filter((author) =>
    author.id.includes(req.params.id)
  );

  if (specificAuthor === 0) {
    return res.json({ error: `The author ${req.params.id} is not valid` });
  }

  return res.json({ author: specificAuthor });
});

shapeAI.listen(3000, () => console.log("Server is Running 🚀"));
