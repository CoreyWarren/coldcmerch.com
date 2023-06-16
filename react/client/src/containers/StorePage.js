//
//
// IMPORTS:
//
//

// React and Redux Imports
import { useSelector } from 'react-redux';
import { useDispatch} from 'react-redux';
import { useEffect, useState} from 'react';


// JavaScript Animation Imports
import { motion } from 'framer-motion';

// Redux Slice Imports
import { getProducts } from '../features/product';
import { getProductSize } from '../features/productSize';
import { addToCart } from 'features/cartItems';

// Components Imports
import Layout from 'components/layouts/Layout';
import ProductSizeDropdownMenu from 'components/products/productSizeDropdownMenu';
import { MY_URL, API_URL } from "config";


import Dropdown from 'react-bootstrap/Dropdown';




//
//
// STORE PAGE LAYOUT:
// 
//


const StorePage = () => {

    // Access our State (Redux)
    const {products_map, loading_products} = useSelector(state => state.products);
    const {product_size_map, loading_product_sizes} = useSelector(state => state.product_size);
    // const {processing_add_to_cart, add_to_cart_response} = useSelector(state => state.cart_items);

    const [selected_size, set_selected_size] = useState({});

    const dispatch = useDispatch();


    // ============================
    // INITIALIZE OUR DOM:
    // useEffect can only be called once. (Redux)
    // Follows the Rules of Hooks.
    // Can include other functions within it, if needed. But you cannot have any
    // 'useXYZ' functions more than once each. 
    useEffect(() => {


        // Dispatch our getProducts action from our Reducer, which will affect our State,
        // which is persistent and has a history we can access.
        // -> Grabs all products in the order in which they were created.
        // -> Interacts with Django API
        dispatch(getProducts());


        // Dispatch our getProductSize action from our Reducer, which will affect our State,
        // which is persistent and has a history we can access.
        // -> Grabs all product sizes in the order in which they are created.
        // -> Interacts with Django API
        dispatch(getProductSize());


        // within the '[]' would go any parameters used in this useEffect function.
    }, [dispatch]);


    // ============================
    // RECEIVING PRODUCTS AND PRODUCTS SIZES, SANITY CHECK:
    // When we get products and products_size, we want to see them.
    // Display them in the console.
    useEffect(() => {
        console.log("Products:", products_map)
        console.log("Product sizes:", product_size_map);
        
    }, [products_map, product_size_map]);
    


    // ============================
    // SIZE SELECTION SANITY CHECK:
    useEffect(() => {
        
        // Each time the DOM is rendered, this useEffect function will be called.
        // I want to see what the selected_size is each time the DOM is rendered.
        if(selected_size){
            console.log("Selected size:", selected_size);
        }

        // within the '[]' would go any parameters used in this useEffect function.
    }, [selected_size])




    // ============================
    // ============================
    // HELPER FUNCTIONS:
    // ============================
    // ============================


        // ============================
    // TOAST NOTIFICATION:

    const showAddToCartToast = async (product_to_add, item_id) => {

        let success = false;
        let custom_error = "";

        // Dispatch our addToCart function
        // Then, grab the item that was added to the cart.
        // This allows us to wait until the item is added to the cart
        //   BEFORE showing the toast.
        
        // + ERROR CHECKING FOR TOAST NOTIFICATIONS
        await dispatch(addToCart(product_to_add)).then((action) =>
        {
            console.log("action.payload:", action.payload);
            if (action && action.payload) {
                if ('success' in action.payload) {
                    if (action.payload.success) {
                        success = true;
                    } else if ('custom_error' in action.payload) {
                        custom_error = action.payload.custom_error;
                    }
                }
            }
        });
        

        // Does this dispatch addtocart, or does it simply wait for it?
        // Answer: It does this dispatch, and then waits for it to finish.

        // if addedItem is not null, then we know that the item was added to the cart.
        // So show the toast.
        if (success === true ) {
            const toast_success = document.getElementById(`add-to-cart-toast-success-${item_id}`);
            toast_success.classList.add('show');
            
            setTimeout(() => {
                toast_success.classList.remove('show');
            }, 3000);
        }else{
            // INSUFFICIENT STOCK ERROR
            if(custom_error === "size stock"){
                const toast_error = document.getElementById(`add-to-cart-toast-error-insufficient-stock-size-${item_id}`);
                toast_error.classList.add('show');
                
                setTimeout(() => {
                    toast_error.classList.remove('show');
                }, 4000);


            }else{
                console.log(custom_error);
                // GENERAL ERROR -> LOGIN OR CHOOSE SIZE
                const toast_error = document.getElementById(`add-to-cart-toast-error-${item_id}`);
                toast_error.classList.add('show');
                
                setTimeout(() => {
                    toast_error.classList.remove('show');
                }, 4000);
            }


            
        }
            
        
    };



    const handleSizeSelection = (productId, size) => {
        set_selected_size((prevState) => ({ ...prevState, [productId]: size }));
    };



    // Display certain things in our Size Dropdown Menu's Bar
    // depending on whether or not a size has been selected.
    const renderSelectedSize = (productId) => {
        if (selected_size[productId]) {
          return `Size: ${selected_size[productId]}`;
        }
        return '---';
      };

    const renderSelectedSizePrice = (productId, selected_size_to_render) => {
        // selected_size_to_render = selected_size[productId]
        // The below code is a filter function that returns the adjusted_total of the product_size_map
        // that matches the product_id and size of the product_size_map.
        // This is used to display the price of the product in the dropdown menu.
        // If the selected_size_to_render is null, then return null.
        // Otherwise, return the adjusted_total of the product_size_map that matches the product_id and size.
       
        if (selected_size_to_render) {
            const matchingProductSize = product_size_map.find(
              (product_size) => product_size.product_id === productId && product_size.size === selected_size_to_render
            );
            if (matchingProductSize && matchingProductSize.added_cost !== 0) {
                // Case: Success, user has selected a size that matches a product_size_map.
                return `+ ${matchingProductSize.added_cost}`;
            } else {
                // Case: User has selected a size, but it doesn't match any of the product_size_map.
                // OR, User has selected a size, but the price difference is 0.
                return '';
            }
        } else {
            // Case: User hasn't selected a size since refresh.
            return '';
        }
    };



    const display_products = () => {

        
        let result = [];

        // PRINT THE PRODUCTS, FOR LOOP:
        for (let i = 0; i < products_map.length; i += 1) {
            const image_sauce = `${MY_URL}${products_map[i].image_preview}`;
            // image_sauce = `${process.env.MY_URL}${selective_products_map[i].image_preview}`;


            let product_to_add = {
                product: products_map[i].id,
                adjusted_total: products_map[i].base_cost,
                size: (selected_size && selected_size[products_map[i].id]),
                quantity: 1,
            }

            result.push(
            <div className="shop_item" key={i}>
                <h2>{products_map[i].title}</h2>
                <p>{products_map[i].description}</p><br></br>

                <motion.div
                whileHover={{
                    scale: 1.03, 
                    transition: {
                        duration: 0.3, 
                        type: 'spring',
                        bounce: 0.6,
                    },
                }}
                >
                <img src={image_sauce} alt={products_map[i].description}></img>
                </motion.div>

                <p className="store-price">{products_map[i].base_cost} {renderSelectedSizePrice(products_map[i].id, selected_size[products_map[i].id])} USD </p>

                <div className="dropdown storebutton collapseOnSelect">
                    <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {renderSelectedSize(products_map[i].id)}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {ProductSizeDropdownMenu(product_size_map, products_map[i].id, handleSizeSelection)}
                    </Dropdown.Menu>
                    </Dropdown>
                </div>

                <button onClick={() => showAddToCartToast(product_to_add, i)} className="btn btn-one">Add to Cart!</button>

                <div className="toast-success" id={`add-to-cart-toast-success-${i}`}>"{products_map[i].title}" was added to your Cart! (size: {selected_size[products_map[i].id]})</div>

                <div className="toast-error" id={`add-to-cart-toast-error-${i}`}>ERROR: Must be Logged In, and Choose a Size.</div>

                <div className="toast-error" id={`add-to-cart-toast-error-insufficient-stock-size-${i}`}>SORRY! Limited Stock of this specific item's SIZE!</div>


                </div>
            )

        }

        return result;
    }






    // ============================
    // ============================
    // DISPLAY OUR WEBPAGE:
    // ============================
    // ============================

    if((products_map == null && loading_products) || (loading_product_sizes && product_size_map == null))  {
        return (
            <Layout title = 'Cold Cut Merch | Store' content = 'Store page'>
                <div className="dashboard_panel">
                    <h1> Loading Store: </h1>
                    <div className="mb-4"></div>
                    <p> Done Loading Products? <br></br> {String(!loading_products)}</p>
                    <p> Done Loading Product Sizes? <br></br> {String(!loading_product_sizes)}</p>
                </div>
            </Layout>
        )
    }else if (products_map==null || product_size_map==null) {
        return (
            <Layout title = 'Cold Cut Merch | Store' content = 'Store page'>
                <div className="dashboard_panel">
                    <h1>Store...?</h1>
                    <br></br>
                    <div className="info-item">
                    <h2 style={{fontWeight:"600"}}>Sorry, Bro...</h2>

                    <p> Either products or product sizes were unable to be loaded...</p>
                    <p> ...at this very moment, at least.</p>

                    </div>

                    <div className="info-item">
                    <h2 style={{fontWeight:"600"}}>Not to worry.</h2>
                    <p> - [Known Bug:] Registered users, try logging back in again. </p>
                    <p> - If that doesn't fix it, then I might be working on the site right now. </p>
                    <p> - [Unknown Bugs?] Usually spotted quickly. Come back in 1-4 hours?</p>


                    <p></p>
                    <p style={{margin:"0", paddingBottom:"0"}}>Love,</p>
                    <p style={{margin:"0", paddingTop:"0", fontWeight:"600"}}>Your Cold Cut Admin</p>
                        
                    </div>


                    <div className="info-item">
                    <h2>Need Help?</h2>
                    <p></p>
                    <p>Please contact our admin Corey at:</p>
                    <p style={{fontSize:"1.1rem", textDecoration:"underline"}}>support@coldcmerch.com</p>
                    <p>for suggestions or reports.</p>

                    </div>


                </div>
            </Layout>
        )
    }
    else{
        return (
            <Layout title = 'Cold Cut Merch | Store' content = 'Store page'>
                <div className="shop_panel">
                    <h1 className='mb-5'>Store</h1>
                    <div className="mb-4"></div>
                    <div className="shop_panel">
                        {display_products()}
                    </div>
                </div>
            </Layout>
        );
    }

    
};

export default StorePage;