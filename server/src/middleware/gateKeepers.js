const passport = require('passport')

// require passport-local as middleware
const requireLocalPassport = (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
	 if (err) {
      return next(err);
    }
    if (info && info.message === "Missing credentials") {
      return res.status(400).send(info, { message: "Missing credentials" });
    }
    if (!user) {
      return res.status(400).send({ message: "Invalid email or password." });
    }
    if (!user.isVerified)
      return res.status(401).send({
        message: "Your account has not been verified. Please activate your account.",
      });

		req.user = user;
		next()

		})(req, res, next);

}


// require passport jwt strategy


// isAdmin protected routes
