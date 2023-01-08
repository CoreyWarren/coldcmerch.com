import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Layout from 'components/Layout';

// To-Do: Implement User Order History

const DashboardPage = () => {
    // Bring in the 'user' and 'loading' states.
    const { isAuthenticated, user, loading } = useSelector(state => state.user);

    if (!isAuthenticated && !loading && user === null)
        return <Navigate to='/login' />

    return (
        <Layout title = 'Coldcut Merch | Dashboard' content = 'Dashboard page'>
            {
                loading || user === null ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>
                ) : (
                    <>
                    <div class="dashboard_panel">
                        <h1 className='mb-5'>User Dashboard</h1>
                            <div className="mb-4"></div>
                            <div class="list_item">First Name: <br></br>{user.first_name}</div>
                            <div class="list_item">Last Name:  <br></br>{user.last_name}</div>
                            <div class="list_item">Email:  <br></br>{user.email}</div>
                    </div>
                    </>
                )
            }
            
        </Layout>
    );
};

export default DashboardPage;