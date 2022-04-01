const winston = require("winston");
/* Customizing and configuring app logs for debugging */

// Differentiate log levels by order of severity
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4
}
const level = () => {
    const env = process.env.NODE_ENV || "development";
    const isDevelopment = env === "development";
    isDevelopment ? "debug" : "warn";
};
const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "white",
};

// Link colors defined above to each severity level
winston.addColors(colors);

// Customize log formatting
const format = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.ms" }),
	winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)

);

// Define storage locations for winston logger to print messages
const transports = [
	new winston.transports.Console(),
	new winston.transports.File({
		filename: "logs/error.log",
		level: "error",
	}),
	new winston.transports.File({ filename: "logs/all.log" }),
];

// Create the logger instance
const logger = winston.createLogger({
	level: level(),
	levels,
	format,
	transports
});

module.exports = { logger };
