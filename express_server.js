const express = require('express');
const app = express();
const bodyParser = require("body-parser");
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const {currentUser} = require('./middleware/currentUser');

const { all, add, getUser, getValueFromUser, getUserWhereValueIs } = require('./users');
const urlDB = require('./urlDatabase');

const PORT = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['turtle-force=five', 'backgammon']
}));
app.use(currentUser);

let users = all();

app.set('view engine', 'ejs');

// Index
app.get('/', (req, res) => {
  if (req.currentUser) {
    res.redirect('/urls/:' + req.currentUser.id);
  }
  res.redirect('/login');
});

/*

  Login and log out

*/

app.post("/login", (req, res) => {
  if (req.currentUser) {
    res.redirect('/urls');
  }

  let user = getUserWhereValueIs('email', req.body.email);

  if (user && checkPW(user.id, req.body.password)) {
    let id = user.id;
    setCookie(req, id);
    res.redirect('/urls');
  } else {
    let message = 'Wrong login credentials, try again cretin';
    let templateVars = {
      username: undefined,
      message,
      error: true
    };
    res.render('login', templateVars);
  }
});

app.get('/login', (req, res) => {
  if (req.currentUser) {
    res.redirect('/urls');
  }

  let message = 'Log in, please';
  let templateVars = {
    username: undefined,
    message,
    error: false
  };
  res.render('login', templateVars);
});

app.post("/logout/", (req,res) => {
  req.session = null;
  res.redirect('/login');
});

/*

  longURL redirect

*/

app.get("/u/:shortURL", (req, res) => {
  // let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  // res.render("urls_show", templateVars);
  const longURL = urlDB.all()[req.params.shortURL].longURL;
  res.redirect(longURL);
});

/*

  URL Main page, and User page

*/

app.get('/urls', (req, res) => {
  if (!req.currentUser) {
    res.redirect('/login');
  }
  let templateVars = {
    urls: req.currentUser.urls || [],
    username: req.currentUser.name
  };
  // if user does not have any urls, redirect to generate new
  // if (templateVars.urls === undefined) {
  //   res.redirect('/urls/new');
  // }
  res.render('urlsIndex', templateVars);
});

// Add new tinyURL, then redirect to new URL's info page
app.post("/urls", (req, res) => {
  if (req.currentUser) {
    let urlShortened = generateRandomString();
    let newURL = {
      longURL: req.body.longURL,
      userID: req.currentUser.id
    };

    urlDB.all()[urlShortened] = newURL;
  
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

// New URL page

app.get("/urls/new", (req, res) => {
  if (!req.currentUser) {
    res.redirect('/login');
  }
  let templateVars = {
    username: req.currentUser.name
  };
  res.render("urls_new", templateVars);
});

// selected URL info page

app.get("/urls/:shortURL", (req, res) => {
  if (!req.currentUser) {
    res.redirect('/login');
  } else if (!belongToUser(req.currentUser, req.params.shortURL)) {
    res.redirect('/urls');
  }
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDB.all()[req.params.shortURL].longURL,
    username: req.currentUser.name
  };
  res.render("urls_show", templateVars);
});

// Update/change the longURL link of a selected tinyURL
app.post("/urls/:id", (req, res) => {
  if (!req.currentUser) {
    res.redirect('/login');
  } else if (!belongToUser(req.currentUser, req.params.id)) {
    res.redirect('/urls');
  } else {
    urlDB.all()[req.params.id].longURL = req.body.longURL;
    res.redirect("/urls");
  }
});

// Delete a tinyURL
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.currentUser || !belongToUser(req.currentUser, req.params.shortURL)) {
    res.redirect('/login');
  } else {
    delete urlDB.all()[req.params.shortURL];
    res.redirect('/urls');
  }
});


/*

  Registration

*/

// Registers a new user. Adding to database, and then log in user

app.post('/register', (req, res) => {
  if (
    !getUserWhereValueIs('email', req.body.email)
    && req.body.email !== ''
    && req.body.password !== ''
  ) {
    let newId = generateRandomString();
    let newUser = {
      id: newId,
      name: req.body.name,
      email: req.body.email,
      password: encryptPW(req.body.password)
    };
    add(newUser);
    setCookie(req, newId);
    res.redirect('/urls');
  } else {
    let message = 'Idiot! ';
    if (req.body.email === '') {
      message += 'You need an email! ';
    } else if (getUserWhereValueIs('email', req.body.email)) {
      message += 'Someone already used that email...get your own! ';
    }

    if (req.body.password === '') {
      message += 'You need a password, dummy! ';
    }

    message += 'Try again...please';

    let templateVars = {
      username: undefined,
      message
    };
    res.render('registration', templateVars);
  }
});

app.get('/registration', (req, res) => {
  res.render('registration', { username: undefined, message: undefined });
});

//
// app.get('/whoa', (req,res) => {
//   res.render('whoa');
// });

// app.get('/path/:where', (req, res) => {
//   let arg = res.params.where;

// })

app.listen(PORT, () => {
  console.log('Server listening to port:',PORT);
});

const encryptPW = (str) => {
  return bcrypt.hashSync(str, 10);
};

const checkPW = (userID, str) => {
  let encryptedPW = getValueFromUser(userID, 'password');
  return bcrypt.compareSync(str, encryptedPW);
};

const belongToUser = (currentUser,urlID) => {
  if (currentUser.urls.filter(obj => obj.shortURL === urlID).length < 1) {
    return false;
  } else {
    return true;
  }
};

const setCookie = (req, id) => {
  req.session.userId = id;
};

const generateRandomString = () => {
  const ALPHA = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let urlStr = '';

  for (let i = 0; i < 6; i++) {
    urlStr += ALPHA[Math.floor(Math.random() * ALPHA.length)];
  }

  return urlStr;
};