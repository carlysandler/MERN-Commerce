const { faker }= require('@faker-js/faker');
const path = require("path")
const { User } = require('../models/User')
const { toEmailCase } = require("./formatters")
require("dotenv").config()
const mongoose = require("mongoose")

/* testing for each unique scenario: (Admin, User, provider)
	we need one Admin, and one user for each passport strategy
	- local strategy
	- jwt strategy ?
	- googleId strategy
	- facebookId strategy
	- appleId strategy
*/



// server/public/images/defaultAvatar.png
const userPromises = [...Array(4).keys()].map((i) => {
	const fakeName = faker.name.firstName() + ' ' + faker.name.lastName()

	const user = new User({
		name: fakeName,
		email: toEmailCase(fakeName),
		provider: "email",
		password: '1234567890',
		isVerified: false,
		avatar: faker.image.avatar(),
		role: "USER"
	});


	if (i === 0) {
		user.name = "Carly Sandler",
		user.email = process.env.DEV_EMAIL,
		user.password = process.env.DEV_PASSWORD,
		user.role = "ADMIN",
		user.avatar = "https://icon-library.com/images/default-profile-icon/default-profile-icon-4.jpg"
	}

	user.registerUser(user, () => {})

	return user;

})



module.exports = {
	userPromises
}

