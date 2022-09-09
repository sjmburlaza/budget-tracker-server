const express = require('express');
const router = express.Router();
const auth = require('../auth');
const UserController = require('../controllers/user');

// [SECTION] Primary Routes

router.post('/email-exists', (req, res) => {
    UserController.emailExists(req.body).then(result => res.send(result))
})

router.post('/register', (req, res) => {
    UserController.register(req.body).then(result => res.send(result))
})

router.post('/login', (req, res) => {
    UserController.login(req.body).then(result => res.send(result))
})

router.get('/details', auth.verify, (req, res) => {
	const user = auth.decode(req.headers.token);
    UserController.get({ userId: user.id }).then(user => res.send(user))
})

router.post('/add-category', auth.verify, (req, res) => {
	const params = {
			name: req.body.name,
			type: req.body.type,
			userId: auth.decode(req.headers.token).id
		}

    UserController.addCategory(params).then(user => res.send(user))
})

router.post('/add-record', auth.verify, (req, res) => {
	const params = {
			name: req.body.name,
			type: req.body.type,
			amount: req.body.amount,
			description: req.body.description,
			userId: auth.decode(req.headers.token).id
		};

    UserController.addRecord(params).then(user => res.send(user))
})


// [SECTION] Integration Routes

router.post('/verify-google-id-token', async (req, res) => {
    res.send(await UserController.verifyGoogleTokenId(req.body.tokenId))
})


module.exports = router;