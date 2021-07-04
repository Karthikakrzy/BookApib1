const Router = require("express").Router();




/*
route              /PUBLICATIONS
description        get all publications
access             PUBLIC
parameters         isbn
method             GET
*/

    Router.get("/", (req, res) =>{
    return res.json({publications : database.publications});
    });
    
    
 /*
    route              /publication/update/book
    description        update/add new book to a publication
    access             PUBLIC
    parameters         isbn
    method             PUT
    */
    Router.put("/update/book/:isbn",(req,res)=>{
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
    route              /publication/delete/book
    description        delete  a book from publication
    access             PUBLIC
    parameters         isbn,publicaion id
    method             DELETE
    */
    
    Router.delete("/delete/book/:isbn/:pubId",(req,res)=>{
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
    
    module.exports = Router;