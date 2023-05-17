const express = require('express');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();


router.get('/api/shop/checkout/stock_validation', async (req, res) => {

    try {
        const { access } = req.cookies;

        //retrieve data from Django Backend

        const apiResponse = await fetch(`${process.env.API_URL}/api/shop/checkout/stock_validation`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access}`,
            },
        });

        // wait for that response (we are async so it works as such.)
        const data = await apiResponse.json();

        // print either success OR fail:
        return res.status(apiResponse.status).json(data);
    } catch (err) {
        

        return res.status(500).json({
            error: 'Something went wrong in the frontend. Was trying to fetch checkout stock validation.',
        });
    }


}
)



module.exports = router;
