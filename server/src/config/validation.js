const Joi = require("Joi")

// mongodb object id validation
module.exports = function joiValidator () {
	Joi.objectId = require("joi-objectid")(Joi)
}
