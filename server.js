const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const env = require('dotenv').config();
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const MailSender = require('./middleware/mailbuider')

const JWT_SECRET = 'sdawfawdfnbawikufbawifbvakwbfikuasbvdiuviwuavdi1232131!#@@!$1'

mongoose.connect("mongodb://"+process.env.COSMOSDB_HOST+":"+process.env.COSMOSDB_PORT+"/"+process.env.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb&retrywrites=false" || "mongodb://localhost:27017/SpamBotUsers", {
  auth: {
    user: process.env.COSMOSDB_USER,
    password: process.env.COSMOSDB_PASSWORD
  }, 
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const app = express()

// app.use('/', express.static(path.join(__dirname,'static')))
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
	    var expDate = new Date(newDate.getTime() + 10*60000)
	    res.cookie('id' , token, { sameSite: true, maxAge: expDate });

		return res.json({ status: 'ok', data: token, expDate})
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
	console.log("token:",req.token)
	jwt.verify(req.token, JWT_SECRET, (err, authData) => {
		if (err){
			res.sendStatus(403)
		}else {
			console.log("Redirect do Portalu")
			res.json({ status: 'ok' })
		}
	})
	console.log("Redirect do Portalu")
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
	console.log("token:",req.token)
	console.log(jwt.verify(req.token, JWT_SECRET))
	jwt.verify(req.token, JWT_SECRET, (err, authData) => {
		if (err){
			console.log("Błąd autoryzacji")
			res.redirect('/')
		}else {
			res.sendFile(path.join(__dirname,'./private/portal.html'));
		}
	})
});
// app.get('/portal.html', async (req, res) => {	
	
// 	res.sendFile(path.join(__dirname,'./private/portal.html'));

// });

app.post('/api/getEmail',authenticateRoute, function (req, res) {
	jwt.verify(req.token, JWT_SECRET, (err, authData) => {
		if (err){
			res.json({ status: 'error'})
		}else {
			const user = jwt.verify(req.token, JWT_SECRET)
			res.json({ status: 'ok', email: user.email })
		}
	})
});

app.post('/api/sendMail',authenticateRoute, function (req, res) {
	jwt.verify(req.token, JWT_SECRET, (err, authData) => {
		if (err){
			res.json({ status: 'error'})
		}else {
			const user = jwt.verify(req.token, JWT_SECRET)
			const { emailTo, time, quantity, dataText, subject} = req.body
			try{
				MailSender(user.email, emailTo, subject ,dataText)
				console.log("Sending mail from",user.email,"to", emailTo,"Subject:", subject ,"Text:",dataText)
			}
			catch(e){
				res.json({ status: 'error' })
			}
			res.json({ status: 'ok' })
		}
	})
});

function authenticateRoute(req,res,next){
	const bearerHeader = req.headers.cookie.split(';')
	const parsedCookies = {};
	bearerHeader.forEach(bearerHead=>{
	const parsedCookie = bearerHead.split('=');
	  	parsedCookies[parsedCookie[0]] = parsedCookie[1];
	});

	console.log(parsedCookies)

	if(typeof parsedCookies[" id"] !== 'undefined'){
		const bearerToken = parsedCookies[" id"]
		req.token = bearerToken
		next()
	} else {
		res.status(403).redirect('/')
	}
}

app.listen(8080, () =>{
	console.log('Server up at 8080')
})