import { configureStore } from '@reduxjs/toolkit'
import userReducer from 'features/user';
import productsReducer from 'features/product';
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
    user: userReducer,
    products: productsReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production'
});
