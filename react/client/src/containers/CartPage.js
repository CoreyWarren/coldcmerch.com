import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Layout from 'components/Layout';
import { resetProductsMap } from 'features/product';
import { getCart } from 'features/cart';
import { getCartItems, getProductDetails } from 'features/cartItems';
import { getProductSize } from "features/productSize";

import { motion } from 'framer-motion';
import Dropdown from 'react-bootstrap/Dropdown';

 // On this page, achieve the following things:

    // 1) If the user is NOT logged in, REDIRECT them to the LOGIN page.
    // 2) If the user is logged in, show them their CART.
    //  // 2.1) If they HAVE items in their cart, show them a list of their items, and a total price.
    //  // 2.2) If they have NO items in their cart, show them a message saying so.


const CartPage = () => {
    // Bring in the 'user' and also 'cart' states.



    const dispatch = useDispatch();
    // useEffect can only be called once. (Redux)
    // Follows the Rules of Hooks.
    // Can include other functions within it, if needed. But you cannot have any
    // 'useXYZ' functions more than once each. 
    useEffect(() => {

        // When navigating from StorePage -> CartPage, the products_map has all sorts of values in it.
        // We want to reset it to an empty object, so that when we navigate back to StorePage, it
        // doesn't have any values in it.
        dispatch(resetProductsMap());


        // Dispatch our getCart action from our Reducer, which will affect our State,
        // which is persistent and has a history we can access.
        // -> Grabs all cart items in the order in which they are created.
        // -> Interacts with Django API
        // -> This is the cart of the logged-in user.
        dispatch(getCartItems()).catch(error => console.error('Error when grabbing Cart Items:', error));
        // -> NOTE: It also grabs SOME product details, dictated by which
        // -> cart items are in the cart.
                    
            
        // dispatch(getProductsByIDs)
        // /\ THIS IS DONE BY getCartItems().
        // -> This is done by getCartItems().


        // within the '[]' would go any parameters used in this useEffect function.

    }, [dispatch]);

    

    // We want to load cart items so we can display them. This is the main purpose of this page.
    const { cart_items_map, loading_cart_items, product_indices } = useSelector(state => state.cart_items);

    // We want to see if the USER is logged in or not, so we can redirect them to the login page if they are not.
    const { isAuthenticated, user, user_loading } = useSelector(state => state.user);

    // We want to load products so we can display product details alongside the cart items they are a part of.
    const { selective_products_map, loading_products} = useSelector(state => state.products);

    const cart_intro = () => {

        // If the user is NOT logged in, REDIRECT them to the LOGIN page.
        if (!isAuthenticated) {
            return (
                <div>
                    <p>You are not logged in. Please log in to view your cart.</p>
                </div>
            )
        }

        // If the user is logged in, show them their CART.
        else {
            return (
                <div>
                    <p>Logged in as: {user.first_name}</p>
                </div>
            )
        }


    };


    
    const calculate_cart_total = () => {
        let cart_total = 0;
        for (let i = 0; i < cart_items_map.length; i += 1) {
            cart_total += cart_items_map[i].adjusted_total;
        }
        
        cart_total = cart_total.toFixed(2);
        return cart_total;
    }



    const display_cart_items = () => {
        let result = [];
        

        // PRINT THE CART ITEMS, this is a FOR LOOP:
        for (let i = 0; i < cart_items_map.length; i += 1) {

            //console.log(i, "...", selective_products_map[i].image_preview);
            const image_sauce = ('http://localhost:8000' + selective_products_map[i].image_preview).toString();
            const cart_item_key = (cart_items_map[i].product + selective_products_map[i].title).toString() + i.toString();

            // fields = ('product', 'adjusted_total', 'size', 'quantity')
            result.push(
            <div className="cart_item" key={cart_item_key}>

                
                <h2>{i+1}:  {selective_products_map[i].title}</h2>

                    <motion.div
                    whileHover={{
                        scale: 1.03, 
                        transition: {
                            duration: 0.5, 
                            type: 'spring',
                            bounce: 0.6,
                        },
                    }}
                    >
                    <img src={image_sauce} ></img>
                    </motion.div>
                    
                    <p style={{margin: 0, padding: 0}}>Subt: <strong>{(cart_items_map[i].adjusted_total*cart_items_map[i].quantity).toFixed(2)} USD</strong></p>
                    <p>Size: <strong>{cart_items_map[i].size}</strong></p>
                    <p>Qty : <strong>{cart_items_map[i].quantity}</strong></p>


                    <div className="dropdown cartbutton">
                    <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                    &#128393;
                    </Dropdown.Toggle>
                    <Dropdown.Menu >
                        <Dropdown.Item  href="#">Remove from Cart</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                </div>


                
            </div>
            );
            
        }

        // Whenever you PUSH into your returned result,
        // you must also PUSH a KEY, so that React can keep track of the elements.
        // If you don't, you will get an error.
        // "Error: Each child in a list should have a unique 'key' prop in JSX!"
        result.push(
            <p key="p divider final">-------------------------</p>
        )
        
        return result;
    }



    // Display the page:


    if(!loading_cart_items && cart_items_map != null && !user_loading && isAuthenticated && user != null && !loading_products) {
        
        return(
            <Layout title = 'Coldcut Merch | Cart' content='Cart Page'>

            <h1 className='mb-5'>Shopping Cart</h1>
                <div className="mb-4"></div>
                <div className="home_panel">
                    {cart_intro()}
                    <div className="total-price">Subtotal: {calculate_cart_total()} USD</div>
                    {display_cart_items()}
                </div>

            <div className="total-price">Subtotal: {calculate_cart_total()} USD</div>

            <button type="button" className="checkout-button">Checkout</button>


            </Layout>
        );
        }
        else if(!user_loading && !isAuthenticated){
            return(
                <Layout title = 'Coldcut Merch | Cart' content='Cart Page'>

                <h1 className='mb-5'>Shopping Cart</h1>
                    <div className="mb-4"></div>
                    <div className="home_panel">
                        <p>You are not logged in. Please log in to view your cart.</p>
                    </div>

                </Layout>
            );
        }
        else{
            return(
                <Layout title = 'Coldcut Merch | Cart' content='Cart Page'>

                <h1 className='mb-5'>Shopping Cart</h1>
                    <div className="mb-4"></div>
                    <div className="home_panel">
                        <h1>Loading...</h1>
                    </div>

                </Layout>
            );

        }
}

export default CartPage;