import Layout from 'components/Layout';

const HomePage = () => {
    return (
        <Layout title = 'ColdC(ut) Merch | Home' content='Home Page'>

            <div className="home_panel">
            <h1 className='mb-5'>Cold Cut Merchandise</h1>



            <div className="info-item">
            <h2>Thanks for supporting us!</h2>
            <p>- Elmar</p>
            <p>- Lou</p>
            <p>- Brian</p>
            </div>


            <div className="info-item">
            <h2>Coming soon:</h2>
            <p>- Password Resets</p>
            <p>- Order History</p>

            </div>

            <div className="info-item">
            <h2>Source Code:</h2>
            <div className="info-item-link"> 
                <p><a href="https://github.com/CoreyWarren/coldcmerch.com">
                [Github Repo]</a></p>
            </div>

            </div>



            
            </div>
        </Layout>
    );
};

export default HomePage;