import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


export const getCheckoutStockValidation = createAsyncThunk('api/shop/checkout/stock_validation', async (_, thunkAPI) => {



    try{

      // cookies will come along the way with this request
      const res = await fetch('/api/shop/checkout/stock_validation', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        }
      });

      const data = await res.json();

      if (res.status === 200) {
        // success - return data as a payload, but map it first for easy manipulation:

        console.log("Checkout Stock Validation API accepted validation.");
      
        return {
            success: true,
            message: data.message
        };
      } else {
        // failure - reject with rejected data.

        console.log("Checkout Stock Validation API rejected validation.");

        // check if it has "out_of_stock_items" key:
        if (data.hasOwnProperty("out_of_stock_items")) {
            // it does, so we have to return it as a payload:
            let out_of_stock_items_map = [];
            console.log("Checkout Stock Validation API rejected validation. It has out_of_stock_items_map.")

        // MAP our products

            out_of_stock_items_map = data.out_of_stock_items.map(item => {
                const { product, size, adjusted_total, quantity, available_quantity} = item;
                return {
                    product,
                    size,
                    adjusted_total,
                    quantity,
                    available_quantity
                };
            });

            // our payload will be made of the following keys:
                // 1) out_of_stock_items_map
                // 2) success (True because we got a response)
                // 3) message (we will use this to display a message to the user)
                // 4) // NOT status, we don't need it in the frontend.

            console.log("data.message from Checkout Stock Validation API:", data.message);

            return thunkAPI.rejectWithValue({
              out_of_stock_items_map,
              success: data.success,
              message: data.message,
              status: data.status,
              data: data
          });

        } 


        console.log("Checkout Stock Validation API rejected validation.");
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      // error - print error data
      console.log("Checkout Stock Validation API Unexpected ERROR.");
      return thunkAPI.rejectWithValue(err.response.data);
    }
});


const initialState = {
    loading_validation: false,
    out_of_stock_items_map: [],
    checkout_stock_validation_success: false,
    checkout_stock_validation_message: "",
  }
  
  
  // slice/ state manager
  const checkoutStockValidationSlice = createSlice({
    name: 'checkout_stock_validation',
    initialState,
    // reducers are used for synchronous dispatches
    reducers: {

    },
    extraReducers: builder => {
      builder
      // Check User Validation for Checkout Page Access:
      .addCase( getCheckoutStockValidation.pending, state => {
          state.loading_validation = true;
      })
          //
      .addCase( getCheckoutStockValidation.fulfilled, (state, action) => {
          state.loading_validation = false;
          state.checkout_stock_validation_success = true;
          state.message = action.payload.message;
      })
          // Failed Validation:
      .addCase( getCheckoutStockValidation.rejected, (state, action) => {
          state.loading_validation = false;
          state.checkout_stock_validation_success = false;
        
        if(action.payload === undefined) {
          // if we don't have a payload, it means that the server is down:
          state.message = "Server is down. Please try again later.";
          return;
        } else{
          // Check if there are out_of_stock_items_map in the payload
          if (action.payload.hasOwnProperty('out_of_stock_items_map')) {
            state.out_of_stock_items_map = action.payload.out_of_stock_items_map;
          }
          state.success = action.payload.success;
          state.message = action.payload.message;
        }

        })

    },
  });
  
  export default checkoutStockValidationSlice.reducer;