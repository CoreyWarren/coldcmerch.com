// similar to me.js,
// use this to manage and retrieve products

const express = require('express');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

router.get('/api/shop/product/size', async (req, res) => {

    try {
        //retrieve data from Django Backend
        const apiResponse = await fetch(`${process.env.API_URL}/api/shop/product/size`, {
            method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
        });

        // wait for that response (we are async so it works as such.)
        const data = await apiResponse.json();

        // print either success OR fail:
        return res.status(apiResponse.status).json(data);
    } catch (err) {
        // catch error
        return res.status(500).json({
            error: 'Something went wrong when trying to retrieve product sizes.',
        });
    }
});

module.exports = router;