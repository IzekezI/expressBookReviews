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
    let isbn = req.params.isbn;
    if (isbn) {
      return res.send(books[isbn]);
    } else {
      return res.status(404).json({message: `Invalid ISBN`});
    }
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    // Write your code here
    let author = req.params.author;
    let booksByAuthor = [];
  
    try {
      // Assuming the API endpoint for getting all books is http://localhost:5000/books
      const response = await axios.get('http://localhost:5000/books');
  
      for (let isbn in response.data) {
        if (response.data[isbn].author == author) {
          booksByAuthor.push(response.data[isbn]);
        }
      }
  
      if (booksByAuthor.length > 0) {
        return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
      } else {
        return res.status(404).send("No book found with author " + author);
      }
    } catch (error) {
      // Handle errors, e.g., network issues or API errors
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
});
  

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    // Write your code here
    let title = req.params.title;
    let booksByTitle = [];
  
    try {
      // Assuming the API endpoint for getting all books is http://localhost:5000/books
      const response = await axios.get('http://localhost:5000/books');
  
      for (let isbn in response.data) {
        if (response.data[isbn].title == title) {
          booksByTitle.push(response.data[isbn]);
        }
      }
  
      if (booksByTitle.length > 0) {
        return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
      } else {
        return res.status(404).send("No book found with title " + title);
      }
    } catch (error) {
      // Handle errors, e.g., network issues or API errors
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
});
  

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
    // Write your code here
    let isbn = req.params.isbn;
  
    try {
      const response = await axios.get('http://localhost:5000/books');
  
      if (response.data[isbn]) {
        return res.status(200).send(JSON.stringify(response.data[isbn], null, 4));
      } else {
        return res.status(404).send("No book found with ISBN " + isbn);
      }
    } catch (error) {
      // Handle errors, e.g., network issues or API errors
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }  
});

module.exports.general = public_users;