const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const filteredUser = users.filter((user) => {
        return user.username === username && user.password === password
    })
    return (filteredUser.length > 0)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if(!username || !password) {
      return res.status(404).json({message: 'User credentials not provided'})
  }

  if(authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
          data: password
      }, 'access', {expiresIn: 60 * 60})

      req.session.authorization = {
          accessToken,
          username
      }

      return res.status(200).json({message: 'User logged in successfully!'})
  } else {
      return res.status(208).json({message: 'Invalid login credentials!'})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  

  const bookReview = books[isbn]

  if(bookReview) {
    const {username} = req.session.authorization
    const review = req.query.review


    if(review) {

        bookReview['review'] = {
            ...bookReview['review'],
            [username]: review
        }
    }

    books[isbn] = bookReview

    res.status(200).send(`Book with ISBN ${isbn} updated by ${username}`)
  } else {
      res.send(`Book with ISBN ${isbn} not found.`)
  }

  
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn

    const bookReviewed = books[isbn]

    if(bookReviewed) {
        const {username} = req.session.authorization

        if(bookReviewed.review[username]) {
            delete bookReviewed.review[username]
            return res.send(`Review by ${username} on ${bookReviewed.title} deleted.`)
        } else {
            return res.send(`Review by ${username} on ${bookReviewed.title} does not exist.`)
        }
        
    } else {
        return res.send(`Book with ISBN ${isbn} not found.`)
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
