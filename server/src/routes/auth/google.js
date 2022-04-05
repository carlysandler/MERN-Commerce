const router = require("express").Router()
const passport = require("passport")
const { isProduction } = require("../../index")

/**
 * GET /auth/google
 */

router.get("/", passport.authenticate("google",  { scope: ["email", "profile" ]}))

/* https://localhost:8080 */
const clientUrl = isProduction ? `${process.env.CLIENT_PROD}`: `${process.env.CLIENT_DEV}`;


/**
 * GET /auth/google/callback
 */

router.get("/callback", passport.authenticate("google", {
	failureRedirect: "/failure",
	session: false,

	}), (req, res) => {
		try {
			const token = req.user.generateToken();

			logger.info("token generated")
			logger.info(token)

			res.cookie('x-auth-cookie', token)
			res.redirect("/")
		} catch (err) {
			console.error(err, err.stack)
		}
	}
)

module.exports = router;
