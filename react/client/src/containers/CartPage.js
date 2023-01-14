import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Layout from 'components/Layout';

const CartPage = () => {
    return(
        <Layout title = 'Coldcut Merch | Cart' content='Cart Page'>
            <h1>Cart</h1>
        </Layout>

    );
}

export default CartPage;