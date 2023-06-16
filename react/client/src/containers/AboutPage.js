import Layout from 'components/layouts/Layout';

const HomePage = () => {
    return (
        <Layout title = 'ColdC(ut) Merch | Home' content='Home Page'>

            <div className="home_panel">
            <h1 className='mb-5'>About</h1>

            <div className="info-item" style={{backgroundColor:"darkgreen"}}>
            <h2>This website is custom-made with love using:</h2>
            <p></p>
            <p>- Django</p>
            <p>- React</p>
            <p>- Redux</p>
            <p>- Express</p>
            </div>

            <div className="info-item" style={{backgroundColor:"darkred"}}>
            <h2>This website was NOT made using:</h2>
            <p></p>
            <p>- Wordpress</p>
            <p>- Shopify</p>
            <p>- Wix</p>
            <p>- Some Cheap Shit</p>
            </div>


            <div className="info-item">
            <h2>What We're Working On:</h2>
            <p></p>
            <p>- Bugs in User Experience</p>
            <p>- User Password Resets</p>
            <p>- User Order History</p>
            <p>- User Rewards</p>
            <p>- Band Member Portfolios</p>
            <p>- Single Product View Pages</p>
            </div>

            <div className="info-item">
            <h2>Need Help?</h2>
            <p></p>
            <p>Please contact our admin Corey at:</p>
            <p style={{fontSize:"1.1rem", textDecoration:"underline"}}>support@coldcmerch.com</p>
            <p>for suggestions or reports.</p>

            </div>







            <br></br>



            
            </div>
        </Layout>
    );
};

export default HomePage;