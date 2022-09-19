const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

// Enable .env (environment variables) to work:
// and immediately call its config
require('dotenv').config();

// register.js route
const registerRoute = require('./routes/auth/register');
// login.js route
const loginRoute = require('./routes/auth/login');
// me.js route
const meRoute = require('./routes/auth/me');
// logout.js route
const logoutRoute = require('./routes/auth/logout');

const app = express();

// Middleware within Express to allow our 'req.body' in 'routes/auth/register.js'
// to actually work and receieve JSON data for our User Data
app.use(express.json());
app.use(cookieParser());

app.use(registerRoute);
app.use(loginRoute);
app.use(meRoute);
app.use(logoutRoute);

app.use(express.static('client/build'));
app.get('*', (req, res) => {
    return res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server listening on port ', PORT));