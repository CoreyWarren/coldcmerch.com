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
        // success - return data as a payload, but map it first for easy manipulation:

        let products_map = [];

        // MAP our products

        products_map = data.map(item => {
            const { id, title, description, image_preview, base_cost } = item;
            return {
                id,
                title,
                description,
                image_preview,
                base_cost
            };
        });



        return products_map; 
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



export const getProductsByID = createAsyncThunk('product/by_ids', async({product_ids}, thunkAPI) => {
  const body = JSON.stringify({
    product_ids,
  });

  try{
    // cookies will come along the way with this request
    const res = await fetch('api/shop/product/by_ids', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await res.json();

    if (res.status === 200) {
      // success - return data as a payload, but map it first for easy manipulation:

      let products_map = [];

      // MAP our products

      products_map = data.map(item => {
          const { id, title, description, image_preview, base_cost } = item;
          return {
              id,
              title,
              description,
              image_preview,
              base_cost
          };
      });



      return products_map; 
    } else {
      // failure - reject with rejected data.
      console.log("Product api (by IDs) rejected.");
      return thunkAPI.rejectWithValue(data);
    }
  } catch (err) {
    // error - print error data
    console.log("Product api (by IDs) ERROR.");
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

// products redux STATE management

const initialState = {
    products_map: null,
    loading_products: false,
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
      
        // get All Products:
        .addCase( getProducts.pending, state => {
          state.loading_products = true;
        })
        .addCase( getProducts.fulfilled, (state, action) => {
          state.loading_products = false;
          state.products_map = action.payload; // product state = product data
        })
        .addCase( getProducts.rejected, state => {
          state.loading_products = false;
        })

        // getProductsByID:
        .addCase( getProductsByID.pending, state => {
          state.loading_products = true;
        })
        .addCase( getProductsByID.fulfilled, (state, action) => {
          state.loading_products = false;
          state.products_map = action.payload; // product state = product data
        })
        .addCase( getProductsByID.rejected, state => {
          state.loading_products = false;
        })

    },
  });
  
  export default productsSlice.reducer;