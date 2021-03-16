const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'sdawfawdfnbawikufbawifbvakwbfikuasbvdiuviwuavdi1232131!#@@!$1'

mongoose.connect("mongodb://localhost:27017/SpamBotUsers", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const app = express()
app.use('/', express.static(path.join(__dirname,'static')))


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

app.listen(8080, () =>{
	console.log('Server up at 8080')
})