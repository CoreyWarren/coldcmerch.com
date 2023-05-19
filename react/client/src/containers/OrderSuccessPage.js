import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import Layout from 'components/Layout';


const OrderSuccessPage = () => {

    /*
    const dispatch = useDispatch();
    useEffect(() => {

    }, [dispatch]);

    */



    // Display the page:

    return(
        <Layout title = 'Cold Cut Merch | Success!' content='Success Page'>

        <h1 id="order-success" className='mb-5'>Order Successfully Placed!</h1>
            <div className="mb-4"></div>
            <div className="home_panel">
                <p>You will be receiving an email at the <div id="green-highlight">email</div> you typed!</p>

                <p>The admin has your records on Stripe, which will be used to ship your order to you, as well as to contact you.</p>

                <p>Did you type the wrong email? Contact the admin at (till we get a contact form):</p>

                <a id="dev-help-link" style={{marginLeft:'1rem', color:'green'}}href="https://github.com/CoreyWarren">[Developer Github Page]</a>

                <br></br>
                <br></br>

                <p>(If we feel that something is wrong, we may also contact you at your default account email.)</p>
            </div>

        </Layout>
    );


}


export default OrderSuccessPage;