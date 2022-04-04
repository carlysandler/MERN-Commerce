require("dotenv").config();
const mongoose = require("mongoose");


// Make async connection to DB
const connectDB = async () => {

	const isProduction = process.env.NODE_ENV === "production";
	const db = isProduction ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV
	const options = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
	 await mongoose
			.connect(db, options)
			.then(() => {
				console.log('Successfully connected to MongoDB...')

			})
			.catch((err) => console.error(err))

	}



module.exports = { connectDB }
