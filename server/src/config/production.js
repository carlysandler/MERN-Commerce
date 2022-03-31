const helmet = require("helmet");
const compression = require("compression");

module.exports = function (app) {
  if (process.env.NODE_ENV === "production") {
    app.use(helmet()); // protects http headers from security vulnerabilities
    app.use(compression()); // // drastically reducing size of response body file for node.js performance improvement
  }
};
