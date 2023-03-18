import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// cart_items.js feature in REDUX


// getcart_items
// '_' means parameter won't have any value, that it won't be passed.
export const getCart_items = createAsyncThunk('cart_items/all', async (_, thunkAPI) => {

    try{
      // cookies will come along the way with this request
      const res = await fetch('api/shop/cart_items', {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      });

      const data = await res.json();

      if (res.status === 200) {
        // success - return data as a payload, but map it first for easy manipulation:

        let cart_items_map = [];

        // MAP our cart_items

        cart_items_map = data.map(item => {
            const { id, title, description, image_preview, base_cost } = item;
            return {
                id,
                title,
                description,
                image_preview,
                base_cost
            };
        });



        return cart_items_map; 
      } else {
        // failure - reject with rejected data.
        console.log("Cart Item api rejected.");
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      // error - print error data
      console.log("Cart Item api ERROR.");
      return thunkAPI.rejectWithValue(err.response.data);
    }
});


// Cart Items redux STATE management

const initialState = {
    cart_items_map: null,
    loading_cart_items: false,
  }
  
  
  // slice/ state manager
  const cart_itemsSlice = createSlice({
    name: 'cart_items',
    initialState,
    // reducers are used for synchronous dispatches
    reducers: {

    },
    extraReducers: builder => {
      builder
        .addCase( getCartItems.pending, state => {
          state.loading_cart_items = true;
        })
        .addCase( getCartItems.fulfilled, (state, action) => {
          state.loading_cart_items = false;
          state.cart_items_map = action.payload; // cart_item state = cart_item data
        })
        .addCase( getCartItems.rejected, state => {
          state.loading_cart_items = false;
        })
    },
  });
  
  export default cartItemsSlice.reducer;