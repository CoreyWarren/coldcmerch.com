const express = require('express');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

router.get('/api/shop/cart', async (req, res) => {

    try {
        //retrieve data from Django Backend
        const apiResponse = await fetch(`${process.env.API_URL}/api/shop/cart`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        });

        // wait for that response (we are async so it works as such.)
        const data = await apiResponse.json();

        // Mirror back the response to our React client.
        return res.status(apiResponse.status).json(data);
    } catch (err) {
        // catch error
        return res.status(500).json({
            error: "Something went wrong when trying to retrieve user's cart.",
        });
    }
});

module.exports = router;