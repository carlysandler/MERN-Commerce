const Joi = require("joi");

function isImageUrl(url) {
	const regex = /^https?:\/\/\S+\.(jpg|jpeg|png|gif|svg)$/
	return regex.test(url);
}

/* Joi schema validators */
function validateUser(user) {
	const schema = {
		name: Joi.string().required(),
		email: Joi.string().regex(/^\S+@\S+\.\S{2,}$/).trim().required(),
		avatar: Joi.string().regex(/^https?:\/\/.*\.(jpg || jpeg || png)$/),
		password: Joi.string().min(6).max(24).allow(null).allow('') // 3rd party auth
	}

	return schema.validate(user)
}

const registrationSchema = Joi.object({
	name: Joi.string().regex(/^[a-zA-Z]+ ([a-zA-Z]+)+$/ ).required(),
	email: Joi.string().email({ minDomainSegments: 2}).trim().required(),
	password: Joi.string().min(6).max(24).trim().required(),
	repeatPassword: Joi.string().valid(Joi.ref("password")).required()

})
.with("password", "repeatPassword")

const localLoginSchema = Joi.object({
	email: Joi.string().email({ minDomainSegments: 2}).trim().required(),
	password: Joi.string().min(6).max(24).trim().required(),
})
function validateEmail(reqBody) {
  const schema = Joi.object({
   email: Joi.string().email({ minDomainSegments: 2}).trim().required(),
  });

  return schema.validate(reqBody);
}

function validatePassword(reqBody) {
  const schema = Joi.object({
    password: Joi.string().min(6).max(24).trim().required(),
		repeatPassword: Joi.string().valid(Joi.ref("password")).required()
  });
  return schema.validate(reqBody);
}

module.exports = {
	isImageUrl,
	validateUser,
	registrationSchema,
	localLoginSchema,
	validateEmail,
	validatePassword,

}


