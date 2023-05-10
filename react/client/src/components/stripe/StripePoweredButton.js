import React from 'react';
import stripeLogo from '../../assets/stripe-logo.png';
import '../css/StripePoweredButton.css';

const StripePoweredButton = () => {
  return (
    <div className="stripe-powered-button">
      <a href="https://stripe.com/">
      <img src={stripeLogo} alt="Stripe logo" />
      <span>Powered by Stripe</span>
      </a>
    </div>
  );
};

export default StripePoweredButton;
