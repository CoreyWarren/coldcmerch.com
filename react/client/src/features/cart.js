import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// cart.js feature in REDUX


// getCart
// '_' means parameter won't have any value, that it won't be passed.
export const getCart = createAsyncThunk('cart', async (_, thunkAPI) => {

    try{
      // cookies will come along the way with this request
      const res = await fetch('api/shop/cart', {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      });

      const data = await res.json();

      if (res.status === 200) {
        // success - return data as a payload, but map it first for easy manipulation:


        return cart_map; 
      } else {
        // failure - reject with rejected data.
        console.log("Cart api rejected.");
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      // error - print error data
      console.log("Cart api ERROR.");
      return thunkAPI.rejectWithValue(err.response.data);
    }
});


// cart redux STATE management

const initialState = {
    cart_map: null,
    loading_cart: false,
  }
  
  
  // slice/ state manager
  const cartSlice = createSlice({
    name: 'cart',
    initialState,
    // reducers are used for synchronous dispatches
    reducers: {

    },
    extraReducers: builder => {
      builder
        .addCase( getCart.pending, state => {
          state.loading_cart = true;
        })
        .addCase( getCart.fulfilled, (state, action) => {
          state.loading_cart = false;
          state.cart_map = action.payload; // cart state = cart data
        })
        .addCase( getCart.rejected, state => {
          state.loading_cart = false;
        })
    },
  });
  
  export default cartSlice.reducer;