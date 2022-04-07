const { User } = require("../models/User");
const { userPromises } = require("./generateUsers");
const { logger } = require("../config/winston");
require("dotenv").config()
const { connectDB } = require("../config/db")

const DELAY_FUNCTION_TIME = 15000;



const seed = async () => {

		if (process.env.NODE_ENV !== 'production') {
			try {
				logger.info(`🌱 Seeding Database`)

				// reset the db
				await User.deleteMany({})

				// Waits for all MongoDB document save promises to resolve then..
				const savedUsers = await User.insertMany(userPromises)
				logger.info(`Successfully seeded ${savedUsers.length} users`)
				logger.info(savedUsers)

			} catch (err) {
					logger.error(" 🛑 Failed to seed database")
					logger.error(err.stack)
			}


		}
}



const runSeed = async () => {
	// if db is not already connected...
	try {
		// connect to db
		await connectDB()
		// import data
		await seed();
	} catch (err) {
		return logger.error('Error seeding the database', err)

	}
}



if (module === require.main || !module.parent) {
	runSeed()
	.then(() => process.exit())

}

// exporting seed function for testing purposes
module.exports = { seed }

