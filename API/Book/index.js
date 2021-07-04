
//Initializing Express Router
const Router = require ("express").Router();

//Database Models
const BookModel = require("../../database/book");

/*
route              /
description        get all books
access             PUBLIC
parameters         NONE
method             GET
*/

Router.get("/", async(req,res)=>{
    const getAllBooks = await BookModel.find();
return res.json(getAllBooks);
}
);

/*
route              /is
description        get specificbooks based on ISBN
access             PUBLIC
parameters         isbn
method             GET
*/

Router.get("/is/:isbn",async (req, res)=>{

    const getSpecificBook = await BookModel.findOne({ISBN:req.params.isbn});
    
    //null->false
    
     if(!getSpecificBook){
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
Router.get("/c/:category",async (req, res)=>{
    const getSpecificBooks= await BookModel.findOne({category:req.params.category})
    
    
            if(!getSpecificBooks){
            return res.json({error: `No book found for the category of ${req.params.category}`,
        });
            }
            return res.json({book: getSpecificBooks});
    });


    /*
route              /book/new
description        add new books
access             PUBLIC
parameters         NONE
method             POST
*/

Router.post("/new",async (req,res)=>{
    try{
        const {newBook}= req.body;
    
   await BookModel.create(newBook);
    
    return res.json({message:"book was added!"});
   
}catch(error){
    return res.json({error :error.message});
}
});
    /*
route              /book/update
description        add new author
access             PUBLIC
parameters         isbn
method             PUT
*/

Router.put("/update/:isbn", async(req,res)=>{
    const updatedBook =await BookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn,
        },
        {
      title:req.body.bookTitle,
        },
        {
            new:true, //to get updated
        }
        );
    
    
    return res.json({books:updatedBook });
    });
    
    /*
    route              /book/author/update
    description        update/add new author
    access             PUBLIC
    parameters         isbn
    method             PUT
    */
    Router.put("/author/update/:isbn",async(req,res)=>{
    
    
        //update book database
    const updatedBook =await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $addToSet:{
                authors:req.body.newAuthor,
            },
        },
        {
    new:true,
        }
    );
    
    //update author database
    const updatedAuthor =await AuthorModel.findOneAndUpdate(
        {
            id:req.body.newAuthor,
        },{
         $addToSet:{
             books: req.params.isbn,
    }
        },
        {
            new:true
        }
    );
    
    
    return res.json({
        books: updatedBook, 
        authors:updatedAuthor,
        message:"new author was added"});
    }); 

    
    
/*
route              /book/delete
description        delete a book 
access             PUBLIC
parameters         isbn
method             DELETE
*/
Router.delete("/delete/:isbn", async(req,res)=>{
    const updatedBookDatabase =await BookModel.findOneAndDelete({
 ISBN: req.params.isbn,
    });
    
    // const updatedBookDatabase = database.books.filter(
      //   (book)=> book.ISBN !== req.params.isbn
    // );
     //database.books=updatedBookDatabase;
     return res.json({books:updatedBookDatabase});
     });
 
 /*
 route              /book/delete/author
 description        delete author from a book 
 access             PUBLIC
 parameters         isbn,authorid
 method             DELETE
 */
 
 Router.delete("/delete/author/:isbn/:authorId", async (req,res)=>{
 //update book database
 
 const updatedBook = await BookModel.findOneAndUpdate({
     ISBN: req.params.isbn,
 },
 {
     $pull:{
         authors: parseInt(req.params.authorId),
     },
 },
 {
     new:true
 });
 
 //database.books.forEach((book)=>{
 //if(book.ISBN=== req.params.isbn){
    // const newAuthorList = book.authors.filter(
     //    (author)=> author !== parseInt(req.params.authorId)
    // );
     //book.authors=newAuthorList;
     //return;}});
 
 //update the author database
 const updatedAuthor = await AuthorModel.findOneAndUpdate(
     {
         id: parseInt(req.params.authorId),
     },
     {
         $pull:{
             books: req.params.isbn,
         },
     },
     {
         new:true
     }
 );
 
 
 //database.authors.forEach((author)=>{
   //  if(author.id===parseInt(req.params.authorId)){
     //    const newBooksList= author.books.filter((book)=>
       //  book!==req.params.isbn);
 //author.books=newBooksList;
 //return;
   //  }});
  return res.json({
      message:"author was deleted!!!",
 book: updatedBook,
 author: updatedAuthor,
  });
 });

module.exports = Router;
