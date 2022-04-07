require("dotenv").config()
const nodemailer = require('nodemailer');
const { google } = require("googleapis")
const OAuth2 = google.auth.OAuth2
const { logger } = require("../config/winston");

const user = process.env.TEST_EMAIL
const clientId = process.env.MAILER_CLIENT_ID
const clientSecret = process.env.MAILER_CLIENT_SECRET
const redirectUrl = "https://developers.google.com/oauthplayground"
const refreshToken = process.env.MAILER_REFRESH_TOKEN

// Set up our OAuth client
const oauth2Client = new OAuth2(
	clientId,
	clientSecret,
	redirectUrl,
)

// Provide refresh token to generate new access token (google gives us an access token with 3600 s expiration)
oauth2Client.setCredentials({
	refresh_token: refreshToken
})
const accessToken = oauth2Client.getAccessToken()


// Describe mailer transport process using SMTP and nodemailer
const smtpTransport = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: user,
		clientId: clientId,
		clientSecret: clientSecret,
		refreshToken: refreshToken,
		accessToken: accessToken
	}
})

// Create email content
const mailOptions = {
	from: user,
	to: "carly.sandler@gmail.com",
	subject: "Testing Node.js Email with Secure OAuth",
	generateTextFromHTML: true,
	html: "<b>Testing Nodemailer Connection</b>"
}


// Send email and provide cb function to catch unexpected errors
smtpTransport.sendMail(mailOptions, (err, info) => {
	if (err) {
		throw err;
	} else logger.info("Email sent successfully:\n " + info.response)
})

