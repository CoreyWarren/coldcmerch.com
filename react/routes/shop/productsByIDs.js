// similar to me.js,
// use this to manage and retrieve products

const express = require('express');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

router.post('/api/shop/product/by_ids', async (req, res) => {

    const { product_ids } = req.body;

    // JSON stringify them
    const body = JSON.stringify({
        product_ids
    });


    try {
        //retrieve data from Django Backend
        const apiResponse = await fetch(`${process.env.API_URL}/api/shop/product/by_ids`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
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
            error: 'Something went wrong when trying to retrieve products.',
        });
    }
});

module.exports = router;