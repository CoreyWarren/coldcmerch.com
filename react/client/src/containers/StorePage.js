//
//
// IMPORTS:
//
//

// React and Redux Imports
import { useSelector } from 'react-redux';
import { useDispatch} from 'react-redux';
import { useEffect} from 'react';

// JavaScript Animation Imports
import { motion } from 'framer-motion';

// Redux Slice Imports
import { getProducts } from '../features/product';
import { getProductSize } from '../features/productSize';

// Components Imports
import Layout from 'components/Layout';
import ProductSizeDropdownMenu from 'components/products/productSizeDropdownMenu';

import Dropdown from 'react-bootstrap/Dropdown';


//
//
// STORE PAGE LAYOUT:
// 
//


const StorePage = () => {

    const dispatch = useDispatch();
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

    }, [dispatch])
    
    // Access our State (Redux)
    const {products_map, loading_products} = useSelector(state => state.products);
    const {product_size_map, loading_product_sizes} = useSelector(state => state.product_size);



    const display_products = () => {
        let result = [];

        // PRINT THE PRODUCTS, FOR LOOP:
        for (let i = 0; i < products_map.length; i += 1) {
            const image_sauce = ('http://localhost:8000' + products_map[i].image_preview).toString();

            result.push(
            <div className="shop_item" key={i}>
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


    if(products_map == null || loading_products || loading_product_sizes || product_size_map == null)  {
        return (
            <Layout title = 'Coldcut Merch | Store' content = 'Store page'>
                <div className="dashboard_panel">
                    <h2> Loading Store...: </h2>
                    <p> Done Loading Products? <br></br> {String(!loading_products)}</p>
                    <p> Done Loading Product Sizes? <br></br> {String(!loading_product_sizes)}</p>
                </div>
            </Layout>
        )
    }else{
        return (
            <Layout title = 'Coldcut Merch | Store' content = 'Store page'>
                <div className="dashboard_panel">
                    <h1 className='mb-5'>Store</h1>
                    <div className="mb-4"></div>
                    <div className="home_panel">
                        {display_products()}
                    </div>
                </div>
            </Layout>
        );
    }

    
};

export default StorePage;