const morgan = require("morgan");
const { logger } = require("./winston");

/* Override default stream method (console.log)
 and use custom winston logger */

morgan.streamOptions = {
	 // Use http severity for logging requests
	write: message => logger.https(message)
 };

const stream = morgan.streamOptions;

 // Build the middleware
 const morganMiddleware = morgan(
	 // Create custom token to format logging request messages
	 ":method :url :status :res[content-length] - :response-time ms",
	 { stream }

 )

module.exports = { morganMiddleware }

