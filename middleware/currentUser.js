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
    if (req.session.user_id) {
      let userID = req.session.user_id;
      let user = users.getUser(userID);
      if (!user) {
        req.session.user_id = null;
        next();
      }
      user["urls"] = urlDB.getUserURLs(user.id);
      req.currentUser = user;
    };
    next();
  }
}