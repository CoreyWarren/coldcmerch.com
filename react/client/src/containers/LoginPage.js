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
        
        await dispatch(login({email, password})).then((action) =>
        {
            console.log("login action.payload:", action.payload);
            if (action.payload.success) {
                success = true;
            }
        });


        if ( isAuthenticated ) return <Navigate to='/dashboard' />;

        if ( success == false ) {
            const toast_error = document.getElementById(`login-toast-error`);
            toast_error.classList.add('show');
            
            setTimeout(() => {
                toast_error.classList.remove('show');
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