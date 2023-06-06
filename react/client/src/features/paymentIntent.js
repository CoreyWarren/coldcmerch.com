// Here, we will create a payment intent and return the client secret.

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const createPaymentIntent = createAsyncThunk('stripe/create-payment-intent', async({cart_items, currency, payment_method, receipt_email }, thunkAPI) => {
    const body = JSON.stringify({
      cart_items,
      currency,
      payment_method,
      receipt_email
    });
    
    try {
      const res = await fetch(
        '/api/stripe/create-payment-intent', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body,
          });

      // on successful request (register.js data), send back user data,
      // as seen in 'django/users/views.py'
      const data = await res.json();

      // successful if response status is 201:
      if (res.status === 201) {
        return data;
      } else {
        // failure:
        // users/register/rejected
        console.log('Coco - api/stripe/create-payment-intent - rejected', res.status);
        console.log('Coco - res.ok = ', res.ok);

        // thunkAPI connects to our userSlice function.
        return thunkAPI.rejectWithValue(data);
      }
    } catch(err) {
      // in situation where we don't have the actual data:
      console.log('Coco - payment intent data not received. No data to print.');
      console.log('Coco - Forced to catch error.');
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  payment_intent_data: null,
  loading_payment_intent: false,
}


// slice state manager
const productsSlice = createSlice({
  name: 'payment_intent',
  initialState,
  // reducers are used for synchronous dispatches
  reducers: {

  },
  extraReducers: builder => {
    builder
      .addCase( createPaymentIntent.pending, state => {
        state.loading_payment_intent = true;
      })
      .addCase( createPaymentIntent.fulfilled, (state, action) => {
        state.loading_payment_intent = false;
        state.payment_intent_data = action.payload;
      })
      .addCase( createPaymentIntent.rejected, state => {
        state.loading_payment_intent = false;
      })
  },
});

export default paymentIntentSlice.reducer;

