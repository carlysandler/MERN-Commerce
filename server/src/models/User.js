const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken")
const moment = require("moment");
moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: [true, "Cannot be empty"],
			unique: [true, "Email already exists"],
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S{2,}$/, "is not a valid email address"],
			index: true,
		},
		provider: {
			type: String,
			required: true,
			default: "EMAIL",
			enum: ["EMAIL", "GOOGLE", "FB", "APPLE"],
			set: () => {
				!(this.googleId || this.facebookId || this.appleId) ? "EMAIL" :
				(this.googleId) ? "GOOGLE" :
				(this.facebookId) ? "FB" : "APPLE";
			}
		},
		password: {
			type: String,
			minLength: 8,
			maxLength: 24,
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

	}, { timestamps: true },
);
