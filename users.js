const users = { 
  "userRandomID": {
    name: "General Cacti",
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    name: "Captain Benedict Cabbagepatch",
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

module.exports = {
  all: () => { return users },
  add: (user) => { users[user.id] = user },
  getUser: (userId) => {
    let user = Object.keys(users).filter(user => user === userId);
    return users[user];
  }
}