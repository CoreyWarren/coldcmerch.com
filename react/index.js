const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
// rate limiting to prevent brute force attacks
const rateLimit = require("express-rate-limit");
const fs = require('fs');

// Enable .env (environment variables) to work:
// and immediately call its config
require('dotenv').config();


// This is a global error handler for async functions, with Express.
// It will catch any errors that occur in async functions and pass them to the next function.
// This is necessary because Express will not catch errors that occur in async functions by default.
require('express-async-errors');



// register.js route
const registerRoute = require('./routes/auth/register');
// login.js route
const loginRoute = require('./routes/auth/login');
// me.js route
const meRoute = require('./routes/auth/me');
// logout.js route
const logoutRoute = require('./routes/auth/logout');
// verify.js route
const verifyRoute = require('./routes/auth/verify');
// product.js route
const productRoute = require('./routes/shop/product');
// productByIDs.js route
const productsbyIDsRoute = require('./routes/shop/productsByIDs');
// productSizes.js route
const productSizeRoute = require('./routes/shop/productSize');
// cart.js route
const cartRoute = require('./routes/shop/cart');
// cartItems.js route
const cartItemsGetRoute = require('./routes/shop/cartItemsGet');
// cartItemsCreate.js route
const cartItemsCreateRoute = require('./routes/shop/cartItemsCreate');
// cartItemsDelete.js route
const cartItemsDeleteRoute = require('./routes/shop/cartItemsDelete');
// stripe_CreatePaymentIntent.js route
const stripe_CreatePaymentIntentRoute = require('./routes/stripe/paymentIntent');
// stripe_CheckoutStockValidation.js route
const stripe_CheckoutStockValidationRoute = require('./routes/stripe/checkoutStockValidation');



const app = express();

// Added because of POST requests in production being turned into GET requests (especially for logins):
app.set('trust proxy', 1);

// Middleware within Express to allow our 'req.body' in 'routes/auth/register.js'
// to actually work and receieve JSON data for our User Data
app.use(express.json());
app.use(cookieParser());

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'express-access.log'), { flags: 'a' })

// Rate limiting:
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // this = 15 minutes
    max: 222 // limit each IP to 'max' requests, per 'windowMs'
  });
app.use(limiter);


// Use morgan for logging. In production, you might want to use a 'short' format.
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));  // Detailed log
} else {
app.use(morgan('combined', {stream: accessLogStream }));  // Less detailed log
}

app.use(cors({
    origin: "https://coldcmerch.com",
    credentials: true
}));


// Our Routes:

app.use(registerRoute);
app.use(loginRoute);
app.use(meRoute);
app.use(logoutRoute);
app.use(verifyRoute);
app.use(productRoute);
app.use(productsbyIDsRoute);
app.use(productSizeRoute);
app.use(cartRoute);
app.use(cartItemsGetRoute);
app.use(cartItemsCreateRoute);
app.use(cartItemsDeleteRoute);
app.use(stripe_CreatePaymentIntentRoute);
app.use(stripe_CheckoutStockValidationRoute);

console.log("Sanity Check 1");

// Serve static assets if in production
// Set static folder
app.use(express.static(path.join(__dirname, 'client/build')));
// '*' means any route that is not defined above
app.get('*', (req, res) => {
    return res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'));
});


// Set up the port for the server to listen on
// This is used for both the Express server and the React client
// If the environment variable 'PORT' is not defined, use port 5000
const PORT = process.env.PORT || 5000;



// Error handling middleware
// This is a global error handler for async functions, with Express.
// It will catch any errors that occur in async functions and pass them to the next function.
app.use((err, req, res, next) => {
    console.error(err.stack);  // Log the error stack trace on the server
    res.status(500).send('Something went wrong! This is an express error at index.js in the Express section of cocos React app!');  // Send a generic message to the client
  });



app.listen(PORT, () => console.log('Coco, the Express Server is listening on port:', PORT));
