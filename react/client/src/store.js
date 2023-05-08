// This code creates a Redux store for an e-commerce application built with Django and React.
// It imports several reducer functions that manage slices of the application state.
// The 'configureStore' function from the '@reduxjs/toolkit' library is used to create the store.
import { configureStore } from '@reduxjs/toolkit'

// The following lines import the reducer functions for each slice of the application state:
import userReducer from 'features/user';
import productsReducer from 'features/product';
import productSizeReducer from 'features/productSize';
import cartReducer from 'features/cart';
import cartItemsReducer from 'features/cartItems';
import stripePaymentsReducer from 'features/stripePayments';

// The 'combineReducers' function from the '@reduxjs/toolkit' library is used to combine the individual reducers into one.
// The resulting combined reducer will manage the entire application state.
// Each slice of state is managed by a separate reducer function.
// These slices will merge into the store for our application, which is managed by Redux.
import { combineReducers } from '@reduxjs/toolkit';

// Each slice of state is managed by a separate reducer function.
// Combine these separate reducer functions for the purpose of its use by the front-end.
// These slices will merge into the store for our application, which is managed by Redux.

const rootReducer = combineReducers({
    user:               userReducer,
    products:           productsReducer,
    product_size:       productSizeReducer,
    cart:               cartReducer,
    cart_items:         cartItemsReducer,
    stripe_payments:    stripePaymentsReducer,
});

// The resulting combined reducer is passed to the 'configureStore' function.
// This function creates a store with the specified reducer and optional dev tools for development purposes.

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production'
});


//

