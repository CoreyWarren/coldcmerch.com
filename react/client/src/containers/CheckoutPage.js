// import Layout from 'components/Layout';
import { loadStripe } from "@stripe/stripe-js";
import LayoutStripeCheckout from 'components/LayoutStripeCheckout';
import { Elements } from "@stripe/react-stripe-js";
import {  useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getCartItems } from 'features/cartItems';
import { createPaymentIntent } from 'features/stripePayments';
import { getCheckoutStockValidation } from "features/checkoutValidation";

import CheckoutForm from "./CheckoutForm";
import AddressForm from '../components/stripe/AddressForm';
import StripePoweredButton from '../components/stripe/StripePoweredButton';

const stripe_public_key = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(stripe_public_key);

// Need help with formatting?
// https://stripe.com/docs/elements/appearance-api?platform=web#theme



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

      // First, check if user is able to checkout by validating if their cart items exceed the available stock:
      dispatch(getCheckoutStockValidation()).catch(error => console.error('Error when validating checkout stock:', error));

      
      // Dispatch our 'retrieve cart items' action here:
      dispatch(getCartItems()).catch(error => console.error('Error when grabbing Cart Items:', error));


    }, [dispatch]);




    // These are the client secret keys we need to pass to the Stripe API:
    const [ clientSecret, setClientSecret ] = useState("");

    // Do we even need to import cart items for Checkout Page?
    let { cart_items_map, loading_cart_items } = useSelector(state => state.cart_items);

    // Check if user is authenticated:
    let { isAuthenticated, user, user_loading } = useSelector(state => state.user);

    // Check checkout stock validation for this user's cart:
    let { 
      out_of_stock_items_map, 
      checkout_stock_validation_success, 
      checkout_stock_validation_message, 
      loading_validation 
    } = useSelector(state => state.checkout_stock_validation);




    const WarningPage = ({ message, items }) => (
      <div>
        <h2>Warning</h2>
        <p>{message}</p>
        <h2>Out of Stock Items</h2>
        {
          items.map(item => (
            <div key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <img src={item.image_preview} alt={item.title} />
            </div>
          ))
        }
      </div>
    );





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

      // console.log("Items Object:", cart_items_map);
      const payment_method = 'card';
      const currency = 'usd';
      

      dispatch(createPaymentIntent({
        cart_items: cart_items_map,
        payment_method: payment_method,
        currency: currency,
        receipt_email: user.email
      })).then((result) => {

        if(result.payload) {
          setClientSecret(result.payload);
        } else {
          console.log("Error when creating Payment Intent:", result.error);
        };

      });
      
      }, [dispatch, user, cart_items_map, isAuthenticated]);


  
      const appearance = {
        theme: 'night',

        labels: 'floating'
      };

    let options = {
      clientSecret,
      appearance,
    };

    console.log("Client Secret:", clientSecret)

    return (
      <LayoutStripeCheckout title = 'Cold Cut Merch | Dashboard' content = 'Dashboard page' >

        <div className="dashboard_panel">
        <h1>Checkout </h1>

          <div className="mb-5"></div>


          {!checkout_stock_validation_success ? (
          <WarningPage 
            message={checkout_stock_validation_message}
            items={out_of_stock_items_map}
          />
          ) : (

          <div id="stripe-checkout-container">
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <AddressForm />
                <br></br>
                <CheckoutForm />
                <br></br>
              </Elements>
            )}
          </div>

          )}

          <div id="stripe-checkout-container">
            <StripePoweredButton />
          </div>



        </div>

      </LayoutStripeCheckout>
    );



};

export default CheckoutPage;