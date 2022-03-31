export default function isImageUrl(url) {
	const regex = /^https?:\/\/\S+\.(jpg|jpeg|png|gif|svg)$/
	return regex.test(url);
}



