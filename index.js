require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
var bodyParser= require("body-parser");

//Database
const database = require("./database/database");
//models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication")
//Initialise express
const booky = express();
booky.use(bodyParser.urlencoded({extended:true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
).then( ()=> console.log("connection established"));
/*
Route            /
Description      Get all the books
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/",async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route            /is
Description      Get specific book on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/is/:isbn",async(req,res) => {

  const getSpecificBook = await BookModel.findOne({ISBN:req.params.isbn});
  //!0=1 !1=0
  if(!getSpecificBook) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
  }

  return res.json({book: getSpecificBook});
});


/*
Route            /c
Description      Get specific book on category
Access           PUBLIC
Parameter        category
Methods          GET
*/

booky.get("/c/:category", async(req,res) => {
  const getSpecificBook = await BookModel.findOne({category:req.params.category})

  if(!getSpecificBook) {
    return res.json({error: `No book found for the category of ${req.params.category}`})
  }

  return res.json({book: getSpecificBook});
});

/*
  Route:           /lang
  Description :   Get specific book based on language;
  Access;         public
  Parameter:      category;
  Methods :       Get
*/
booky.get("/lang/:language",async(req,res) => {
  const getSpecificBook = await BookModel.findOne({language:req.params.language})

    if(!getSpecificBook){
      return res.json({error: `No book found for the language ${req.params.language}`});
    }
    return res.json({book:getSpecificBook});

})
/*
Route            /author
Description      Get all authors
Access           PUBLIC
Parameter        NONE
Methods          GET
*/

booky.get("/author", async (req,res) => {
  const getAllAuthor = await AuthorModel.find();
  return res.json(getAllAuthor);
});

/*
Route            /author/book
Description      Get all authors based on books
Access           PUBLIC
Parameter        isbn
Methods          GET
*/

booky.get("/author/book/:isbn", (req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  );

  if(getSpecificAuthor.length === 0){
    return res.json({
      error: `No author found for the book of ${req.params.isbn}`
    });
  }
  return res.json({authors: getSpecificAuthor});
});
//____________________________________________________

/*
Route            /author/book
Description      Get author by id
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/author/:id", (req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.id == req.params.id
  );

  if(getSpecificAuthor.length === 0){
    return res.json({
      error: `No author found for the book of ${req.params.id}`
    });
  }
  return res.json({authors: getSpecificAuthor});
});

//____________________________________________________

/*
Route            /publications
Description      Get all publications
Access           PUBLIC
Parameter        NONE
Methods          GET
*/

booky.get("/publications",async (req,res) => {
  const getAllPublication = await AuthorModel.find();
  return res.json(getAllPublication);
})


/*
Route            /pub-id
Description      Get all publications based on id
Access           PUBLIC
Parameter        NONE
Methods          GET
*/

booky.get("/publication/:id",(req,res) => {
  const getspecificPublication = database.publication.filter((publication) =>
    publication.id == req.params.id);
  if(getspecificPublication.length===0){
    return res.json({error: `No publication found for the id ${req.params.id}`});
  }
  return res.json({publication:getspecificPublication});

});
/*
Route            /pub-id/book
Description      Get all publications on book
Access           PUBLIC
Parameter        NONE
Methods          GET
*/

booky.get("/pub/book/:isbn",(req,res) => {
  const getspecificPublication = database.publication.filter((publication) =>
    publication.books.includes(req.params.isbn));
  if(getspecificPublication.length===0){
    return res.json({error: `No publication found for the isbn ${req.params.isbn}`});
  }
  return res.json({publication:getspecificPublication});


});
/*
Route            /book/new
Description      Get all publications on book
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.post("/book/new",async (req,res)=>
{
  const {newBook} = req.body;
  const addNewBook = BookModel.create(newBook);
  return res.json({
    books: addNewBook,
    message:"book was added!!!"
  });

});
/*
Route            /author/new
Description      add new authors
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.post("/author/new",async (req,res)=>
{
  const {newAuthor} = req.body;
  const addNewAuthor = AuthorModel.create(newAuthor);

  return res.json({
    author:addNewAuthor,
    message:"Author was addded"
  });
});
/*
Route            /publication/new
Description      add new publication
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.post("/pub/new",async(req,res)=>
{
  const {newPublication} = req.body;
  const addNewPublication = PublicationModel.create(newPublication);

  return res.json({
    publication:addNewPublication,
    message:"publication was added"
  });
});

/*
Route            /book/update/:isbn
Description      update or add new publication
Access           PUBLIC
Parameter        isbn
Methods         put
*/
booky.put("/book/update/:isbn",async(req,res)=>{
  const updatedBook = await BookModel.findOneAndUpdate(
  {
    ISBN:req.params.isbn
  },
  {
    title:req.body.bookTitle
  },
  {
    new:true
  }
);
return res.json(
  {
    books:updatedBook
  }
);
});
// UPDATING NEW AUTHOR AND BOOK SIMULTENEOUSLY
/*Route            /book/author/update/
Description      update or add new author
Access           PUBLIC
Parameter        isbn
Methods         put
*/
booky.put("/book/author/update/:isbn", async(req,res)=>
{
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN:req.params.isbn
    },
    {
      $addToSet:{
        authors:req.body.newAuthor
      }
    },
    {
      new:true
    }
  );
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id:req.body.newAuthor
    },
    {
      $addToSet:{
        books:req.params.isbn
      }
    },
    {
      new:true
    }
  );
  return res.json(
    {
      books:updatedBook,
      authors:updatedAuthor,
      message:"new author was added"
    }
  )
});

/*Route            /publication/update/book
Description      update or add new publication
Access           PUBLIC
Parameter        isbn
Methods         put
*/

booky.put("/publication/update/book/:isbn", (req, res) => {
    //Update the publication database
    database.publication.forEach((pub) => {
        if (pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);

        }
    });
    //Update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId;
            return;
        }
    });
    return res.json(
        {
            books: database.books,
            publication: database.publication,
            message: "Successfully update the publication",
        }
    );
});
/*
Route            book/delete
Description     delete a book
Access           PUBLIC
Parameter        isbn
Methods         DELETE
*/

booky.delete("/book/delete/:isbn", async (req, res) => {
    //Which Ever book that doesnt match with the isbn,
    //just send it to update database array and
    //rest will be filtered out

    const updatedBookDatabase = await BookModel.findOneAndDelete(
      {
        ISBN:req.params.isbn
      }
    );
    return res.json({
      books:updatedBookDatabase
    });
});

/*
Route            book/delete/author
Description     delete an author from a book and vice versa
Access           PUBLIC
Parameter        isbn and authorId
Methods         DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //Update the book database
   database.books.forEach((book)=>{
     if(book.ISBN === req.params.isbn) {
       const newAuthorList = book.author.filter(
         (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
       );

       book.author = newAuthorList;
       return;
     }
   });


  //Update the author database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!!"
  });
});

booky.listen(3000,() => {
  console.log("Server is up and running");
});
