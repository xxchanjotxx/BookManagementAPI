//to implement microservices with express we use router

//Database Models:

const bookModel = require("../../database/book");
const authorModel = require("../../database/author");
const publicationModel = require("../../database/publication");


//initialising router
const Router = require("express").Router();

/*
 Route              /
 Description        get all the books
 Access             public 
 Parameters         none    
 Method             GET

*/

//printing all the books at root location
Router.get("/", async (req, res) => {
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
  Router.get("/is/:isbn", async (req, res) => {
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
  Router.get("/c/:category", async (req, res) => {
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
  
  Router.get("/a/:id", async (req, res) => {
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
  
  //------------------------POST FUNCTIONS-------------------------
  
  /*
   Route              /book/new
   Description        creating new book
   Access             public 
   Parameters         none   
   Method             POST
  */
  
  Router.post("/new", async (req, res) => {
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
  
  
  //----------------------PUT FUNCTIONS---------------------------------
  
  /*
     Route              /book/update/
     Description        update title of a book
     Access             public 
     Parameters         isbn
     Method             PUT
    */
  
  Router.put("/update/:isbn", async (req, res) => {
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
  
  Router.put("/author/update/:isbn", async (req, res) => {
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
  
  //----------------------DELETE FUNCTION----------------------------
  
  /*
   Route              /book/delete
   Description        delete a book
   Access             public 
   Parameters         isbn
   Method             DELETE
  */
  
  //removing books by using map and filter
  Router.delete("/delete/:isbn", async (req, res) => {
    const updatedBookDatabase = await bookModel.findOneAndDelete({
      ISBN: req.params.isbn,
    });
    // const updatedBookDatabase = database.books.filter(
    //   (book) => book.ISBN !== req.params.isbn
    // );
  
    // database.books = updatedBookDatabase;
  
    return res.json({ books: updatedBookDatabase });
  });
  
  /*
     Route              /book/delete/author
     Description        delete a author from book
     Access             public 
     Parameters         isbn, authorId
     Method             DELETE
    */
  
  Router.delete("/delete/author/:isbn/:authorId", async (req, res) => {
    //book database
  
    const updatedBook = await bookModel.findOneAndUpdate(
      {
        ISBN: req.params.isbn,
      },
      {
        $pull: {
          authors: JSON.parse(req.params.authorId),
        },
      },
      {
        new: true,
      }
    );
  
    //author database
  
    const updatedAuthor = await authorModel.findOneAndUpdate(
      {
        id: JSON.parse(req.params.authorId),
      },
      {
        $pull: {
          books: req.params.isbn,
        },
      },
      {
        new: true,
      }
    );
  
    // //handling and updating the book database
  
    // //looping inside books first and checking isbn for a book object
    // database.books.forEach((book) => {
    //   if (book.ISBN == req.params.isbn) {
    //     //filtering out authors without the matching id. "(author)" is id itself
    //     const newAuthorList = book.authors.filter(
    //       (author) => author !== parseInt(req.params.authorId)
    //     );
    //     book.authors = newAuthorList;
    //     return;
    //   }
    // });
  
    // //handling and updating the author database
    // database.authors.forEach((author) => {
    //   if (author.id === parseInt(req.params.authorId)) {
    //     const newBookList = author.books.filter(
    //       (book) => book !== req.params.isbn
    //     );
    //     author.books = newBookList;
    //     return;
    //   }
    // });
    return res.json({
      books: updatedBook,
      authors: updatedAuthor,
      message: "Author deleted and updated",
    });
  });
  
//exporting

module.exports = Router;
