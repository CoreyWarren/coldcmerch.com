// Route handler for Express
// Used for User Registration

// import express:
const express = require('express');
// enable use of fetch:
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

// Post Request
// req = request, res = response
// This handler is localhost 5000:
// This is called a "route handler":
router.post(`/api/users/register`, async (req, res) => {
    // Make an AJAX request to our Django Backend
    // (Because our Django has the database and the relevant endpoint(s))
    // Receive all these values:
    const { first_name, last_name, email, password } = req.body;

    // JSON stringify them
    const body = JSON.stringify({
        first_name,
        last_name,
        email,
        password,
    });

    // AJAX request

    try{
        // This handler is localhost 8000:
        // This is to send to our Django backend API:
        const apiResponse = await fetch(
            `${process.env.API_URL}/api/users/register`, 
            {
                // our django users app, views.py is expecting a post
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body,
            });

        const data = await apiResponse.json();

        // Mirror back the response to our React client.
        return res.status(apiResponse.status).json(data);

    } catch(err){
        // Hard-coded error response
        
        console.log(err.message)

        return res.status(500).json({
            error: 'Something went wrong with registering account. (Custom Coco Message)'
            
        });
    }
    
});

module.exports = router;

