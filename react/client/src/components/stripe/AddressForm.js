import React from 'react';
import {AddressElement} from '@stripe/react-stripe-js';

const AddressForm = () => {
  return (
    <form>
      <AddressElement options={{mode: 'shipping'}} />
    </form>
  );
};

export default AddressForm;