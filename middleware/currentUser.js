const express = require('express');
const users = require('../users');
const urlDB = require('../urlDatabase');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

module.exports = {
  currentUser: (req, res, next) => {
    if (req.cookies.id) {
      console.log(`From currentUser() middleware. We are inside`)
      let userID = req.cookies.id;
      let user = users.getUser(userID);
      user["urls"] = urlDB.getUserURLs(user.id);
      req.currentUser = user;
    };
    next();
  }
}