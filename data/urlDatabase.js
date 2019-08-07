const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "tinyURL" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "tinyURL" }
};

module.exports = {
  all: () => urlDatabase,
  add: (tinyURL, urlObj) => {
    urlDatabase[tinyURL] = urlObj;
  },
  getUserURLs: (user) => {
    let userURLs = [];
    Object.keys(urlDatabase).filter(url => urlDatabase[url].userID === user).forEach(u => {
      let obj = {
        shortURL: u,
        longURL: urlDatabase[u].longURL
      };
      userURLs.push(obj);
    });
    return userURLs;
  }
};