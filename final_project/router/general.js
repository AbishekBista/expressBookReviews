const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if(!username || !password) {
      return res.status(404).json({message: 'User credentials not provided'})
  }

  if(!isValid(username)) {
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
    console.log('before')
    const getBooks = new Promise((resolve, reject) => {
        if(books) {
            resolve(books)   
        } else {
            reject('Errors fetching books')
        }
    })

    getBooks
        .then((books) => {
            console.log(books)
            return res.status(200).send(books)
        })
        .catch((error) => {
            return res.status(404).send(error)
        })
        console.log('after promise')
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    console.log('before promise')
    const getBookByISBN = new Promise((resolve, reject) => {
        const isbn = req.params.isbn
        const filteredBook = books[isbn]
        if(filteredBook) {
            resolve(filteredBook)
        } else {
            reject(`Book with ISBN ${isbn} not found.`)
        }
    })

    getBookByISBN
        .then((filteredBook) => {
            console.log(filteredBook)
            return res.status(200).send(filteredBook)
        })
        .catch((error) => {
            return res.status(404).send(error)
        })
        console.log('after promise')
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    console.log('before promise')
    const getBookByAuthor = new Promise((resolve, reject) => {
        const author = req.params.author
        const bookKeys = Object.keys(books)

        const filteredIndex = bookKeys.filter((key) => {
            return books[key].author === author
        })

        if(filteredIndex. length > 0) {
            const filteredBook = books[filteredIndex]
            resolve(filteredBook)
        } else {
            reject(`Book with author ${author} not found.`)
        }
            
    })

    getBookByAuthor
        .then((filteredBook) => {
            console.log(filteredBook)
            return res.status(200).send(filteredBook)
        })
        .catch((error) => {
            return res.status(404).send(error)
        })
        console.log('after promise')
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    console.log('before promise')
    const getBookByTitle = new Promise((resolve, reject) => {
        const title = req.params.title
        const bookKeys = Object.keys(books)

        const filteredIndex = bookKeys.filter((key) => {
            return books[key].title === title
        })

        if(filteredIndex.length > 0) {
            const filteredBook = books[filteredIndex]
            resolve(filteredBook)
        } else {
            reject(`Cannot find book with title ${title}`)
        }
    })

    getBookByTitle
        .then((filteredBook) => {
            console.log(filteredBook)
            return res.status(200).send(filteredBook)
        })
        .catch((error) => {
            return res.status(404).send(error)
        })

        console.log('after promise')

    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn

  const reviews = books[isbn].reviews

  return res.status(200).send(reviews)
});

module.exports.general = public_users;
