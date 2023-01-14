import { useSelector } from 'react-redux';
import Layout from 'components/Layout';
import { useDispatch } from 'react-redux';
import { getProducts } from '../features/product';
import { useEffect } from 'react';
import { render } from '@testing-library/react';
import {motion, useSpring} from 'framer-motion';

const StorePage = () => {

    // grab our data from 'getProduct' from routes/auth/shop/product.js
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProducts());
    }, [])
    
    const {products, loading} = useSelector(state => state.products);


    if(products == null) {
        return (
            <Layout title = 'Coldcut Merch | Store' content = 'Store page'>
                <div className="dashboard_panel">
                    <h2> Loading Store... </h2>
                </div>
            </Layout>
            
        )
    } else { 

        const products_array = products.map(item => {
            const { title, description, image_preview, base_cost } = item;
            return {
                title,
                description,
                image_preview,
                base_cost
            };
        });

        const display_products = () => {
            let result = [];
        

            for (let i = 0; i < products_array.length; i += 1) {
                const image_sauce = ('http://localhost:8000' + products_array[i].image_preview).toString();
                //console.log(image_sauce);
                result.push(
                    <div className="shop_item" key={i}>
                        <h2>{products_array[i].title}</h2>
                        <p>{products_array[i].description}</p><br></br>
                        
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

                        <p className="price">{products_array[i].base_cost} USD</p>
                        <button className="btn btn-one">Add to Cart</button>
                    </div>
                )
            }

            return result;
        }

    return (
        <Layout title = 'Coldcut Merch | Store' content = 'Store page'>
            <div className="dashboard_panel">
                <h1 className='mb-5'>Store</h1>
                <div className="mb-4"></div>
                <div className="home_panel">
                    {display_products()}
                    {display_products()}
                    {display_products()}
                    {display_products()}
                </div>
            </div>
        </Layout>
    );
    }
};

export default StorePage;