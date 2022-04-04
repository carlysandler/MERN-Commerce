const { map } = require("lodash")

// retrieve each models documents by the objectId
module.exports = function documentsById(documents) {
	map(documents, ({ id }) => id)
}
