let books = [
  {
    ISBN: "123ONE",
    title: "Getting started with MERN",
    authors: [1, 2],
    language: "en",
    pubDate: "2021-07-07",
    numOfPage: 225,
    category: ["fiction", "programming", "tech", "web dev"],
    publication: 1,
  },
  {
    ISBN: "26BEST",
    title: "This is the second book",
    authors: [2],
    language: "en",
    pubDate: "2021-07-07",
    numOfPage: 225,
    category: ["fiction", "programming", "tech", "web dev"],
    publication: 1,
  },
];

let authors = [
  {
    id: 1,
    name: "Chanjot",
    books: ["123ONE",],
  },
  {
    id: 2,
    name: "Esheita",
    books: ["123ONE", "26BEST"],
  },
];
let publications= [
  {
    id: 1,
    name: "chakra",
    books:["123ONE"]
  },
];

module.exports={books, authors, publications};
