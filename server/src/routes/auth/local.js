const router = require("express").Router();
const passport = require("passport");
const { logger } = require("../../config/winston");
const Joi = require("Joi")
const moment = require("moment");
const { User, hashPassword } = require("../../models/User")
const {toEmailCase, toProperCase } = require("../../utils/formatters")

const {
	validateUser,
	registrationSchema,
	localLoginSchema,
	validateEmail,
	validatePassword
} = require("../../utils/validators");
const { requireLocalPassport } = require("../../middleware/gateKeepers");
const { default: faker } = require("@faker-js/faker");

// nodemailer
const _TOKEN = Math.floor((Math.random() * 100) + 88);
const senderEmail = process.env.DEV_EMAIL // your email here

/**
 * @params Object/req.body {{email, password]}}
 * @returns HTTP Success => res.status = 200 || HTTP Failure => res.status = 400, 401, 422
 * @returns {{ user, info, message }}
 */

router.post("/login", requireLocalPassport, (req, res) => {
	const jwtToken = req.user.generateToken();
	const me = req.user.toJSON();
	if (!req.user ) {
		const error = new Error("Incorrect Email or Password");
		return res.status(401).send({ message: "Authentication failed", error})
	}
	res.json({me, jwtToken})

})

router.post("/register", async (req, res, next) => {
	const { error } = Joi.validate(req.body, registrationSchema)
	if (error) {
		logger.error(error.stack, error.details)
		return res.status(422).send({ message: error.details[0].message})
	}
	const { name, email, password } = req.body

	try {
		const isReturningUser = await User.findOne({ email })
		if (isReturningUser) {
			return res.status(401).send({ message: "User already exists"})
		} else {
			const user = await new User({
						name: toProperCase(name),
						email: email.toLowerCase(),
						password: password,
						provider: 'email',
						avatar: null,

			})
			user.registerUser(user, (err) => {
				if (err) {
					logger.error(err)
					throw err
				}
				res.status(200).send("Registration Successful!")
			})


			// @@todo: implement email validation via nodemailer

		}
	} catch (err) {
		next(err)
	}

});

router.get("/me", async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization));
  } catch (err) {
    next(err);
  }
});


router.get("/logout", async (req, res, next) => {
	try {
		req.logout((err) => {;
			if (err) {
				res.status(500).send({ message: "Logout failed", err})
			}
		})
		res.json({ loggedIn: false})
	} catch (err) {
		next(err)
	}
})



