const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const moment = require("moment");
moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
const mongoose = require("mongoose");
const { isImageUrl } = require("../utils/validators")
const { logger } = require("../config/winston");
const { assert } = require("joi");


const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: [true, "Please add an email address"],
			unique: [true, "Email already exists"],
			lowercase: true,
			trim: true,
			match: [/^\w+([\.-]?\w+)*@\S+([\.]?\w+)?:*(\.\w{2,6})+$/, "Please add a valid email address"],
			index: true,
		},
		provider: {
			type: String,
			required: true,
			default: "email",
			enum: ["email", "google", "facebook", "apple"]

		},
		password: {
			type: String,
			minLength: 6,
			maxLength: 72,
			trim: true
		},
		isVerified: {
			type: Boolean,
			required: true,
			default: false
		},
		passwordResetToken: {
			type: String,
			default: "",
		},
		passwordResetExpires: {
			type: Date,
			default: moment().utcOffset(0)
		},

		avatarURL: {
			type: String,
			alias: "avatar"
		},
		role: {
			type: String,
			required: true,
			enum: ["USER", "ADMIN"],
			default: "USER"
		},
		// googleId: {
		// 	type: String,
		// 	unique: true,
		// 	parse: true,
		// 	index: true,
		// },
		// facebookId: {
		// 	type: String,
		// 	unique: true,
		// 	parse: true,
		// 	index: true,
		// },

	}, { timestamps: true },
);


/* Virtual properties */
userSchema.virtual("firstName").get(function () {
	return `${this.name.split(' ')[0]}`
})
userSchema.virtual("lastName").get(function () {
	return `${this.name.split(' ')[1]}`
})
/* Instance methods */
userSchema.methods = {
	generateToken: function () {
		const isProduction = process.env.NODE_ENV === "production";
		const jwtSecret = isProduction ? JWT_SECRET_PROD : JWT_SECRET_DEV
		return jwt.sign({
				expiresIn: 3.156e+10,
				id: this._id,
				email: this.email,
				provider: this.provider
			},
			jwtSecret
		)
	},
	correctPassword: function (requestPw) {
		return bcrypt.compare(requestPw, this.password, async (err, isMatch) => {
			// compare req.body password with encrypted password
			if (isMatch) {
				logger.info(`hashed pw: ${this.password} and req.body pw: ${requestPW} are a match`)
			}
			else {
				throw new Error("Incorrect password")
			}
		})
	},
	registerUser: function (user, cb) {
		if (!user) return cb(new Error('Failed to register user'));
		// encrypt password string
		bcrypt.genSalt(10, (err, salt) => {
			//
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) {
					logger.error(err)
				}
				// set user password to hash, then register
				user.password = hash;
				user.save(cb)
			})
		})

	},

	toJSON: function () {
		const avatar =
		isImageUrl(avatar) ? this.avatar : `${process.env.IMAGES_SERVER_PATH}defaultAvatar.png`

		return {
			id: this._id,
			name: this.name,
			email: this.email,
			provider: this.provider,
			isVerified: this.isVerified,
			passwordResetToken: this.passwordResetToken,
			passwordResetExpires: this.passwordResetExpires,
			avatar: avatar,
			role: this.role,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,

		}
	}

}

/* Static properties on User Model */
userSchema.statics = {


	findByToken: async function (token) {
		const isProduction = process.env.NODE_ENV === "production"
		const jwtSecret = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV
		try {
			const { id } = await jwt.verify(token, jwtSecret)
			const user = User.findOne({id: id});
			const error = user.validateSync()
			if (error) {
				assert.equal(error.errors["id"].message, "Invalid token")
			}
			return user;
		} catch (err) {
			err.status = 401;
			logger.error(err);

		}
	},
	authenticate: async function ({ email, password }) {
		const user = await this.findOne({ email: {email}});
		if (!user || (await user.correctPassword(password))) {
			const error = Error("Incorrect email or password. Try again.");
			error.status = 401;
			throw error;
		}

		return user.generateToken()

	}
}

//
 async function hashChangePassword(password, saltRounds = 10) {
	try {
		return  await bcrypt.hash(password, saltRounds);

	} catch (err) {
		logger.error(err)
	}
}

// Create the User model
const User = mongoose.model('User', userSchema)


module.exports = { User, hashChangePassword }
