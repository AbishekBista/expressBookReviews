const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function userExists(username) {
    const filteredUser = users.filter((user) => {
        return user.username === username
    })

    if(filteredUser.length > 0)
        return true
    else
        return false
}


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if(!username || !password) {
      return res.status(404).json({message: 'User credentials not provided'})
  }

  if(userExists(username)) {
      return res.status(404).json({message: `User with user name ${username} already exists.`})
  }

  users.push({
      "username": username,
      "password": password
  })

  res.status(200).send({message: `Thank you, you have been registered!`})


});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const filteredBook = books[isbn]

  return res.status(200).send(filteredBook)
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  
  const bookKeys = Object.keys(books)

  const filteredIndex = bookKeys.filter((key) => {
      return books[key].author === author
  })

  return res.status(200).send(books[filteredIndex])
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title
  
    const bookKeys = Object.keys(books)
  
    const filteredIndex = bookKeys.filter((key) => {
        return books[key].title === title
    })
  
    return res.status(200).send(books[filteredIndex])
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn

  const reviews = books[isbn].reviews

  return res.status(200).send(reviews)
});

module.exports.general = public_users;
