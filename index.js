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

//establish data connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connection Established😎"));

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
shapeAI.get("/", async (req, res) => {
  //empty fucntion for using mongodb
  const getAllBooks = await bookModel.find();
  return res.json(getAllBooks);
});

/*
 Route              /is
 Description        printing a specific book through isbn
 Access             public 
 Parameters         isbn   
 Method             GET

*/

//filtering the data base books and retrieving the specific book
shapeAI.get("/is/:isbn", async (req, res) => {
  const getSpecificBook = await bookModel.findOne({ ISBN: req.params.isbn });
  // const getSpecificBook = database.books.filter(
  //   (book) => book.ISBN === req.params.isbn
  // );

  //getSpecificBook has details of the specific book

  //checks if the isbn is wrong and url is invalid and returns a specific message
  if (!getSpecificBook) {
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
shapeAI.get("/c/:category", async (req, res) => {
  const getSpecificBooks = await bookModel.findOne({
    category: req.params.category,
  });

  // const getSpecificBooks = database.books.filter((book) =>
  //   book.category.includes(req.params.category)
  // );

  //checks if the category is absent(if array empty) and returns an error message
  if (!getSpecificBooks) {
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

shapeAI.get("/a/:id", async (req, res) => {
  const fetchSpecificBook = await bookModel.findOne({
    authors: req.params.id,
  });

  // const fetchSpecificBook = database.books.filter((book) =>
  //   book.authors.includes(JSON.parse(req.params.id))
  // );

  if (!fetchSpecificBook) {
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

shapeAI.get("/authors", async (req, res) => {
  const getAllAuthors = await authorModel.find();
  return res.json({ authors: getAllAuthors });
});

/*
 Route              /authors/is
 Description        printing a specific author
 Access             public 
 Parameters         id
 Method             GET

*/

shapeAI.get("/author/is/:id", async (req, res) => {
  const getSpecificAuthor = await authorModel.find({
    id: JSON.parse(req.params.id),
  });
  // const specificAuthor = database.authors.filter(
  //   (author) => author.id == req.params.id
  // );

  if (!getSpecificAuthor) {
    return res.json({ error: `The author ${req.params.id} is not valid` });
  }

  return res.json({ author: getSpecificAuthor });
});

/*
 Route              /authors
 Description        get authors based on book's ISBN
 Access             public 
 Parameters         isbn
 Method             GET

*/

shapeAI.get("/authors/:isbn", async (req, res) => {
  const getSpecificAuthors = await authorModel.find({ books: req.params.isbn });
  // const specificAuthors = database.authors.filter((author) =>
  //   author.books.includes(req.params.isbn)
  // );
  if (!getSpecificAuthors) {
    return res.json({
      error: `No author found for the book ${req.params.isbn}`,
    });
  }

  return res.json({ author: getSpecificAuthors });
});

/*
 Route              /pub
 Description        get all publications
 Access             public 
 Parameters         none
 Method             GET

*/

shapeAI.get("/pub", async (req, res) => {
  const getAllPublication = await publicationModel.find();
  return res.json({ publications: getAllPublication });
});

/*
 Route              /pub/is
 Description        get specific publication
 Access             public 
 Parameters         id
 Method             GET

*/

shapeAI.get("/pub/is/:id", async (req, res) => {
  const getSpecificPublication = await publicationModel.find({
    id: JSON.parse(req.params.id),
  });
  // const specificPublication = database.publications.filter(
  //   (publication) => publication.id == req.params.id
  // );

  if (!getSpecificPublication) {
    return res.json({
      error: `The publication of ${req.params.id} is not available`,
    });
  }

  return res.json({ publications: getSpecificPublication });
});

/*
 Route              /pub
 Description        publication based on book
 Access             public 
 Parameters         isbn
 Method             GET

*/

shapeAI.get("/pub/:isbn", async (req, res) => {
  const getSpecificPublications = await publicationModel.find({
    books: req.params.isbn,
  });

  // const specificPublications = database.publications.filter((publication) =>
  //   publication.books.includes(req.params.isbn)
  // );

  if (!getSpecificPublications) {
    return res.json({
      error: `The publication of ${req.params.isbn} is not available`,
    });
  }

  return res.json({ publications: getSpecificPublications });
});

//------------------------POST FUNCTIONS-------------------------

/*
 Route              /book/new
 Description        creating new book
 Access             public 
 Parameters         none   
 Method             POST
*/

shapeAI.post("/book/new", async (req, res) => {
  //make a request body to store an object of new book.
  // it can be stored like:
  //const newBook=req.body.newBook    where newBook has info of the new book. We destructure it:

  const { newBook } = req.body;
  // using bookModel.create to add a new book
  const addNewBook = await bookModel.create(newBook);
  //pushing/ adding the new book to the array
  // database.books.push(newBook);
  return res.json({ books: addNewBook, message: "Book was added" });
});

/*
 Route              /author/new
 Description        creating new author
 Access             public 
 Parameters         none   
 Method             POST
*/

shapeAI.post("/author/new", async (req, res) => {
  const { newAuthor } = req.body;
  const addNewAuthor = await authorModel.create(newAuthor);
  return res.json({ author: addNewAuthor, message: "Author was added" });
});

/*
 Route              /pub/new
 Description        creating new publication
 Access             public 
 Parameters         none   
 Method             POST
*/

shapeAI.post("/pub/new", async (req, res) => {
  const { newPub } = req.body;

  const addNewPublication = await publicationModel.create(newPub);
  // database.publications.push(newPub);
  return res.json({
    books: addNewPublication,
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

shapeAI.put("/book/update/:isbn", async (req, res) => {
  const updatedBook = await bookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      title: req.body.bookTitle,
    },
    {
      //to update and return updated
      new: true,
    }
  );

  //accessing every book and checking if the isbn matches to change detail of a specific book
  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn) {
  //     //changing book title to a bookTitle declared in the body of POSTMAN
  //     book.title = req.body.bookTitle;
  //     return;
  //   }

  //displaying
  return res.json({ books: updatedBook, message: "Title was updated" });
});

/*
 Route              /book/author/update
 Description        update/add new author
 Access             public 
 Parameters         isbn
 Method             PUT
*/

shapeAI.put("/book/author/update/:isbn", async (req, res) => {
  //updating book database

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      //pushing the new author
      $addToSet: {
        authors: req.body.newAuthor,
      },
    },
    {
      new: true,
    }
  );

  //updating author database

  const updatedAuthor = await authorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor,
    },
    {
      $push: {
        books: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );

  // // when add new author to book, update author object
  // //UPDATING BOOK DATABASE
  // //searching for the book
  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn)
  //     // pushing the author id into the author array in books
  //     return book.authors.push(req.body.newAuthor);
  // });

  // //UPDATING AUTHOR DATABASE
  // //searching for the book
  // database.authors.forEach((author) => {
  //   //checking author id from body
  //   if (author.id === req.body.newAuthor) {
  //     // pushing the isbn of book in author array
  //     return author.books.push(req.params.isbn);
  //   }
  // });

  return res.json({
    books: updatedBook,
    authors: updatedAuthor,
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
    if (publication.id === req.body.pubId) {
      return publication.books.push(req.params.isbn);
    }
  });

  //update book
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      return (book.publication = req.body.pubId);
    }
  });

  res.json({
    books: database.books,
    publications: database.publications,
    message: "The publication is updated",
  });
});

//----------------------DELETE FUNCTION----------------------------

/*
 Route              /book/delete
 Description        delete a book
 Access             public 
 Parameters         isbn
 Method             DELETE
*/

//removing books by using map and filter
shapeAI.delete("/book/delete/:isbn", (req, res) => {

  
  // const updatedBookDatabase = database.books.filter(
  //   (book) => book.ISBN !== req.params.isbn
  // );

  // database.books = updatedBookDatabase;

  return res.json({ books: database.books });
});

/*
 Route              /book/delete/author
 Description        delete a author from book
 Access             public 
 Parameters         isbn, authorId
 Method             DELETE
*/

shapeAI.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
  //handling and updating the book database

  //looping inside books first and checking isbn for a book object
  database.books.forEach((book) => {
    if (book.ISBN == req.params.isbn) {
      //filtering out authors without the matching id. "(author)" is id itself
      const newAuthorList = book.authors.filter(
        (author) => author !== parseInt(req.params.authorId)
      );
      book.authors = newAuthorList;
      return;
    }
  });

  //handling and updating the author database
  database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.authorId)) {
      const newBookList = author.books.filter(
        (book) => book !== req.params.isbn
      );
      author.books = newBookList;
      return;
    }
  });
  return res.json({
    books: database.books,
    authors: database.authors,
    message: "Author deleted and updated",
  });
});

