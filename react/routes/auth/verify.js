// route handler in express to receive our user

const express = require('express');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();


// api/token/verify/ will be used to verify
router.post('/api/users/verify/', async (req, res) => {

    // Get the access token from the headers
    const authHeader = req.headers['authorization'];

    // The below code is confusing, but its main purpose is to:
    // 1. Check if the authHeader exists
    // 2. If it does exist, take the token that comes after the first space ' '.
    // 3. If it doesn't exist, set the token to null


    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
          error: 'Access token not found',
        });
      }

    const body = JSON.stringify({
        token: token
    });

    try {
        const apiResponse = await fetch(`${process.env.API_URL}/api/users/verify/`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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
