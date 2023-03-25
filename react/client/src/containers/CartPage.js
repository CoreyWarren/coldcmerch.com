import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'components/Layout';
import { getProducts } from 'features/product';
import { getCart } from 'features/cart';
import { getCartItems } from 'features/cartItems';
import { getProductSize } from "features/productSize";

 // On this page, achieve the following things:

    // 1) If the user is NOT logged in, REDIRECT them to the LOGIN page.
    // 2) If the user is logged in, show them their CART.
    //  // 2.1) If they HAVE items in their cart, show them a list of their items, and a total price.
    //  // 2.2) If they have NO items in their cart, show them a message saying so.


const CartPage = () => {

    let myTotal = 0;
    // Bring in the 'user' and also 'cart' states.

    // We want to load cart items so we can display them. This is the main purpose of this page.
    const { cart_items_map, loading_cart_items, product_indices } = useSelector(state => state.cart_items);

    // We want to see if the USER is logged in or not, so we can redirect them to the login page if they are not.
    const { isAuthenticated, user, user_loading } = useSelector(state => state.user);

    // We want to load products so we can display product details alongside the cart items they are a part of.
    const { products_map, loading_products} = useSelector(state => state.products);



    const dispatch = useDispatch();
    // useEffect can only be called once. (Redux)
    // Follows the Rules of Hooks.
    // Can include other functions within it, if needed. But you cannot have any
    // 'useXYZ' functions more than once each. 
    useEffect(() => {

        // Dispatch our getProductSize action from our Reducer, which will affect our State,
        // which is persistent and has a history we can access.
        // -> Grabs all product sizes in the order in which they are created.
        // -> Interacts with Django API
        dispatch(getProductSize());


        // Dispatch our getCart action from our Reducer, which will affect our State,
        // which is persistent and has a history we can access.
        // -> Grabs all cart items in the order in which they are created.
        // -> Interacts with Django API
        // -> This is the cart of the logged-in user.
        dispatch(getCartItems());
        // -> NOTE: It also grabs SOME product details, dictated by which
        // -> cart items are in the cart.
        

        // within the '[]' would go any parameters used in this useEffect function.

    }, [dispatch])


    const cart_intro = () => {

        // If the user is NOT logged in, REDIRECT them to the LOGIN page.
        if (!isAuthenticated) {
            return (
                <div>
                    <h1>Cart</h1>
                    <h2>You are not logged in. Please log in to view your cart.</h2>
                </div>
            )
        }

        // If the user is logged in, show them their CART.
        else {
            return (
                <div>
                    <h1>Cart</h1>
                    <h2>Logged in as: {user.first_name}</h2>
                </div>
            )
        }


    };



    const display_cart_items = () => {
        let result = [];

        // PRINT THE CART ITEMS, this is a FOR LOOP:
        for (let i = 0; i < cart_items_map.length; i += 1) {

            // const image_sauce = ('http://localhost:8000' + cart[i].image_preview).toString();
            // fields = ('product', 'adjusted_total', 'size', 'quantity')
            result.push(
            <div className="cart_item" key={i}>
                <p>-----</p>
                <h2>Product Title: {products_map[i].title}</h2>
                    <p>Base Price + Size Cost: {cart_items_map[i].adjusted_total}</p>
                    <p>Size: {cart_items_map[i].size}</p>
                    <p>Quantity: {cart_items_map[i].quantity}</p>
                </div>
            );
            
            myTotal += cart_items_map[i].adjusted_total;
        }

        return result;
    }

if(!loading_cart_items && cart_items_map != null && !user_loading && isAuthenticated && !loading_products && products_map != null) {
    return(
        <Layout title = 'Coldcut Merch | Cart' content='Cart Page'>

        <h1 className='mb-5'>Shopping Cart</h1>
            <div className="mb-4"></div>
            <div className="home_panel">
                {cart_intro()}
                {display_cart_items()}
            </div>

        <p>-----</p>
        <h3>Total: {myTotal} USD</h3>


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