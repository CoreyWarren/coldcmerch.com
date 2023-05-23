// route handler in express to receive our user

const express = require('express');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

// api/token/verify/ will be used to verify
router.post('/api/users/verify', async (req, res) => {
    // we will later parse the access token from cookies
    const { access } = req.cookies;

    const body = JSON.stringify({
        token: access
    });

    try {
        const apiResponse = await fetch(`${process.env.API_URL}/api/users/verify`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body,
        });

        const data = await apiResponse.json();

        // print either success OR fail:
        return res.status(apiResponse.status).json(data);
    } catch (err) {
        // catch error
        
        return res.status(500).json({
            error: 'Something went wrong when trying to verify login status.',
        });
    }
});




module.exports = router;
