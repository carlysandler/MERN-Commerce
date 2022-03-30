const Joi = require("Joi")

// mongodb object id validation
module.exports = function () {
	Joi.objectId = require("joi-objectid")(Joi)
}
