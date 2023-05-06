// import Layout from 'components/Layout';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState} from 'react';

import CheckoutForm from "./CheckoutForm";


const CheckoutPage = () => {
    
    const [clientSecret, setClientSecret] = useState("");

    const stripePromise = loadStripe(clientSecret);

    // Essential Page components:

    // Cart Item totals, quantities, and names (images should be smaller than in cart)
    // Condensed Format
    // Input Forms:
        // Use Stripe API to handle payment info


    // When user enters checkout, dispatch an action which:
        // IF NO PAYMENT INTENT EXISTS:
            // Create a new Payment Intent
        // Updates the Payment Intent with the new cart total
       

  
    useEffect(() => {
      // Create PaymentIntent as soon as the page loads
      fetch("/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }, []);
  
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


    /*
    return (
        <Layout title = 'ColdC(ut) Merch | Checkout' content='Checkout Page'>
            <h1 className='mb-5'>Checkout</h1>
            <div className="home_panel">
            <p>Please enter your payment details:</p>
            <p>Secured by Stripe!</p>

            {elements}

            

            


            </div>
        </Layout>
    );
    */


};

export default CheckoutPage;