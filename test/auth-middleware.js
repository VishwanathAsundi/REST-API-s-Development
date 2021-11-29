const expect = require("chai").expect;
const authMiddleWare = require("../middleware/is-auth");

it("should check for non existance of authorization header", function() {
  const req = {
    get: function(header) {
      return null;
    }
  };
  expect(authMiddleWare.bind(this, req, {}, () => {})).to.throw(
    "Not Authorized"
  );
});
it("should check for existance of authorization header and jwt token", function() {
  const req = {
    get: function(header) {
      return "Bearer sdfshfhdfgdfhbghdfbghjdfbghjbgbdhgjbdfbdgbfj";
    }
  };
  expect(authMiddleWare.bind(this, req, {}, () => {})).is.not.null;
});
