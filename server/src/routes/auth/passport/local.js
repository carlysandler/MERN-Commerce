require("dotenv").config();
const passport = require('passport')
const  LocalStrategy  = require('passport-local').Strategy
const { logger } = require("../config/winston");
const { User } = require("../models/User")
const { localLoginSchema, registrationSchema } = require("../utils/validators")
const Joi = require("Joi")




const localLoginConnect = {
	usernameField: "email",
	passwordField: "password",
	session: false,
	passReqToCallback: true
}

const localAuth = new LocalStrategy(localLoginConnect,
	(req, email, password, done) => {
		const { error } = Joi.validate(req.body, localLoginSchema)
		console.log(err)
		if (error) return done(null, false, {message: error.details[0].message})

		// otherwise continue with auth
		try {
			const user = User.findOne({ email })
			if (!user) return done(null, false, {message: "Email doesn't exist"})

			if (!user.comparePassword(password)) return done(null, false, {message: "Incorrect passport"})

			return done(null, user)
		} catch (err) {
			return done(err)
		}


	}
)

passport.use(localAuth)
