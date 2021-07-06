//to implement microservices with express we use router

//Database Models:

const bookModel = require("../../database/book");
const authorModel = require("../../database/author");
const publicationModel = require("../../database/publication");

//initialising router
const Router = require("express").Router();

//------------------GET FUNCTION--------------
/*
 Route              /pub
 Description        get all publications
 Access             public 
 Parameters         none
 Method             GET

*/

Router.get("/", async (req, res) => {
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

Router.get("/is/:id", async (req, res) => {
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

Router.get("/:isbn", async (req, res) => {
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
   Route              /pub/new
   Description        creating new publication
   Access             public 
   Parameters         none   
   Method             POST
  */

Router.post("/new", async (req, res) => {
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
   Route              /pub/update
   Description        update publication details
   Access             public 
   Parameters         id
   Method             PUT
  */

Router.put("/update/:id", (req, res) => {
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

Router.put("/book/update/:isbn", (req, res) => {
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
   Route              /pub/delete
   Description        delete a publication
   Access             public 
   Parameters         id
   Method             DELETE
  */

Router.delete("/delete/:id", (req, res) => {
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

Router.delete("/book/delete/:isbn/:pubId", (req, res) => {
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

//exporting

module.exports = Router;
