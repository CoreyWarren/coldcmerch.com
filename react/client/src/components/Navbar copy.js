import {Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'features/user';
import { useEffect } from 'react';

const Navbar = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.user);

    useEffect(() => {
        // make sure the document is loaded using the DOMContentLoaded event:
        try{
            const chars = ['.', ',', 'u', '+', '=', '%', 'O', 'U', 'U', 'O', '%', '=', '+', 'u', ',', '.'];
            // now reverse it by hand without using a function:
            const glitchChar = document.getElementById("char1");
            let cycleCount = 0;
            setInterval(() => {
                cycleCount++;
                const char = chars[cycleCount % chars.length];
                glitchChar.innerText = char;
            }, 150);
        }
        catch(err){
            console.log("Tried to make a cool animation with the censored ColdC%$Merch text, but it didn't work. Oh well.");
        }

        try{
            const chars = ['/', '\\', '{', '}', 't', '\\', '/', 'T'];
            const glitchChar = document.getElementById("char2");
            let cycleCount = 0;
            setInterval(() => {
                cycleCount++;
                const char = chars[cycleCount % chars.length];
                glitchChar.innerText = char;
            }, 120);
        }
        catch(err){
            console.log("Tried to make a cool animation with the censored ColdC%$Merch text, but it didn't work. Oh well.");
        }
    }, []);

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
        <nav className="navbar navbar-expand-lg bg-dark custom-navbar">


            <div className="container-fluid">

            <h1 aria-label="Cold Cut Merch at coldcmerch.com">
                <span>ColdC[</span>
                <span class="glitch-char" id="char1">#</span>
                <span class="glitch-char" id="char2">#</span>
                <span>]Merch.com</span>
            </h1>

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

                    <li className="nav-item">
                        <NavLink className='nav-link' to='/privacy'>
                            Privacy
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className='nav-link' to='/about'>
                            About
                        </NavLink>
                    </li>    

                </ul>
                </div>
            </div>
        </nav>
    );
};










export default Navbar;