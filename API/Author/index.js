//to implement microservices with express we use router

//Database Models:

const bookModel = require("../../database/book");
const authorModel = require("../../database/author");
const publicationModel = require("../../database/publication");

//initialising router
const Router = require("express").Router();

//------------------GET FUNCTION--------------
Router.get("/", async (req, res) => {
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

Router.get("/is/:id", async (req, res) => {
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

Router.get("/:isbn", async (req, res) => {
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

//------------------------POST FUNCTIONS-------------------------

/*
 Route              /author/new
 Description        creating new author
 Access             public 
 Parameters         none   
 Method             POST
*/

Router.post("/new", async (req, res) => {
  const { newAuthor } = req.body;
  const addNewAuthor = await authorModel.create(newAuthor);
  return res.json({ author: addNewAuthor, message: "Author was added" });
});

//----------------------PUT FUNCTIONS---------------------------------

/*
 Route              /author/update
 Description        update author details
 Access             public 
 Parameters         id
 Method             PUT
*/

Router.put("/update/:id", (req, res) => {
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

//----------------------DELETE FUNCTION----------------------------

/*
 Route              /author/delete
 Description        delete an author
 Access             public 
 Parameters         id
 Method             DELETE
*/

Router.delete("/delete/:id", (req, res) => {
  const newAuthorList = database.authors.filter(
    (author) => author.id !== JSON.parse(req.params.id)
  );

  database.authors = newAuthorList;

  return res.json({ authors: database.authors, message: "Author deleted" });
});

//exporting

module.exports = Router;
