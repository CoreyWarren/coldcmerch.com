const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

router.get('/api/users/logout', async (req, res) => {
    
    // Previously, we were expiring the cookies 'access' and 'refresh' here.
    
    // In this new method, we rely on the Django backend to expire the cookies.
    // This is done by adding them to a blacklist.

    try {
        const apiResponse = await fetch(`${process.env.API_URL}/api/users/me/`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
    }
    catch (err) {
        // catch error
        return res.status(500).json({
            error: 'Something went wrong when trying to retrieve user',
        });
    }


    return res.status(200).json({ success: 'Logged out successfully.'});

});

module.exports = router;