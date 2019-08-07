const express = require('express');
const users = require('../users');
const urlDB = require('../urlDatabase');
const cookieSession = require('cookie-session');

const app = express();
app.use(cookieSession({
  name: 'session',
  keys: ['keys1', 'keys2']
}));

module.exports = {
  currentUser: (req, res, next) => {
    if (req.session.userId) {
      let userID = req.session.userId;
      let user = users.getUser(userID);
      if (!user) {
        req.session = null;
        next();
      }
      user["urls"] = urlDB.getUserURLs(user.id);
      req.currentUser = user;
    }
    next();
  }
};