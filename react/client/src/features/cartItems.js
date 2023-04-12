import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// cart_items.js feature in REDUX

// GET PRODUCT DETAILS
// TO DISPLAY INSIDE CART PAGE
export const getProductDetails = createAsyncThunk(
  "product/by_ids",
  async (productIds, thunkAPI) => {
    try {
      const res = await fetch("api/shop/product/by_ids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          product_ids: productIds,
        }),
      });

      // input: {"product_ids":[1,1,1,1,2]}

      console.log(JSON.stringify({
        product_ids: productIds,
      }))


      const data = await res.json();

      if (res.status === 200) {

        console.log(data);

        let products_map = [];

        products_map = data.products.map(item => {
          const { id, title, description, image_preview, base_cost } = item;
          return {
              id,
              title,
              description,
              image_preview,
              base_cost
          };
        });

        console.log("products map:" , products_map);


        return products_map;
      } else {
        console.log("Product details api rejected.");
        return thunkAPI.rejectWithValue(data ? data : "Product details API rejected.");
      }
    } catch (err) {
      console.log("Product details api ERROR.");
      return thunkAPI.rejectWithValue(err.response && err.response.data ? err.response.data : "Product details API error.");
    }
    
  }
);




// getcart_items
// '_' means parameter won't have any value, that it won't be passed.

  // 1. `getCartItems`: Fetches the cart items from the API,
  //  maps the response to `cart_items_map`, then extracts the 
  //  product IDs using `map` and stores them in the `productIds`
  //  variable. After that, it dispatches the `getProductDetails`
  //  action by passing the `productIds` as an argument. 
  //  Finally, it returns the `cart_items_map`.

// This data is then displayed on the cart page.

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

        // cart item possible data:
        //    cart            = validated_data['cart'],
        //    product         = validated_data['product'],
        //    adjusted_total  = validated_data['adjusted_total'],
        //    size            = validated_data['size'],
        //    quantity        = validated_data['quantity'],
        //    my_user         = validated_data['my_user']




        const productIds = cart_items_map.map((item) => item.product);
        await thunkAPI.dispatch(getProductDetails(productIds));

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



// Add to Cart

// Adds items to cart.
// This is a POST request.

export const addToCart = createAsyncThunk('cart_items/post', async ({product, adjusted_total, size, quantity}, thunkAPI) => {
    const body = JSON.stringify({
      // cart
      product,
      adjusted_total,
      size,
      quantity,
      //my_user
    });
    
    // ('cart', 'product', 'adjusted_total', 'size', 'quantity', 'my_user')

    try {
      const res = await fetch(
        '/api/shop/cart_items/post', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body,
        });

        const addedItem = await res.json();

        let added_to_cart = false;

        if (res.status === 200 || res.status === 201) {
          added_to_cart = true;
        }

        return { item: addedItem, success: added_to_cart };

    } catch (err) {
      console.log("Add to cart api ERROR.");
      return thunkAPI.rejectWithValue(err.response.data);
    }


  });








// Cart Items redux STATE management

const initialState = {
    cart_items_map: null,
    loading_cart_items: false,
    processing_add_to_cart: false,
    add_to_cart_response: null,
    product_indices: null,
    error: null,
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

        // get cart items
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

        // get product details
        .addCase(getProductDetails.pending, (state) => {
          state.loading_cart_items = true;
        })
        .addCase(getProductDetails.fulfilled, (state, action) => {
          state.loading_cart_items = false;
          state.product_indices = action.payload;
        })
        .addCase(getProductDetails.rejected, (state, action) => {
          state.loading_cart_items = false;
          state.error = action.error.message;
        })

        // add to cart

        .addCase(addToCart.pending, (state) => {
          state.processing_add_to_cart = true;
        })

        .addCase(addToCart.fulfilled, (state, action) => {
          state.processing_add_to_cart = false;
          state.add_to_cart_response = action.payload;
        })

        .addCase(addToCart.rejected, (state, action) => {
          state.processing_add_to_cart = false;
          state.error = action.error.message;
        });

    },
  });

  
  export default cartItemsSlice.reducer;