const { expect } = require('chai');
const { getUser, getValueFromUser, getUserWhereValueIs } = require('../data/users');

describe("usersDatabase", () => {
  it("(for getUser) returns a user when getUser is called", () => {
    let input = 'aJ48lW';
    let output = {
      name: "General Cacti",
      id: "aJ48lW",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    };
    expect(getUser(input)).to.eql(output);
  });

  it("(for getUser) should not return a user when an id that doesn't exist is passed in", () => {
    let input = "blahblah";
    expect(getUser(input)).to.be.undefined;
  });

  it("(for getValueFromUser) should return email of user when passed in correct information", () => {
    let inputID = 'aJ48lW';
    let field = 'email';
    let output = 'user@example.com';
    expect(getValueFromUser(inputID,field)).to.equal(output);
  });

  it("(for getUserWhereValueIs) should return correct user with given email", () => {
    let inputField = 'email';
    let inputEmail = 'user@example.com';
    let output = {
      name: "General Cacti",
      id: "aJ48lW",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    };
    expect(getUserWhereValueIs(inputField, inputEmail)).to.eql(output);
  });

  it("(for getUserWhereValueIs) should return undefined for an invalid userID", () => {
    let inputField = 'email';
    let inputEmail = 'babeBearApocalypse@example.com';
    let output = undefined;
    expect(getUserWhereValueIs(inputField, inputEmail)).to.eql(output);
  });
});