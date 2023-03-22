import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// cart_items.js feature in REDUX


// getcart_items
// '_' means parameter won't have any value, that it won't be passed.
export const getCartItems = createAsyncThunk('cart_items', async (_, thunkAPI) => {

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
        // fields = ('product', 'adjusted_total', 'size', 'quantity')
        
        cart_items_map = data.map(item => {
            const { product, adjusted_total, size, quantity } = item;
            return {
                product,
                adjusted_total,
                size,
                quantity
            };
        });

        // cart item data:
        //    cart            = validated_data['cart'],
        //    product         = validated_data['product'],
        //    adjusted_total  = validated_data['adjusted_total'],
        //    size            = validated_data['size'],
        //    quantity        = validated_data['quantity'],
        //    my_user         = validated_data['my_user']



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
  const cartItemsSlice = createSlice({
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