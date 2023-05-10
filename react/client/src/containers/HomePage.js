import Layout from 'components/Layout';

const HomePage = () => {
    return (
        <Layout title = 'ColdC(ut) Merch | Home' content='Home Page'>
            <h1 className='mb-5'>Cold Cut Merchandise</h1>
            <div className="home_panel">

                
            </div>
            

            <div className="dashboard_panel">

            <div className="info-item">
            <p>Thanks for supporting us!</p>
            <p>- Elmar</p>
            <p>- Lou</p>
            <p>- Brian</p>
            </div>


            <div className="info-item">
            <p>Coming soon:</p>
            <p>- Password Resets</p>
            <p>- Order History</p>

            </div>

            


            </div>
        </Layout>
    );
};

export default HomePage;