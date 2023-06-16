import Layout from 'components/layouts/Layout';

const HomePage = () => {
    return (
        <Layout title = 'ColdC(ut) Merch | Home' content='Home Page'>

            <div className="home_panel">
            <h1 className='mb-5'>User Privacy</h1>



            <div className="info-item">
            <h2>Maximum Privacy & Little Liability</h2>
            <p></p>
            <p>This site respects your privacy and your time:</p>
            <p>- No intrusive ads</p>
            <p>- No cross-site tracking cookies</p>
            <p>- No third-party Wordpress or Shopify templates</p>

            <p></p>

            <p>Here, why don't you take a look at the code?</p>
            <div className="info-item-link"> 
                <p><a href="https://github.com/CoreyWarren/coldcmerch.com">
                [Github Repo]</a></p>
            </div>
            </div>

            <div className="info-item"  style={{backgroundColor:"brown"}}>
                <h2>This site DOES store:</h2>
                <p>- Your registered email</p>
                <p>- Your password, but encrypted</p>
                <p>- Your past orders</p>
                <p>- Your current cart</p>
            </div>

            <div className="info-item"  style={{backgroundColor:"darkorange"}}>
                <h2>This site DOES NOT store:</h2>
                <p>- Your navigation behavior</p>
                <p>- Your biometrics</p>
                <p>- Your money</p>
                <p>- Your card data</p>
                <p>- Your address</p>
                <p>- Your phone number</p>
                <p>- Your name</p>
            </div>

            <div className="info-item" style={{backgroundColor:"darkviolet"}}>
                <h2>We partner with STRIPE to let them handle:</h2>
                <p>- Sensitive Payment Data</p>
                <p>- User Funds</p>
                <p>- Order History</p>
                <p>- Refunds</p>
                <p>- Payment Confirmation</p>
            </div>

            <div className="info-item" style={{backgroundColor:"darkorange"}}>
                <h2>List of All Parties with access to your EMAIL, ADDRESS, & NAME:</h2>
                <p>- Stripe</p>
                <p>- Our admins who deliver your goods and give you refunds.</p>
            </div>

            <div className="info-item" style={{backgroundColor:"brown"}}>
                <h2>List of All Parties with access to your EMAIL, CART, & CART ITEMS:</h2>
                <p>- Our admins who adjust our product catalogue.</p>
            </div>

            <br></br>



            
            </div>
        </Layout>
    );
};

export default HomePage;