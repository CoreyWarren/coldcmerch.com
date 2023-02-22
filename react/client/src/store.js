import { configureStore } from '@reduxjs/toolkit'
import userReducer from 'features/user';
import productsReducer from 'features/product';
import productSizeReducer from 'features/productSize';
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
    user: userReducer,
    products: productsReducer,
    product_size: productSizeReducer
});

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production'
});