/*
 Route              /author/delete
 Description        delete an author
 Access             public 
 Parameters         id
 Method             DELETE
*/

shapeAI.delete("/author/delete/:id", (req, res) => {
  const newAuthorList = database.authors.filter(
    (author) => author.id !== JSON.parse(req.params.id)
  );

  database.authors = newAuthorList;

  return res.json({ authors: database.authors, message: "Author deleted" });
});

/*
 Route              /pub/delete
 Description        delete a publication
 Access             public 
 Parameters         id
 Method             DELETE
*/

shapeAI.delete("/pub/delete/:id", (req, res) => {
  const newPubList = database.publications.filter(
    (publication) => publication.id !== JSON.parse(req.params.id)
  );

  database.publications = newPubList;

  return res.json({
    Publications: database.publications,
    message: `Publication ${req.params.id} is deleted`,
  });
});

/*
 Route              /pub/book/delete
 Description        Delete a book from publication
 Access             public 
 Parameters         isbn,id
 Method             DELETE
*/

shapeAI.delete("/pub/book/delete/:isbn/:pubId", (req, res) => {
  //access the publication
  database.publications.forEach((publication) => {
    if (publication.id === JSON.parse(req.params.pubId)) {
      const newBooksList = publication.books.filter(
        (book) => book != req.params.isbn
      );
      publication.books = newBooksList;
      return;
    }
  });

  //access the books
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = 0;
      return;
    }
  });
  return res.json({
    Publications: database.publications,
    Books: database.books,
    message: `The publication with id: ${req.params.pubId} is deleted`,
  });
});

shapeAI.listen(3000, () => console.log("Server is Running 🚀"));
