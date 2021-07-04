const mongoose = require("mongoose");

//creating a book schema
const BookSchema =  mongoose.Schema({
    ISBN: 
     { type: String,
        required: true,
        minLength: 8,
        maxlength:10,
     },
    title:{
        type: String,
        required: true,
        minLength: 10,
        maxlength:30,
    },
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPages: Number,
    category: [String],
    publication:Number,
});

//create a book model
const BookModel = mongoose.model("books",BookSchema);

module.exports=BookModel;