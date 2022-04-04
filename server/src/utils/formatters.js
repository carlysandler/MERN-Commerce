// Proper Case
function toEmailCase(str) {
	return (
		`${str
			.toLowerCase()
			.split(' ')
			.join(".")
			.trim()
			}@ethereal.email`
	)
}

function toSnakeCase(str) {
	return (
		str
		.toLowerCase()
		.replace(/\s+/g, "_")
		.trim()
	)
}

function toProperCase(str) {
	return (
		str
		.toLowerCase()
		.split(" ")
		.map(word => word[0].toUpperCase() + word.slice(1))
		.join(" ")
	)
}

function undoSnakeCase(str) {
	return (
		str
		.toLowerCase()
		.replace(/_+/g, " ")
		.trim()
	)
}

// console.log(toEmailCase("Carly Sandler"))
// console.log(toProperCase("carLy sandler"))
// console.log(toSnakeCase("Carly Sandler"))
// console.log(undoSnakeCase("carly_sandler"))

module.exports = {
	toEmailCase,
	toProperCase,
	toSnakeCase,
	undoSnakeCase

}
