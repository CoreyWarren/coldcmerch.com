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
      loading_validation 
    } = useSelector(state => state.checkout_stock_validation);

    // We want to load products so we can display product details alongside the cart items they are a part of.
    let { selective_products_map, loading_products} = useSelector(state => state.products);





    const WarningPage = () => (
      <div className="info-item">
        <h2>Warning</h2>
        <p>Some CART ITEMS in your CART have lost available stock since you last added them:</p>
        {displayOutOfStockItems()}
        <p>Please remove any excess cart items to continue.</p>
        <p>I am very sorry for the inconvenience.</p>
      </div>
    );




    let displayOutOfStockItems = () => {
      let result = [];
    
      for (let i = 0; i < out_of_stock_items_map.length; i += 1) {
        let index_starting_at_one = 0;
        let image_sauce = "";
        let item_key = "";
    
        try {
          index_starting_at_one = i + 1;
          image_sauce = ('http://localhost:8000' + selective_products_map[i].image_preview).toString();
          item_key = (out_of_stock_items_map[i].product + selective_products_map[i].title).toString() + i.toString();
        } catch (error) {
          console.log("Error:", error);
          return (
            <div>
              <p>There was an error loading your out-of-stock items.</p>
            </div>
          )
        }
    
        result.push(
          <div className="out_of_stock_item" key={`out-of-stock-item-${item_key}`}>
            <h2>{index_starting_at_one}:  {selective_products_map[i].title}</h2>
            <img alt={selective_products_map[i].description} src={image_sauce} ></img>
            <p>Size: <strong>{out_of_stock_items_map[i].size}</strong></p>
            <p>Adjusted Total: <strong>{out_of_stock_items_map[i].adjusted_total}</strong></p>
            <p>Quantity: <strong>{out_of_stock_items_map[i].quantity}</strong></p>
            <p>Available Quantity: <strong>{out_of_stock_items_map[i].available_quantity}</strong></p>
          </div>
        );
      }
      return result;
    }
    





    useEffect(() => {

      // Check if we're even able to create a payment intent:
      if(!isAuthenticated) {
        return;
      };
      if(!user || user.email === null) {
        return;
      };
      if(!cart_items_map) {
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

    return (
      <LayoutStripeCheckout title = 'Cold Cut Merch | Dashboard' content = 'Dashboard page' >

        <div className="dashboard_panel">
        <h1>Checkout </h1>

          <div className="mb-5"></div>


          {(!checkout_stock_validation_success && !loading_validation) ? (
          <WarningPage />
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