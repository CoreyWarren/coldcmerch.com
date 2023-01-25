import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// products.js feature in REDUX


// getProducts
// '_' means parameter won't have any value, that it won't be passed.
export const getProductSize = createAsyncThunk('product/size', async (_, thunkAPI) => {


    try{
      // cookies will come along the way with this request
      const res = await fetch(
        '/api/shop/product/size', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            }
          });

      const data = await res.json();

      if (res.status === 200) {
        // success - return data as a payload

        // NEW CODE:
        // before adding new code here, make sure to
        // change django API so that we get ALL product sizes at once,
        // and them process them below:

        let product_size_map = [];

        // MAP our products

        product_size_map = data.map(item => {
            const { product_id, size, added_cost } = item;
            return {
                product_id,
                size,
                added_cost
            };
        });



        return product_size_map; 

      } else {
        // failure - reject with rejected data.
        console.log("Product size api rejected.");
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      // error - print error data
      console.log("Product size api ERROR. \n err:", err);
      return thunkAPI.rejectWithValue(err.response.data);
    }
});


// products redux STATE management

const initialState = {
    product_size_map: null,
    loading_product_sizes: false,
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
          state.loading_product_sizes = true;
        })
        .addCase( getProductSize.fulfilled, (state, action) => {
          state.loading_product_sizes = false;
          state.product_size_map = action.payload; // product state = product data
        })
        .addCase( getProductSize.rejected, state => {
          state.loading_product_sizes = false;
        })
    },
  });
  
  export default productSizeSlice.reducer;