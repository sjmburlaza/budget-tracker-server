const jwt = require('jsonwebtoken');

module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email
	}

	return jwt.sign(data, process.env.SECRET, {});
}

module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;

	if (typeof token !== 'undefined') {
		token = token.slice(7, token.length)

		return jwt.verify(token, process.env.SECRET, (err, data) => {
			return (err) ? res.send({ auth: 'failedx' }) : next();
		})
	} else {
		return res.send({ auth: 'failedy' });
	}
}

module.exports.decode = (token) => {
	if (typeof token !== 'undefined') {
		token = token.slice(7, token.length);

		return jwt.verify(token, process.env.SECRET, (err, data) => {
			return (err) ? null : jwt.decode(token, { complete: true }).payload;
		})
	} else {
		return null;
	}
}