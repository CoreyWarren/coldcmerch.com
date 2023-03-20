const express = require('express');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

// Create logic to retrieve cart item data (for use in the front-end)

router.get('/api/shop/cart_items', async (req, res) => {

    try {
        //retrieve data from Django Backend
        const apiResponse = await fetch(`${process.env.API_URL}/api/shop/cart_items`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
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