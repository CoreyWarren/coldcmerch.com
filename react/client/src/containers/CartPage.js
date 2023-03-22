import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'components/Layout';



const CartPage = () => {

    // Bring in the 'user' and also 'cart' states.

    // We want to load cart items so we can display them. This is the main purpose of this page.
    const { cart, cart_loading } = useSelector(state => state.cart);

    // We want to see if the USER is logged in or not, so we can redirect them to the login page if they are not.
    const { isAuthenticated, user, user_loading } = useSelector(state => state.user);

    // We want to load products so we can display product details alongside the cart items they are a part of.
    const {products_map, loading_products} = useSelector(state => state.products);


    // On this page, achieve the following things:

    // 1) If the user is NOT logged in, REDIRECT them to the LOGIN page.
    // 2) If the user is logged in, show them their CART.
    //  // 2.1) If they HAVE items in their cart, show them a list of their items, and a total price.
    //  // 2.2) If they have NO items in their cart, show them a message saying so.


    const display_cart_items = () => {
        let result = [];

        // PRINT THE CART ITEMS, this is a FOR LOOP:
        for (let i = 0; i < cart_items_map.length; i += 1) {
            const image_sauce = ('http://localhost:8000' + products_map[i].image_preview).toString();

            result.push(
            <div className="cart_item" key={i}>
                <h2>{products_map[i].title}</h2>
                <p>{products_map[i].description}</p><br></br>

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
                <img src={image_sauce}></img>
                </motion.div>

                <p className="price">{products_map[i].base_cost} USD</p>

                <div className="dropdown storebutton">
                    <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Sizes
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {ProductSizeDropdownMenu(product_size_map, products_map[i].id)}
                    </Dropdown.Menu>
                    </Dropdown>
                </div>

                <button className="btn btn-one">Add to Cart</button>
                </div>
            )
        }

        return result;
    }


    return(
        <Layout title = 'Coldcut Merch | Cart' content='Cart Page'>

        <h1 className='mb-5'>Shopping Cart</h1>
            <div className="mb-4"></div>
            <div className="home_panel">
                {display_cart_items()}
            </div>


        <h3>Total: 100.00 USD</h3>


        </Layout>
    );
}

export default CartPage;