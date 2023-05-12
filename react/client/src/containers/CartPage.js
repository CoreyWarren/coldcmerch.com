import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'components/Layout';
import { resetProductsMap } from 'features/product';
import { resetCartItemsMap } from "features/cartItems";
import { getCartItems, deleteCartItem } from 'features/cartItems';
import RefreshButton from "components/RefreshButton";

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
        dispatch(resetCartItemsMap());


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
    let { cart_items_map, loading_cart_items } = useSelector(state => state.cart_items);

    // We want to see if the USER is logged in or not, so we can redirect them to the login page if they are not.
    let { isAuthenticated, user, user_loading } = useSelector(state => state.user);

    // We want to load products so we can display product details alongside the cart items they are a part of.
    let { selective_products_map, loading_products} = useSelector(state => state.products);


    const obfuscateEmail = (email) => {
        // Split the email into username and domain
        email = email.toString();
        const [username, domain] = email.split('@');

        // Find the smaller of the two, username length or 3
        const visibleCharsPreset = 3;
        const actualVisibleChars = Math.min(visibleCharsPreset, username.length - 1);

        // Slice the username to the smaller of the two, username length or 3
        const usernamePartial = username.slice(0, actualVisibleChars);

        // Pad the username with asterisks to the length of the original username
        const obfuscatedUsername = usernamePartial.padEnd(username.length, '*');
      
        return `${obfuscatedUsername}\n@\n${domain}`;
    };


    const cart_intro = (email_display) => {

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
                    <p>Logged in as: {email_display}</p>
                </div>
            )
        }


    };


    const deleteCartItemHelper = async (cart_item_to_delete_id, view_index) => {
        let success = false;
        console.log("cart_item_to_delete_id:", cart_item_to_delete_id);

        await dispatch(deleteCartItem(cart_item_to_delete_id)).then((action) =>
        {
            console.log("action.payload:", action.payload);
            if (action.payload.success === true) {
                success = true;
            }
        });


        if (success === true ) {
            const toast_success = document.getElementById(`delete-from-cart-toast-success-${view_index}`);
            toast_success.classList.add('show');
            
            setTimeout(() => {
                toast_success.classList.remove('show');
            }, 3000);
        }else{
            const toast_error = document.getElementById(`delete-from-cart-toast-error-${view_index}`);
            toast_error.classList.add('show');
            
            setTimeout(() => {
                toast_error.classList.remove('show');
            }, 4000);
        }

        dispatch(resetProductsMap());

        dispatch(getCartItems()).catch(error => console.error('Error when grabbing Cart Items:', error));

    }
    
    const calculate_cart_total = () => {
        let cart_total = 0;
        for (let i = 0; i < cart_items_map.length; i += 1) {
            cart_total += cart_items_map[i].adjusted_total;
        }
        
        cart_total = cart_total.toFixed(2);
        return cart_total;
    }



    let display_cart_items = () => {
        let result = [];

        result.push(
            <p key="p divider start">-------------------------</p>
        )
        

        // PRINT THE CART ITEMS, this is a FOR LOOP:
        for (let i = 0; i < cart_items_map.length; i += 1) {

            //console.log(i, "...", selective_products_map[i].image_preview);
            let index_starting_at_one_for_cart_items = 0;
            let image_sauce = "";
            let cart_item_key = "";

            try{
                index_starting_at_one_for_cart_items = i + 1;
                image_sauce = ('http://localhost:8000' + selective_products_map[i].image_preview).toString();
                cart_item_key = (cart_items_map[i].product + selective_products_map[i].title).toString() + i.toString();
            }catch(error){
                console.log("Error:", error);
                return (
                    <div>
                        <p>There was an error loading your cart.</p>
                    </div>
                )
            }
           

            // fields = ('product', 'adjusted_total', 'size', 'quantity')
            result.push(
            <div className="cart_item" key={`cart-item-${cart_item_key}`}>

                
                <h2>{index_starting_at_one_for_cart_items}:  {selective_products_map[i].title}</h2>

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
                    <img alt={selective_products_map[i].description} src={image_sauce} ></img>
                    </motion.div>
                    
                    <p style={{margin: 0, padding: 0}}>Subt: <strong>{(cart_items_map[i].adjusted_total*cart_items_map[i].quantity).toFixed(2)} USD</strong></p>
                    <p>Size: <strong>{cart_items_map[i].size}</strong></p>
                    <p>Qty : <strong>{cart_items_map[i].quantity}</strong></p>


                    <div className="dropdown cartbutton">
                    <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic-cart">
                    &#128393;
                    </Dropdown.Toggle>
                    <Dropdown.Menu >
                        <Dropdown.Item>
                            <button className="remove-from-cart-button" onClick={() => deleteCartItemHelper(cart_items_map[i].id, i)}>Remove From Cart
                                </button>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>


                </div>

                <div className="toast-success" id={`delete-from-cart-toast-success-${i}`}>Item #{index_starting_at_one_for_cart_items} was deleted from your Cart!</div>

                <div className="toast-error" id={`delete-from-cart-toast-error-${i}`}>ERROR: Could not delete item #{index_starting_at_one_for_cart_items}.</div>

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

        let email_display = obfuscateEmail(user.email);
        
        return(
            <Layout title = 'Cold Cut Merch | Cart' content='Cart Page'>

            <div className="home_panel">
            

                <h1 className='mb-5'>Shopping Cart</h1>

                <div className="mb-4"></div>

                <div className="email_display">
                    {cart_intro(email_display)}
                </div>

                    <div className="total-price">Total: {calculate_cart_total()} USD</div>
                    <a href="/checkout" className="checkout-button-top">Checkout</a>

                    
                    {display_cart_items()}


                    <div className="total-price">Total: {calculate_cart_total()} USD</div>

                <a href="/checkout"className="checkout-button">Checkout</a>

                </div>

            

            


            </Layout>
        );
        }
        else if(!user_loading && !isAuthenticated){
            return(
                <Layout title = 'Cold Cut Merch | Cart' content='Cart Page'>

                <h1 className='mb-5'>Shopping Cart</h1>
                    <div className="mb-4"></div>
                    <div className="home_panel">
                        <p>You are not logged in. Please log in to view your cart.</p>
                    </div>

                </Layout>
            );
        }
        else if(loading_cart_items || loading_products){
            return(
                <Layout title = 'Cold Cut Merch | Cart' content='Cart Page'>

                <h1 className='mb-5'>Shopping Cart</h1>
                    <div className="mb-4"></div>
                    <div className="home_panel">
                        <h1>Loading...</h1>
                    </div>

                </Layout>
            );

        }
        else{


            return(
                <Layout title = 'Cold Cut Merch | Cart' content='Cart Page'>

                <h1 className='mb-5'>Shopping Cart</h1>
                    <div className="mb-4"></div>
                    <div className="home_panel">
                        <h1>Something unexpected happened.</h1>
                        <p>Please try again later.</p>
                        <p>If nothing changes, it may be an issue on our end.</p>
                        <p>{RefreshButton()}</p>
                    </div>

                </Layout>
            );
        }
}

export default CartPage;