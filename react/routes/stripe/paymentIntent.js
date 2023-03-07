// make an API call to stripe
// in order to create a payment intent!

const express = require('express');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

// Do NOT set price here
// set price in python. (so that users can't change the price in the browser.)
// (Generally, do NOT store any personal or sensitive data in the METADATA or the DESCRIPTION of a Stripe object. )
// (https://stripe.com/docs/api/payment_intents/create#create_payment_intent)

// After this POST, 

stripe_public_key = process.env.STRIPE_PUBLIC_KEY
stripe_private_key = process.env.STRIPE_PRIVATE_KEY


router.post('/api/stripe/create-payment-intent', async (req, res) => {
    try {
        //retrieve data from Django Backend
        const { cart_items, currency, payment_method, receipt_email } = req.body;

        const body = JSON.stringify({ cart_items, currency, payment_method, receipt_email });

        const apiResponse = await fetch(`${process.env.API_URL}/api/stripe/create-payment-intent`, {
            method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body
        });

        // wait for that response (we are async so it works as such.)
        const data = await apiResponse.json();

        // print either success OR fail:
        return res.status(apiResponse.status).json(data);

        return res.status();
    } catch (err) {
        

        return res.status(500).json({
            error: 'Something went wrong when trying to create Stripe Payment Intent.',
        });
    }


}
)

// List of other things I need to fully implement Stripe Payment Intents:
// 1. Create a payment intent (done, needs testing)
// 2. Confirm a payment intent
// 4. Cancel a payment intent
// 5. List all payment intents (django doesn't automatically handle this :( )
// 6. Retrieve a payment intent and its status
// 7. Update a payment intent
// 8. Create a payment intent with a setup intent


module.exports = router;
