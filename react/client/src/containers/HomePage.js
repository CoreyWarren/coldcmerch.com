import Layout from 'components/Layout';

const HomePage = () => {
    return (
        <Layout title = 'ColdC(ut) Merch | Home' content='Home Page'>
            <h1 className='mb-5'>ColdC(ut) Merchandise</h1>
            <div className="home_panel">
            <p>Welcome to the official Coldcut Merch E-Shop--we're based in Fontana, CA!</p>

            <p>Shop here to support Elmar, Lou, and Brian while they slice up some fresh music for you between shows.
            <strong> Official merchandise is on the way!</strong>
            (Date of official launch TBA)
            Contact 'Corey' at florasora.com for questions.</p>
            </div>
        </Layout>
    );
};

export default HomePage;