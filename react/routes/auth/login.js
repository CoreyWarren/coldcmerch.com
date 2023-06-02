const express = require('express');
const cookie = require('cookie');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();


router.post('/api/token/', async (req, res) => {
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
            res.cookie('access', data.access, {
                httpOnly: true,
                maxAge: 60 * 60 * 4 * 1000, // Express uses milliseconds, not seconds
                path: '/',
                sameSite: 'lax',
                secure: true,
            });
            
            res.cookie('refresh', data.refresh, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 1000, // Express uses milliseconds, not seconds
                path: '/',
                sameSite: 'lax',
                secure: true,
            });

            console.log(res.getHeaders());

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