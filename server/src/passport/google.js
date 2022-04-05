
require("dotenv").config();
const passport = require('passport')
const  GoogleStrategy  = require('passport-google-oauth2').Strategy
const { logger } = require("../config/winston");
const { User } = require("../models/User")
const { isProduction } = require("../index")

// option params for google strategy
const callbackUrl = !isProduction ? `${process.env.SERVER_DEV}${process.env.GOOGLE_CB_ROUTE}` : `${process.env.SERVER_PROD}${process.env.GOOGLE_CB_ROUTE}`
const clientId = process.env.GOOGLE_CLIENT_ID
console.log(clientId)
const clientSecret = process.env.GOOGLE_CLIENT_SECRET


if (!(clientId || clientSecret)) {
	logger.warn("Google client ID and/or client secret is required. Skipping Google OAuth")
}

// set up config for passport Oauth2 strategy
const googleConnect = {
	clientID: clientId,
	clientSecret: clientSecret,
	callbackURL: callbackUrl,

}

const googleAuth = new GoogleStrategy(googleConnect,
	async (accessToken, refreshToken, profile, done) => {
		/**
		 *  dev route for testing: https://localhost:1337/auth/google/
		 * success route: auth/google/success
		 * failer route: auth/google/failure
		 * callbacl route: auth/google/callback
		*/
		console.log(profile)
		try {
			const isReturningUser = await User.find({ email: profile.email})

			if (isReturningUser) {
				return done(null, isReturningUser)
			} else {
				const newUser = await new User({
					id: profile.id,
					name: profile.displayName,
					email: profile.email,
					password: profile.password,
					provider: 'google',
					googleId: profile.id,
					avatar: profile.image
				}).save()

				done(null, newUser)
			}
		} catch (err) {
			logger.error(err, err.stack``)
		}

	}
)
passport.use(googleAuth)

// once authentication is successful, user detauls get saved in cookie





