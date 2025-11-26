const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
    let userwithsamename = users.filter((user) =>  {return user.username == username});

    if (userwithsamename.length > 0) {
        return true;
    } else {
        return false;
    };
};

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
};

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    books = JSON.stringify({books});
    return res.status(300).json({message: `Here are your books ${books}`});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (isbn) {
      return res.send(books[isbn]);
    } else {
      return res.status(404).json({message: `Invalid ISBN`});
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  const booksArray = Object.values(books);

  const foundBook = booksArray.filter (book => book.author === authorName);
  res.send(foundBook);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const bookTitle = req.params.title;
    const booksArray = Object.values(books);
  
    const foundBook = booksArray.filter (book => book.title === bookTitle);
    res.send(foundBook);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const bookReviews = req.params.reviews;
    const booksArray = Object.values(books);
  
    const foundBook = booksArray.filter (book => book.reviews === bookReviews);
    res.send(foundBook);
});

module.exports.general = public_users;