const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const auth = require('../auth');

module.exports.emailExists = (params) => {
	return User.find({ email: params.email }).then(result => {
		return result.length > 0 ? true : false;
	})
};

module.exports.register = (params) => {
	let user = new User({
		firstName: params.firstName,
		lastName: params.lastName,
		email: params.email,
		password: bcrypt.hashSync(params.password, 10),
        loginType: 'email'
	});

	return user.save().then((user, err) => {
		return (err) ? false : true;
	})
};

module.exports.login = (params) => {
	return User.findOne({ email: params.email }).then(user => {
		if (user === null) {
			return { error: 'does-not-exist'};
		}
		if (user.loginType !== 'email'){
			return { error: 'login-type-error'};
		}

		const isPasswordMatched = bcrypt.compareSync(params.password, user.password);

		if(isPasswordMatched){
			return { accessToken: auth.createAccessToken(user.toObject())};
		} else {
			return { error: 'incorrect-password'};
		}
	})
};

module.exports.get = (params) => {
	return User.findById(params.userId).then(user => {
		user.password = undefined;
		return user;
	})
};

module.exports.verifyGoogleTokenId = async (tokenId) => {
	const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
	const data = await client.verifyIdToken({
		idToken: tokenId,
		audience: process.env.GOOGLE_CLIENT_ID
	});

	console.log(data.payload.email_verified);

	if(data.payload.email_verified === true){
		const user = await User.findOne({ email: data.payload.email });

		if (user !== null){
			
			if(user.loginType === 'google'){
				return { accessToken:auth.createAccessToken(user.toObject())};
			} else {
				return { error : "login-type-error" };
			}

		} else {
			let user = new User({
				firstName: data.payload.given_name,
				lastName: data.payload.family_name,
				email: data.payload.email,
		        loginType: 'google'
			});

			return user.save().then((user, err) => {
				return { accessToken:auth.createAccessToken(user.toObject())};
			})
		}

	} else {
		return { error: "google-auth-error" };
	}
};

module.exports.addCategory = (params) => {
	return User.findById(params.userId).then(user => {
		console.log(user)
		user.categories.push({
			name: params.name,
			type: params.type
		})
		return user.save().then((user, err) => {
			return (err) ? false : true;
		})
	})
	
};

module.exports.addRecord = (params) => {
	return User.findById(params.userId).then(user => {

		user.records.push({
			name: params.name,
			type: params.type,
			amount: params.amount,
			description: params.description
		})
		return user.save().then((user, err) => {
			return (err) ? false : true;
		})
	})	
};