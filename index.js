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
 Method             GET

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
 Description        printing a specific books through authors id
 Access             public 
 Parameters         id
 Method             GET

*/

shapeAI.get("/a/:id", (req, res) => {
  const fetchSpecificBook = database.books.filter((book) =>
    book.authors.includes(JSON.parse(req.params.id))
  );

  if (fetchSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the author of id: ${req.params.id}`,
    });
  }

  return res.json({ books: fetchSpecificBook });
});

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
 Route              /authors/is
 Description        printing a specific author
 Access             public 
 Parameters         id
 Method             GET

*/

shapeAI.get("/authors/is/:id", (req, res) => {
  const specificAuthor = database.authors.filter(
    (author) => author.id == req.params.id
  );

  if (specificAuthor.length === 0) {
    return res.json({ error: `The author ${req.params.id} is not valid` });
  }

  return res.json({ author: specificAuthor });
});

/*
 Route              /authors
 Description        get authors based on book's ISBN
 Access             public 
 Parameters         isbn
 Method             GET

*/

shapeAI.get("/authors/:isbn", (req, res) => {
  const specificAuthors = database.authors.filter((author) =>
    author.books.includes(req.params.isbn)
  );
  if (specificAuthors.length === 0) {
    return res.json({
      error: `No author found for the book ${req.params.isbn}`,
    });
  }

  return res.json({ author: specificAuthors });
});

/*
 Route              /pub
 Description        get all publications
 Access             public 
 Parameters         none
 Method             GET

*/

shapeAI.get("/pub", (req, res) => {
  return res.json({ publications: database.publications });
});

/*
 Route              /pub/is
 Description        get specific publication
 Access             public 
 Parameters         id
 Method             GET

*/

shapeAI.get("/pub/is/:id", (req, res) => {
  const specificPublication = database.publications.filter(
    (publication) => publication.id == req.params.id
  );

  if (specificPublication.length === 0) {
    return res.json({
      error: `The publication of ${req.params.id} is not available`,
    });
  }

  return res.json({ publications: specificPublication });
});

/*
 Route              /pub
 Description        publication based on book
 Access             public 
 Parameters         isbn
 Method             GET

*/

shapeAI.get("/pub/:isbn", (req, res) => {
  const specificPublications = database.publications.filter((publication) =>
    publication.books.includes(req.params.isbn)
  );

  if (specificPublications.length === 0) {
    return res.json({
      error: `The publication of ${req.params.isbn} is not available`,
    });
  }

  return res.json({ publications: specificPublications });
});

//------------------------POST FUNCTIONS-------------------------

/*
 Route              /book/new
 Description        creating new book
 Access             public 
 Parameters         none   
 Method             POST
*/

shapeAI.post("/book/new", (req, res) => {
  //make a request body to store an object of new book.
  // it can be stored like:
  //const newBook=req.body.newBook    where newBook has info of the new book. We destructure it:

  const { newBook } = req.body;

  //pushing/ adding the new book to the array
  database.books.push(newBook);
  return res.json({ books: database.books, message: "Book was added" });
});

/*
 Route              /author/new
 Description        creating new author
 Access             public 
 Parameters         none   
 Method             POST
*/

shapeAI.post("/author/new", (req, res) => {
  const { newAuthor } = req.body;
  database.authors.push(newAuthor);
  return res.json({ books: database.authors, message: "Author was added" });
});

/*
 Route              /pub/new
 Description        creating new publication
 Access             public 
 Parameters         none   
 Method             POST
*/

shapeAI.post("/pub/new", (req, res) => {
  const { newPub } = req.body;
  database.publications.push(newPub);
  return res.json({
    books: database.publications,
    message: "Publication was added",
  });
});

//----------------------PUT FUNCTIONS---------------------------------

/*
 Route              /book/update/
 Description        update title of a book
 Access             public 
 Parameters         isbn
 Method             PUT
*/

shapeAI.put("/book/update/:isbn", (req, res) => {
  //accessing every book and checking if the isbn matches to change detail of a specific book
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      //changing book title to a bookTitle declared in the body of POSTMAN
      book.title = req.body.bookTitle;
      return;
    }

    //displaying
    return res.json({ books: database.books, message: "Title was updated" });
  });
});

/*
 Route              /book/author/update
 Description        update/add new author
 Access             public 
 Parameters         isbn
 Method             PUT
*/

shapeAI.put("/book/author/update/:isbn", (req, res) => {
  // when add new author to book, update author object
  //UPDATING BOOK DATABASE
  //searching for the book
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn)
      // pushing the author id into the author array in books
      return book.authors.push(req.body.newAuthor);
  });

  //UPDATING AUTHOR DATABASE
  //searching for the book
  database.authors.forEach((author) => {
    //checking author id from body
    if (author.id === req.body.newAuthor) {
      // pushing the isbn of book in author array
      return author.books.push(req.params.isbn);
    }
  });

  return res.json({
    books: database.books,
    authors: database.authors,
    message: "New author was added",
  });
});

/*
 Route              /author/update
 Description        update author details
 Access             public 
 Parameters         id
 Method             PUT
*/

shapeAI.put("/author/update/:id", (req, res) => {
  database.authors.forEach((author) => {
    console.log("HI");
    if (author.id === JSON.parse(req.params.id)) {
      console.log("hello");
      console.log(author.id);
      author.name = req.body.newAuthorName;
      return;
    }
  });

  return res.json({
    authors: database.authors,
    message: "Author name was changed",
  });
});

/*
 Route              /pub/update
 Description        update publication details
 Access             public 
 Parameters         id
 Method             PUT
*/

shapeAI.put("/pub/update/:id", (req, res) => {
  database.publications.forEach((pub) => {
    if (pub.id === JSON.parse(req.params.id)) {
      pub.name = req.body.newPubName;
      return;
    }
  });

  return res.json({
    publications: database.publications,
    message: "Publication name was changed",
  });
});

/*
 Route              /pub/book/update
 Description        update/add publication
 Access             public 
 Parameters         isbn
 Method             PUT
*/

shapeAI.put("/pub/book/update/:isbn", (req, res) => {
  //update publication

  database.publications.forEach((publication) => {
    if (publication.id === req.body.pubId){
      return publication.books.push(req.params.isbn);
    }
  });

  //update book
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      return book.publication=req.body.pubId;
    }
  });

  res.json({books: database.books, publications: database.publications, message: "The publication is updated"})
});

shapeAI.listen(3000, () => console.log("Server is Running 🚀"));
