import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'components/Layout';



const CartPage = () => {

    // Bring in the 'user' and also 'cart' states.
    const { isAuthenticated, user, user_loading } = useSelector(state => state.user);
    const { cart, cart_loading } = useSelector(state => state.cart);

    // On this page, achieve the following things:

    // 1) If the user is NOT logged in, REDIRECT them to the LOGIN page.
    // 2) If the user is logged in, show them their CART.
    //  // 2.1) If they HAVE items in their cart, show them a list of their items, and a total price.
    //  // 2.2) If they have NO items in their cart, show them a message saying so.

    return(
        <Layout title = 'Coldcut Merch | Cart' content='Cart Page'>


            <h1>Cart</h1>
                <h2>Items</h2>
                    <h2>Item 1</h2>
                        <h3>Product</h3>
                        <p>Product Name</p>
                        <p>Size</p>
                        <p>Adjusted Price</p>



                    <h2>Item 2</h2>
                        <h3>Product</h3>
                        <p>Product Name</p>
                        <p>Size</p>
                        <p>Adjusted Price</p>
                    


                    <h2>Item 3</h2>
                        <h3>Product</h3>
                        <p>Product Name</p>
                        <p>Size</p>
                        <p>Adjusted Price</p>


                <h3>Total: 100.00 USD</h3>


        </Layout>
    );
}

export default CartPage;