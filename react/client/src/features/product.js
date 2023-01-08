import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// products.js feature in REDUX


// getProducts
// '_' means parameter won't have any value, that it won't be passed.
export const getProducts = createAsyncThunk('product/all', async (_, thunkAPI) => {

    try{
      // cookies will come along the way with this request
      const res = await fetch('api/shop/product/all', {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      });

      const data = await res.json();

      if (res.status === 200) {
        // success - return data as a payload

        

        console.log("returning product data from features/product.js");
        if(data == null){
          console.log("data from products list was null");
        } else{
          console.log("data from products list was NOT null.");
        }
        return data; 
      } else {
        // failure - reject with rejected data.
        console.log("Product api rejected.");
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      // error - print error data
      console.log("Product api ERROR.");
      return thunkAPI.rejectWithValue(err.response.data);
    }
});


// products redux STATE management

const initialState = {
    products: null,
    loading: false,
  }
  
  
  // slice/ state manager
  const productsSlice = createSlice({
    name: 'products',
    initialState,
    // reducers are used for synchronous dispatches
    reducers: {

    },
    extraReducers: builder => {
      builder
        .addCase( getProducts.pending, state => {
          state.loading = true;
        })
        .addCase( getProducts.fulfilled, (state, action) => {
          state.loading = false;
          state.products = action.payload; // product state = product data
        })
        .addCase( getProducts.rejected, state => {
          state.loading = false;
        })
    },
  });
  
  export default productsSlice.reducer;