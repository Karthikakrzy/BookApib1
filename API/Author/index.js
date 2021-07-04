const Router =require("express").Router();

const AuthorModel= require("../../database/author");




/*
route              /authors
description        get all authors
access             PUBLIC
parameters         category
method             GET
*/

Router.get("/", async (req, res)=>{
    const getAllAuthors = await AuthorModel.find();
    return res.json({authors : getAllAuthors});
});

/*
route              /authors
description        get a list of all authors based on a book
access             PUBLIC
parameters         isbn
method             GET
*/

Router.get("/:isbn", (req, res)=>{
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
route              /author/new
description        add new author
access             PUBLIC
parameters         NONE
method             POST
*/
Router.post("/new",(req,res)=>{
    const {newAuthor}= req.body;
    
    AuthorModel.create(newAuthor);
    
    return res.json({ message:"author was added!"});
    });
module.exports = Router;