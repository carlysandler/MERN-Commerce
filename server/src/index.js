require("dotenv").config()
const compression = require("compression");
const express = require("express")
const path = require("path")
const https = require("https")
const passport = require("passport")
const bodyParser = require("body-parser")
const cors = require("cors")
const { readFileSync } = require("fs")
const { morganMiddleware } = require("./config/morgan");
const { logger } = require("./config/winston")


const app = express()

// body parsing middleware for incoming requests - req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start passport instance
app.use(passport.initialize());


// @@todo Startup config scripts
app.use(cors({ credentials: true }));

require('./passport/google')

// Auth and Api Routes
app.use("/auth", require("./routes/auth/"));

app.get("/public", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "/public"))
	)



app.get("/logger", (_, res) => {
	logger.error("This is an error log");
  logger.warn("This is a warn log");
  logger.info("This is a info log");
  logger.https("This is a http log");
  logger.debug("This is a debug log");
	res.send("testing!");
})


// Serving static assets middleware
app.use('/public',express.static(path.join(__dirname, "..", "public")));

// catch 404 errors (any remaining requests with an extension)
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error("Not found");
    res.send(err).status(404);
		console.log(err.stack)
    next(err);
  } else {
    next();
  }
});


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
	app.listen(PORT, logger.info(`Server listening on port ${PORT}`));
}
else {
 // dev only logging middleware
  app.use(morganMiddleware);

	// error handling endware
		app.use((err, req, res, next) => {
		res.locals.error = err.message
		logger.error(err.message)
		logger.error(err.stack)
		// render the error page
		res.status(err.status || 500)
		res.json({ err } || "Internal Server Error.")
	})

	const PORT = process.env.PORT || 1337 // dev server url

	// open-ssl certificate: grant access to encrypted https protocol
	const httpsOptions = {
		key: readFileSync(path.resolve(__dirname, "../security/key.pem")),
		cert: readFileSync(path.resolve(__dirname, "../security/cert.pem"))

	}

 https.createServer(httpsOptions, app)
	.listen(PORT, (err) => {
		if (err) {
			logger.error(err)
		}
		logger.info(`
		Server listening on port ${PORT}\n
		-------------------------------\n
		${process.env.SERVER_DEV}`)

	})

}

module.exports = {
	isProduction,

}
