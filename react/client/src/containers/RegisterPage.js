import { useState } from 'react';
import Layout from 'components/Layout';
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { register } from 'features/user';

const RegisterPage = () => {

    const dispatch = useDispatch();
    const { registered, loading } = useSelector(state => state.user);


    // create a state to edit, which will be an object with 4 keys,
    //  whose strings will be, by default, empty, or: ''.
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    // Destructure so they can be used directly.
    const { first_name, last_name, email, password } = formData;

    // Define 'onChange' for our input fields:
    // (This function works such that only the form data of, say,
    // "first_name" will be changed for each form input field at a time.)
    const onChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    // For Register Button to work:
    const onSubmit = e => {
        // Prevent default behavior like page getting refreshed when submitting form
        e.preventDefault();

        // We need to dispatch in order to register
        //  so we 'dispatch this action creator'
        // (basically, we can't just say register(), we need dispatch to enclose it)
        dispatch( register({ first_name, last_name, email, password }) );
    }

    // After registration, navigate us to the login page.
    if (registered) return <Navigate to='/login' />;

    return (
        <Layout title = 'Coldcut Merch | Register Page' content = 'Register page'>
            <h2>Register for an Account</h2>

            <form className='mt-5' onSubmit={onSubmit}>
                <div className='form-group'>

                    <label className='form-label' htmlFor='first_name'>
                        First Name
                    </label>

                    <input 
                        className='form-control'
                        type='text'
                        name='first_name'
                        onChange={onChange}
                        value={first_name}
                        required
                    />
                </div>


                <div className='form-group mt-3'>
                    <label className='form-label' htmlFor='last_name'>
                        Last Name
                    </label>

                    <input 
                        className='form-control'
                        type='text'
                        name='last_name'
                        onChange={onChange}
                        value={last_name}
                        required
                    />
                </div>


                <div className='form-group mt-3'>
                    <label className='form-label' htmlFor='email'>
                        Email
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
                        Password
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
                        Register
                    </button>
                )}
            </form>
        </Layout>
    );
};

export default RegisterPage;