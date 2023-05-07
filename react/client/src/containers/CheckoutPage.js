// import Layout from 'components/Layout';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {  useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getCartItems } from 'features/cartItems';
import { createPaymentIntent } from 'features/stripePayments';

import CheckoutForm from "./CheckoutForm";

const stripe_public_key = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

// const stripePromise = loadStripe("pk_test_51LjuaCGd7lKiUeBGcPrv9c5hjjcUZVwpwFIDxZeMPMkSQEcMNs5gtoqmGNAnh7snzlcFaj6253qIEKge0tdqSqPX00Jwjh6sj0");
const stripePromise = loadStripe(stripe_public_key);



const CheckoutPage = () => {

    const dispatch = useDispatch();

    // Essential Page components:

    // Cart Item totals, quantities, and names (images should be smaller than in cart)
    // Condensed Format
    // Input Forms:
        // Use Stripe API to handle payment info


    // When user enters checkout, dispatch an action which:
        // IF NO PAYMENT INTENT EXISTS:
            // Create a new Payment Intent
        // Updates the Payment Intent with the new cart total
      
  
    // Grab the cart items from the database for payment intent creation:
    useEffect(() => {

      // Dispatch our 'retrieve cart items' action here:

      dispatch(getCartItems()).catch(error => console.error('Error when grabbing Cart Items:', error));

    }, [dispatch]);





    const [clientSecret, setClientSecret] = useState("");

    let { cart_items_map, loading_cart_items } = useSelector(state => state.cart_items);

    let { isAuthenticated, user, user_loading } = useSelector(state => state.user);

    // const stripePromise = process.env.STRIPE_PUBLISHABLE_KEY;




    useEffect(() => {

      // Check if we're even able to create a payment intent:
      if(!isAuthenticated) {
        console.log("Error when creating Payment Intent: User not authenticated");
        return;
      };
      if(!user || user.email === null) {
        console.log("Error when creating Payment Intent: No User Email");
        return;
      };
      if(!cart_items_map) {
        console.log("Error when creating Payment Intent: No Cart Items");
        return;
      };
      console.log("Creating Payment Intent...! All checks passed.");
      // console.log("User Email:", user.email);

      // Assign the cart items to an array, then convert to an object:
      // (Our API expects an object)

      console.log("Items Object:", cart_items_map);
      const payment_method = 'card';
      const currency = 'usd';
      

      dispatch(createPaymentIntent({
        cart_items: cart_items_map,
        payment_method: payment_method,
        currency: currency,
        receipt_email: user.email
      })).then((result) => {

        if(result.payload) {
          setClientSecret(result.payload.client_secret);
        } else {
          console.log("Error when creating Payment Intent:", result.error);
        };

      });
      
      }, [dispatch, user, cart_items_map, isAuthenticated]);


  
    const appearance = {
      theme: 'stripe',
    };

    const options = {
      clientSecret,
      appearance,
    };


    return (
      <div className="App">
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    );



};

export default CheckoutPage;