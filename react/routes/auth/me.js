// route handler in express to receive our user

const express = require('express');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

router.get('/api/users/me', async (req, res) => {
    const { access } = req.cookies;

    try {
        const apiResponse = await fetch(`${process.env.API_URL}/api/users/me/`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${access}`,
            }
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