import {Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'features/user';
import { useEffect } from 'react';
import { useState } from 'react';

const Navbar = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.user);


    const chars0 = ['/'];
    const chars1 = ['_', 'u', '_', '_', '_', '_'];
    const chars2 = ['_', 't', '_', '_', '_', '_'];
    const chars3 = ['/'];

    const [char0, setChar0] = useState(chars0[0]);
    const [char1, setChar1] = useState(chars1[0]);
    const [char2, setChar2] = useState(chars2[0]);
    const [char3, setChar3] = useState(chars3[0]);

    useEffect(() => {
        let cycleCount0 = 0;
        let cycleCount1 = 0;
        let cycleCount2 = 0;
        let cycleCount3 = 0;
        let intervalId0, intervalId1, intervalId2, intervalId3;

        const animate0 = () => {
            const char = chars0[cycleCount0 % chars0.length];
            setChar0(char);
            cycleCount0++;
            intervalId0 = setTimeout(animate0, 100 + 100 * Math.abs(Math.sin(cycleCount0/10)));
        }

        const animate1 = () => {
            const char = chars1[cycleCount1 % chars1.length];
            setChar1(char);
            cycleCount1++;
            intervalId1 = setTimeout(animate1, 100 + 100 * Math.abs(Math.sin(cycleCount1/0.2)));
        }

        const animate2 = () => {
            const char = chars2[cycleCount2 % chars2.length];
            setChar2(char);
            cycleCount2++;
            intervalId2 = setTimeout(animate2, 100 + 100 * Math.abs(Math.sin(cycleCount2/0.2)));
        }

        const animate3 = () => {
            const char = chars3[cycleCount3 % chars3.length];
            setChar3(char);
            cycleCount3++;
            intervalId3 = setTimeout(animate3, 100 + 100 * Math.abs(Math.cos(cycleCount3/10)));
        }

        animate0();
        animate1();
        animate2();
        animate3();

        return () => {
            clearInterval(intervalId0);
            clearInterval(intervalId1);
            clearInterval(intervalId2);
            clearInterval(intervalId3);
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
            <NavLink className='nav-link' to='/merch'>
                Merch
            </NavLink>
            </li>

            <li className="nav-item">
            <NavLink className='nav-link' to='/cart'>
                Cart
            </NavLink>
            </li>

            <li className='nav-item' id="logout">
                <a className='nav-link' href='/' onClick={() => dispatch( logout() )}>
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
            <NavLink className='nav-link' to='/merch'>
                Merch
            </NavLink>
        </li>

        </>
    );


    return(
        <nav className="navbar navbar-expand-lg bg-dark custom-navbar">


            <div className="container-fluid">

            <h1 aria-label="Cold Cut Merch at coldcmerch.com">


                <span>ColdC</span>
                <span class="glitch-char">{char0}{char1}</span>
                <span class="glitch-char">{char2}{char3}</span>
                <span>Merch.com</span>


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


                </ul>
                </div>
            </div>
        </nav>
    );
};










export default Navbar;