const express = require('express');
const cookie = require('cookie');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();


router.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;

    const body = JSON.stringify({ email, password });

    try{
        const apiResponse = await fetch(`${process.env.API_URL}/api/token/`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body,
        });

        // data contains our access token as well...
        const data = await apiResponse.json();

        if(apiResponse.status === 200) {
            // set response data to a cookie
            res.setHeader('Set-Cookie', [
                cookie.serialize('access', data.access, {
                    // pass various keys and values here (learn more: google 'npm cookie')
                    httpOnly: true,
                    maxAge: 60 * 60 * 4, // measured in seconds, django has a similar setting! check it out in settings.py!
                    path: '/api/',
                    sameSite: 'strict',
                    secure: process.env.NODE_ENV === 'production' // if true, become true; false for false.
                }),
                cookie.serialize('refresh', data.access, {
                    // pass various keys and values here (learn more: google 'npm cookie')
                    httpOnly: true,
                    maxAge: 60 * 60 * 24, // 24 hours, aka 1 day
                    path: '/api/',
                    sameSite: 'strict',
                    secure: process.env.NODE_ENV === 'production' // if true, become true; false for false.
                }),
            ]);

            return res.status(200).json({ success: true }); // Successful login

            
        }else{
            //if we're not successful for api token on login attempt:
            // return data because it should have some sort of errors in it:
            return res.status(apiResponse.status).json(data);
        }

    } catch (err) {
        return res.status(500).json({
            error: 'Coco - Error. Something went wrong when logging in.',
        })

    }


});

module.exports = router;