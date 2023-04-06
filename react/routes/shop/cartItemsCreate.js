const express = require('express');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

// Create logic to retrieve cart item data (for use in the front-end)

router.post('/api/shop/cart_items/post', async (req, res) => {

    const { access } = req.cookies;

    const {product, adjusted_total, size, quantity} = req.body;

    const body = JSON.stringify({
        product,
        adjusted_total,
        size,
        quantity,
      });

    try {
        //retrieve data from Django Backend
        const apiResponse = await fetch(`${process.env.API_URL}/api/shop/cart_items/post`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access}`,
            },
            body,
        });

        // wait for that response (we are async so it works as such.)
        const data = await apiResponse.json();

        // print either success OR fail:
        return res.status(apiResponse.status).json(data);
    } catch (err) {
        // catch error
        return res.status(500).json({
            error: "Something went wrong when trying to retrieve user's cart items.",
        });
    }


});

module.exports = router;