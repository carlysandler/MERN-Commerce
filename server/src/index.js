require("dotenv").config()
const compression = require("compression");
const express = require("express")
const path = require("path")
const https = require("https")
const passport = require("passport")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
const { readFileSync } = require("fs")
const {connectDB} = require("./config/db")

const app = express()

// body parsing middleware for incoming requests - req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start passport instance
app.use(passport.initialize());



// Connect to the database
connectDB();

// @@todo Startup config scripts
app.use(cors({ credentials: true }));
// @@todo Use auth and api routes

// Serving static assets middleware
app.use('/public',express.static(path.join(__dirname, "..", "public")));

// Serving static assets if in Production
const isProduction = process.env.NODE_ENV === "production"
if (isProduction) {
	app.use(express.static(path.join(__dirname, "../..", "client/build")))

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../..", "client", "build", "index.html")) // new absolute root path
	})

	app.use(helmet()); // protects http headers from security vulnerabilities
  app.use(compression()); // // drastically reducing size of response body file for node.js performance improvement

	// production port
	const PORT = process.env.PORT || 80 // http protocol port (443 for https - secure & encrypted http)
	app.listen(PORT, console.log(`Server listening on port ${PORT}`));
}
else {
	app.use(morgan()); // dev only logging middleware
	const PORT = process.env.PORT || 1337 // dev server url

	// @@todo: ADD https option key and cert for facebook-passport

	const server = https.createServer(app).listen(PORT, () =>
		console.log(`Server listening on port ${PORT}\n
								${process.env.SERVER_DEV}`))
}
