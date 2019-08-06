const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const { all, add, getUser, getValueFromUser, getUserWhereValueIs } = require('./users');

const PORT = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let users = all();

let currentUser = '';

let templateVars = {
  username: currentUser
}

app.set('view engine', 'ejs');

// Index 
app.get('/', (req, res) => {
  if (req.cookies.username) {
    currentUser = req.cookies.username
  }
  res.render('urlsIndex');
});

/*

  Login and log out

*/

app.post("/login", (req, res) => {
  let user = getUserWhereValueIs('email', req.body.email);

  if (user && req.body.password === getValueFromUser(user.id, 'password')) {
    let id = user.id;
    setCookie(res, id);
    res.redirect('/urls')
  } else {
    let message = 'Wrong login credentials, try again cretin'
    let templateVars = {
      username: currentUser,
      message,
      error: true
    }
    res.render('login', templateVars)
  }
});

app.get('/login', (req, res) => {
  let message = 'Log in, please';
  let templateVars = {
    username: currentUser,
    message,
    error: false
  }
  res.render('login', templateVars);
});

app.post("/logout/", (req,res) => {
  res.clearCookie("id");
  currentUser = '';
  res.redirect('/urls');
})

/*

  longURL redirect

*/

app.get("/u/:shortURL", (req, res) => {
  // let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  // res.render("urls_show", templateVars);
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

/*

  URL Main page, and User page

*/

app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: currentUser
  }
  res.render('urlsIndex', templateVars);
});

// Add new tinyURL, then redirect to new URL's info page
app.post("/urls", (req, res) => {  
  let urlShortened = generateRandomString();
  urlDatabase[urlShortened] = req.body.longURL;

  res.redirect('/urls/' + urlShortened);
});

// New URL page

app.get("/urls/new", (req, res) => {
  if (!req.cookies['id']) {
    res.redirect('/login')
  }
  let templateVars = {
    username: currentUser
  }
  res.render("urls_new", templateVars);
});

// selected URL info page

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: currentUser
  };
  res.render("urls_show", templateVars);
});

// Update/change the longURL link of a selected tinyURL
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls/" + req.params.id);
});

// Delete a tinyURL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls');
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
      password: req.body.password
    }
    add(newUser);
    currentUser = newUser.name;
    setCookie(res, newId);
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
      username: currentUser,
      message
    }
    res.render('registration', templateVars);
  }
});

app.get('/registration', (req, res) => {
  res.render('registration', templateVars);
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

const setCookie = (res, id) => {
  res.cookie('id', id);
  let user = getUser(id);
  currentUser = user.name;
}

const generateRandomString = () => {
  const ALPHA = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let urlStr = '';

  for (let i = 0; i < 6; i++) {
    urlStr += ALPHA[Math.floor(Math.random() * ALPHA.length)];
  }

  return urlStr;
}