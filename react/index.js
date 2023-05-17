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

// Middleware within Express to allow our 'req.body' in 'routes/auth/register.js'
// to actually work and receieve JSON data for our User Data
app.use(express.json());
app.use(cookieParser());

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

app.use(express.static('client/build'));
app.get('*', (req, res) => {
    return res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Coco, the Express Server is listening on port:', PORT));