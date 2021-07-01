const mongoose = require("mongoose");

//creating a book schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title:String,
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPages: Number,
    category: [String],
    publication:Number,
});

//create a book model
const BookModel = mongoose.model(Bookschema);

module.exports=BookModel;