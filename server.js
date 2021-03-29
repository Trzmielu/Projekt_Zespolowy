const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'sdawfawdfnbawikufbawifbvakwbfikuasbvdiuviwuavdi1232131!#@@!$1'

mongoose.connect(process.env.COSMOS_DB_URI || "mongodb://localhost:27017/SpamBotUsers", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const app = express()

app.use('/', express.static(path.join(__dirname,'static')))
app.use(express.static(__dirname + '/static/'))

app.use(bodyParser.json())

app.post('/api/login',  async (req, res) => {

	const { email, password } = req.body

	const user = await User.findOne({ email }).lean()

	if(!user) {
		return res.json({ status: 'error', error: 'Niepoprawne dane!' })
	}

	if(await bcrypt.compare(password, user.password)) {

		const token = jwt.sign(
			{
				id: user._id,
				email: user.email
			},
			JWT_SECRET
		)
		var newDate = new Date();
	    var expDate = newDate.setMinutes(newDate.getMinutes() + 10)
	    res.cookie('id' , token, { sameSite: true, maxAge: expDate });

		return res.json({ status: 'ok', data: token})
	}

	res.json({ status: 'error', error: 'Niepoprawne dane!' })
})

app.post('/api/register', async (req, res) => {
	const { email, password: plainTextPassword } = req.body

	if(!plainTextPassword || typeof plainTextPassword !== 'string'){
		return res.json({ status: 'error', error: 'Niepoprawne hasło!' })
	}
	if(plainTextPassword.length < 5){
		return res.json({
			status: 'error',
			error: 'Hasło za krótkie!'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			email,
			password
		})
		console.log('User created!', response)
	} catch(error){
		if(error.code === 11000){
			return res.json({ status: 'error', error: 'Adres email już w użyciu!' })
		}
		throw error
	}

	res.json({ status: 'ok' })
})

app.post('/api/portal', authenticateRoute, function (req, res) {
	jwt.verify(req.token, JWT_SECRET, (err, authData) => {
		if (err){
			res.sendStatus(403)
		}else {
			res.json({ status: 'ok' })
		}
	})
});

app.get('/api/portal',authenticateRoute, function (req, res) {
	jwt.verify(req.token, JWT_SECRET, (err, authData) => {
		if (err){
			res.redirect('/')
		}else {
			res.redirect('/portal.html')
		}
	})
});

app.post('/api/logout', authenticateRoute, function (req, res) {
	jwt.verify(req.token, JWT_SECRET, (err, authData) => {
		if (err){
			res.sendStatus(403)
		}else {
			res.json({ status: 'ok' })
		}
	})
});

app.get('/portal.html',authenticateRoute, function (req, res) {
	jwt.verify(req.token, JWT_SECRET, (err, authData) => {
		if (err){
			res.redirect('/')
		}else {
			res.sendFile(path.join(__dirname,'./private/portal.html'));
		}
	})
});

function authenticateRoute(req,res,next){
	const bearerHeader = req.headers.cookie.split(' ')[5]
	if(typeof bearerHeader !== 'undefined'){
		const bearerToken = bearerHeader.slice(3)
		req.token = bearerToken
		next()
	} else {
		res.status(403).redirect('/')
	}
}

app.listen(8080, () =>{
	console.log('Server up at 8080')
})