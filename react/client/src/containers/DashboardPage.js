import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Layout from 'components/Layout';

import StripePoweredButton from '../components/stripe/StripePoweredButton';

// To-Do: Implement User Order History

const DashboardPage = () => {
    // Bring in the 'user' and 'loading' states.
    const { isAuthenticated, user, loading } = useSelector(state => state.user);

    if (!isAuthenticated && !loading && user === null)
        return <Navigate to='/login' />



    const obfuscateEmail = (email) => {
            // Split the email into username and domain
            email = email.toString();
            const [username, domain] = email.split('@');

            // Find the smaller of the two, username length or 3
            const visibleCharsPreset = 3;
            const actualVisibleChars = Math.min(visibleCharsPreset, username.length - 1);

            // Slice the username to the smaller of the two, username length or 3
            const usernamePartial = username.slice(0, actualVisibleChars);

            // Pad the username with asterisks to the length of the original username
            const obfuscatedUsername = usernamePartial.padEnd(username.length, '*');
          
            return `${obfuscatedUsername}@${domain}`;
        };




    // DISPLAY PAGE:

    if(user === null)
    {
        let email_display = 'No email on file';

        <Layout title = 'Cold Cut Merch | Dashboard' content = 'Dashboard page'>
            {
                <>
                <div className="dashboard_panel">
                <h1 className='mb-5'>User Dashboard</h1>
                    <div className="mb-4"></div>
                    <div className="user_data_item">Email:  <br></br>{email_display}</div>

                </div>
                </>
            }
            
        </Layout>
    }else{
        let email_display = obfuscateEmail(user.email);

        return (
            <Layout title = 'Cold Cut Merch | Dashboard' content = 'Dashboard page'>
                {
                    loading || user === null ? (
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>
                    ) : (
                        <>
                        <div className="dashboard_panel">
                            <h1 className='mb-5'>User Dashboard</h1>
                                <div className="mb-4"></div>
                                <div className="user_data_item">Email:  <br></br>{email_display}</div>

                                <div className="mb-4"></div>
                                <div className="info-item">
                                <p>Feel secure! We only store your email and hashed password here.</p>
                                <p>All personal, shipping, and payment data is handled by Stripe.</p>
                                <StripePoweredButton />
                                </div>
                                
                        </div>
                        </>
                    )
                }
                
            </Layout>
        );

    }
    
};

export default DashboardPage;