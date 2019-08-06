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

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('urlsIndex');
});

app.post("/login", (req, res) => {
  let user = getUserWhereValueIs('email', req.body.email);

  if (req.body.password === getValueFromUser(user.id, 'password')) {
    let id = user.id;
    setCookie(res, id);
    res.redirect('/urls')
  } else {
    res.redirect('/loginFail')
  }
});

app.get('/loginFail', (req, res) => {
  let templateVars = {
    username: currentUser
  }
  res.render('loginFail', templateVars);
});

app.post("/logout/", (req,res) => {
  res.clearCookie("username");
  currentUser = '';
  res.redirect('/urls');
})

app.get("/u/:shortURL", (req, res) => {
  // let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  // res.render("urls_show", templateVars);
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: currentUser
  }
  res.render('urlsIndex', templateVars);
});

app.post("/urls", (req, res) => {  // Log the POST request body to the console
  let urlShortened = generateRandomString();
  urlDatabase[urlShortened] = req.body.longURL;

  res.redirect('/urls/' + urlShortened);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: currentUser
  }
  res.render("urls_new", templateVars);
});


app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls/" + req.params.id);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: currentUser
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
  let newId = generateRandomString();
  let newUser = {
    id: newId,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }
  add(newUser);
  currentUser = newUser.name;
  if (req.cookies['username']) {
    req.clearCookie('username');
  }
  res.redirect('/urls')
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