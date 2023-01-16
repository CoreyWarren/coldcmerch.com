import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// products.js feature in REDUX


// getProducts
// '_' means parameter won't have any value, that it won't be passed.
export const getProductSize = createAsyncThunk('product/size', async ({product_id}, thunkAPI) => {
    const body = JSON.stringify({
        product_id
      });


    try{
      // cookies will come along the way with this request
      const res = await fetch(
        '/api/shop/product/size', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body,
          });

      const data = await res.json();

      if (res.status === 200) {
        // success - return data as a payload

        

        console.log("returning product size data from features/productSize.js");
        if(data == null){
          console.log("data from products size list was null");
        } else{
          console.log("data from products size list was NOT null.");
        }
        return data; 
      } else {
        // failure - reject with rejected data.
        console.log("Product size api rejected.");
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      // error - print error data
      console.log("Product size api ERROR.");
      return thunkAPI.rejectWithValue(err.response.data);
    }
});


// products redux STATE management

const initialState = {
    productSizeData: null,
    loading: false,
  }
  
  
  // slice/ state manager
  const productSizeSlice = createSlice({
    name: 'productSize',
    initialState,
    // reducers are used for synchronous dispatches
    reducers: {

    },
    extraReducers: builder => {
      builder
        .addCase( getProductSize.pending, state => {
          state.loading = true;
        })
        .addCase( getProductSize.fulfilled, (state, action) => {
          state.loading = false;
          state.productSizeData = action.payload; // product state = product data
        })
        .addCase( getProductSize.rejected, state => {
          state.loading = false;
        })
    },
  });
  
  export default productSizeSlice.reducer;