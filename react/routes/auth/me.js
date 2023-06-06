// route handler in express to receive our user

const express = require('express');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

router.get('/api/users/me', async (req, res) => {

    // Similar to verify.js, we don't fetch the access token from the headers here, because we won't be receiving it in the Authorization header in this setup.

    // Instead, we'll rely on the cookie that was attached to the request by the browser and will be automatically included in the request to Django, without needing to handle it explicitly here.

    try {
        const apiResponse = await fetch(`${process.env.API_URL}/api/users/me/`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await apiResponse.json();

        // print either success OR fail:
        return res.status(apiResponse.status).json(data);
    } catch (err) {
        // catch error
        return res.status(500).json({
            error: 'Something went wrong when trying to retrieve user',
        });
    }
});




module.exports = router;