require("dotenv").config();


//framework
const express = require("express");
const mongoose = require("mongoose");
//database
const database = require("./database/index");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");



//init express
const shapeAI = express();

//config
shapeAI.use(express.json());

//Establish database connection
mongoose.connect(process.env.MONGO_URL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}).then(()=> console.log("connection established!!!!!"));

/*
route              /
description        get all books
access             PUBLIC
parameters         NONE
method             GET
*/

shapeAI.get("/", (req,res)=>{
    //hello change
return res.json({books:database.books});
}
);

/*
route              /is
description        get specificbooks based on ISBN
access             PUBLIC
parameters         isbn
method             GET
*/

shapeAI.get("/is/:isbn",(req, res)=>{
    const getSpecificBook =database.books.filter(
        (book)=> book.ISBN===req.params.isbn
        );

        if(getSpecificBook.length===0){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`,
    });
        }
        return res.json({book: getSpecificBook});
});


/*
route              category
description        get specificbooks based on category
access             PUBLIC
parameters         category
method             GET
*/
shapeAI.get("/c/:category",(req, res)=>{
    const getSpecificBooks =database.books.filter(
        (book)=> book.category.includes(req.params.category)
        );

        if(getSpecificBooks.length===0){
        return res.json({error: `No book found for the category of ${req.params.category}`,
    });
        }
        return res.json({book: getSpecificBooks});
});

/*
route              /authors
description        get all authors
access             PUBLIC
parameters         category
method             GET
*/

shapeAI.get("/author", (req, res)=>{
    return res.json({authors : database.authors});
});

/*
route              /authors
description        get a list of all authors based on a book
access             PUBLIC
parameters         isbn
method             GET
*/

shapeAI.get("/author/:isbn", (req, res)=>{
    const getSpecificAuthors = database.authors.filter((author)=>
    author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthors.length===0){
    return res.json({
        error: `no author found for the book ${req.params.isbn}`
    });
    }

return res.json({authors: getSpecificAuthors});
});



/*
route              /PUBLICATIONS
description        get all publications
access             PUBLIC
parameters         isbn
method             GET
*/

shapeAI.get("/publications", (req, res) =>{
return res.json({publications : database.publications});
});

/*
route              /book/new
description        add new books
access             PUBLIC
parameters         NONE
method             POST
*/

shapeAI.post("/book/new",(req,res)=>{
const {newBook}= req.body;

database.books.push(newBook);

return res.json({books: database.books, message:"book was added!"});
});

/*
route              /author/new
description        add new author
access             PUBLIC
parameters         NONE
method             POST
*/
shapeAI.post("/author/new",(req,res)=>{
    const {newAuthor}= req.body;
    
    database.authors.push(newAuthor);
    
    return res.json({authors: database.authors, message:"author was added!"});
    });

/*
route              /book/update
description        add new author
access             PUBLIC
parameters         isbn
method             PUT
*/

shapeAI.put("/book/update/:isbn",(req,res)=>{
database.books.forEach((book)=>{
    if(book.ISBN===req.params.isbn){
        book.title=req.body.bookTitle;
        return;
    }
});
return res.json({books:database.books});
});

/*
route              /book/author/update
description        update/add new author
access             PUBLIC
parameters         isbn
method             PUT
*/
shapeAI.put("/book/author/update/:isbn",(req,res)=>{
//update book database
database.books.forEach((book)=>{
    if(book.ISBN===req.params.isbn)
    return book.authors.push(req.body.newAuthor);
});

//update author database
database.authors.forEach((author)=>{
    if(author.id===req.body.newAuthor)
    return author.books.push(req.params.isbn);
});

return res.json({books: database.books, authors:database.authors,message:"new author was added"});
});

/*
route              /publication/update/book
description        update/add new book to a publication
access             PUBLIC
parameters         isbn
method             PUT
*/
shapeAI.put("/publication/update/book/:isbn",(req,res)=>{
//update the publication database
database.publications.forEach((publication)=>{
  if(publication.id===req.body.pubId){
      return publication.books.push(req.params.isbn);
  }
});
//update the book database
database.books.forEach((book)=> {
    if(book.ISBN=== req.params.isbn){
        book.publication=req.body.pubId;
        return;
    }
});
return res.json({books:database.books,
publications:database.publications,
message:"Successfully updated publication",
});
});

/*
route              /book/delete
description        delete a book 
access             PUBLIC
parameters         isbn
method             DELETE
*/
shapeAI.delete("/book/delete/:isbn", (req,res)=>{
    const updatedBookDatabase = database.books.filter(
        (book)=> book.ISBN !== req.params.isbn
    );
    database.books=updatedBookDatabase;
    return res.json({books: database.books});
    });

/*
route              /book/delete/author
description        delete author from a book 
access             PUBLIC
parameters         isbn,authorid
method             DELETE
*/

shapeAI.delete("/book/delete/author/:isbn/:authorId", (req,res)=>{
//update book database
database.books.forEach((book)=>{
if(book.ISBN=== req.params.isbn){
    const newAuthorList = book.authors.filter(
        (author)=> author !== parseInt(req.params.authorId)
    );
    book.authors=newAuthorList;
    return;
}
});

//update the author database
database.authors.forEach((author)=>{
    if(author.id===parseInt(req.params.authorId)){
        const newBooksList= author.books.filter((book)=>
        book!==req.params.isbn);
author.books=newBooksList;
return;
    }
});
 return res.json({
     message:"author was deleted!!!",
book: database.books,
author:database.authors,
 });
});


/*
route              /publication/delete/book
description        delete  a book from publication
access             PUBLIC
parameters         isbn,publicaion id
method             DELETE
*/

shapeAI.delete("/publication/delete/book/:isbn/:pubId",(req,res)=>{
//update pub database
database.publications.forEach((publication)=>{
    if(publication.id===parseInt(req.params.pubId)){
        const newBooksList=publication.books.filter(
            (book)=>book!==req.params.isbn
        );
        publication.books=newBooksList;
        return;
    }

});
//update book database
database.books.forEach((book)=>{
    if(book.ISBN===req.params.isbn){
        book.publication=0;//no pub avail
        return;
    }
});
return res.json({
    books:database.books,
    publications:database.publications
})
});


shapeAI.listen(3000, () => console.log("Server Running!!!"));

