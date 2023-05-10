import {Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'features/user';

const Navbar = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.user);

    const authLinks = (
        <>
            <li className="nav-item">
                <NavLink className='nav-link' to='/dashboard'>
                    Dashboard
                </NavLink>
            </li>

            

            <li className="nav-item">
            <NavLink className='nav-link' to='/store'>
                Store
            </NavLink>
            </li>

            <li className="nav-item">
            <NavLink className='nav-link' to='/cart'>
                Cart
            </NavLink>
            </li>

            <li className='nav-item' id="logout">
                <a className='nav-link' href='#!' onClick={() => dispatch( logout() )}>
                    Logout
                </a>
            </li>
        </>
    );

    const guestLinks = (
        <>
        <li className="nav-item">
            <NavLink className='nav-link' to='/login'>
                Login
            </NavLink>
        </li>

        <li className="nav-item">
            <NavLink className='nav-link' to='/register'>
                Register
            </NavLink>
        </li>

        <li className="nav-item">
            <NavLink className='nav-link' to='/store'>
                Store
            </NavLink>
        </li>

        </>
    );


    return(
        <nav className="navbar navbar-expand-lg bg-dark">
            <div className="container-fluid">

                <button 
                className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav" 
                aria-controls="navbarNav" 
                aria-expanded="false" 
                aria-label="Toggle navigation"
                >


                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#ffffff"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>


                </button>

                
                <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">

                    <li className="nav-item">
                        <NavLink className='nav-link' to='/'>
                            Home
                        </NavLink>
                    </li>

                    { isAuthenticated ? authLinks : guestLinks }

                    

                </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;