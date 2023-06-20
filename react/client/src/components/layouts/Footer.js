import React from 'react';
import '../../components/css/Footer.css';

const Footer = () => (
    <>
    <div className='footer-spacer'></div>

    <footer className='footer'>
        <div className='footer-container'>
            <div className='footer-content'>

            <button 
                onClick={() => window.scrollTo(0, 0)}
                className='back-to-top'
            >
                /\ Back to Top /\
            </button>


                <div className='footer-section links'>
                    <h4>Information</h4>
                    <ul>
                        <li><a href='/about'>About</a></li>
                        <li><a href='/privacy'>User Privacy</a></li>
                    </ul>
                </div>

                <div className='footer-section contact'>
                    <h4>Contact Us</h4>
                    <p>support@coldcmerch.com</p>
                </div>
            </div>

            <div className='footer-bottom'>
                <span className="footer-span">Cold Cut © 2023</span>
                <span className="footer-span">Core Codex © 2023</span>
                <span className="footer-span">Owned and Operated in Fontana, CA</span>
            </div>


        </div>
    </footer>

    </>
)

export default Footer;