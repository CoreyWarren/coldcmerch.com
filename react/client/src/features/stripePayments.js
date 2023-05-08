import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const createPaymentIntent = createAsyncThunk('payment_intent', async ({cart_items, payment_method, currency, receipt_email}, thunkAPI) => {

    try{
      // cookies will come along the way with this request
      const res = await fetch('api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 
            Accept: 'application/json',
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
            cart_items: cart_items,
            payment_method: 'card',
            currency: 'usd',
            receipt_email: receipt_email,
          }),
      });

      const data = await res.json();

      if (res.status === 200) {
        // success - return data as a payload, but map it first for easy manipulation:

        let client_secret = data.client_secret;
  
        return client_secret;

      } else {
        // failure - reject with rejected data.
        console.log("Stripe Payment Intent Creation API rejected with data:", data);
        return thunkAPI.rejectWithValue(data);
      }

    } catch (err) {
      // error - print error data
      console.log("Stripe Payment Intent Creation API ERROR. Did not even reject with data!");
      return thunkAPI.rejectWithValue(err.response.data);
    }
});


const initialState = {
    stripe_create_payment_intent_map: null,
    loading_create_payment_intent: false,
  }



const stripeSlice = createSlice({
    name: 'stripe',
    initialState,
    // reducers are used for synchronous dispatches
    reducers: {

    },
    extraReducers: builder => {
      builder
        .addCase( createPaymentIntent.pending, state => {
          state.loading_cart = true;
        })
        .addCase( createPaymentIntent.fulfilled, (state, action) => {
          state.loading_cart = false;
          state.cart_map = action.payload; // cart state = cart data
        })
        .addCase( createPaymentIntent.rejected, state => {
          state.loading_cart = false;
        })
    },
  });


export default stripeSlice.reducer;