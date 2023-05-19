const express = require('express');
const cookie = require('cookie');

const router = express.Router();

router.get('/api/users/logout', (req, res) => {
    // in order to log the user out,
    // simply expire the cookies.
    // --Set them to be empty and with an expiration date that
    //      is in the past.

    res.setHeader('Set-Cookie', [
        cookie.serialize('access', '', {
            // pass various keys and values here (learn more: google 'npm cookie')
            httpOnly: true,
            expires: new Date(0), // returns a date far, far into the past.
            path: '/api/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // if true, become true; false for false.
            }),
        cookie.serialize('refresh', '', {
            // pass various keys and values here (learn more: google 'npm cookie')
            httpOnly: true,
            expires: new Date(0), // returns a date far, far into the past.
            path: '/api/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // if true, become true; false for false.
            })
        ]);

    return res.status(200).json({ success: 'Logged out successfully.'});

});

module.exports = router;