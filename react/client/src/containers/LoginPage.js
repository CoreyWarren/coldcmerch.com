import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetRegistered, login } from 'features/user';

const LoginPage = () => {
    const dispatch = useDispatch();

    // '{}' to destructure loading
    const { loading, isAuthenticated, registered } = useSelector(state => state.user);

    // create a state to edit, which will be an object with 4 keys,
    //  whose strings will be, by default, empty, or: ''.
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        if (registered) dispatch(resetRegistered());
    }, [dispatch, registered]);

    // Destructure so they can be used directly.
    const { email, password } = formData;

    // Define 'onChange' for our input fields:
    // (This function works such that only the form data of, say,
    // "email" will be changed for each form input field at a time.)
    const onChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    // For Login Button to work:
    /*
    const onSubmit = e => {
        // Prevent default behavior like page getting refreshed when submitting form
        e.preventDefault();

        dispatch( login({ email, password }) );
    }
    */

    const onSubmit = async e => {

        let success = false;
        e.preventDefault();


        // dispatch login action:
        await dispatch(login({email, password})).then((action) =>
        {
            // destructure action.payload:
            const { access, refresh, success } = action.payload;
            // Here we show that we received the access and refresh tokens:
            if (access) console.log("Received access token.");
            if (refresh) console.log("Received refresh token.");
            
            // If we received a success message, then set success to true:
            if (action.payload.success) {
                // (This is used for the toast error message.)
                success = true;
            }
        });


        // Navigate to dashboard if login is successful:
        if ( isAuthenticated || success ) return <Navigate to='/dashboard' />;



        // If login is unsuccessful, show error toast:
        if ( success == false ) {
            const toast_error = document.getElementById(`login-toast-error`);

            if (toast_error) toast_error.classList.add('show');
            
            setTimeout(() => {

                if(toast_error) toast_error.classList.remove('show');
            }, 4000);
        }

    }




    // if the 'isAuthenticated' piece of redux state is true,
    // then redirect user to dashboard.
    // AKA: When user logs in, take them to the dashboard.
    if ( isAuthenticated ) return <Navigate to='/dashboard' />;
        

    return (
        <Layout title = 'Cold Cut Merch | Login Page' content = 'Login page'>
            <h1>Log into your account:</h1>

            <form className='mt-5' onSubmit={onSubmit}>

                <div className='form-group'>
                    <label className='form-label' htmlFor='email'>
                        Email:
                    </label>
                    <input 
                        className='form-control'
                        type='email'
                        name='email'
                        onChange={onChange}
                        value={email}
                        required
                    />
                </div>

                <div className='form-group mt-3'>
                    <label className='form-label' htmlFor='password'>
                        Password:
                    </label>
                    <input 
                        className='form-control'
                        type='password'
                        name='password'
                        onChange={onChange}
                        value={password}
                        required
                    />
                </div>


                {loading ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>
                ) : (
                    <button className='btn btn-primary mt-4'>
                        Login
                    </button>
                )}
            </form>


            <div className="toast-error" id={`login-toast-error`}>ERROR : Incorrect password, OR Invalid account. Unable to login.</div>


        </Layout>
    );
};

export default LoginPage;