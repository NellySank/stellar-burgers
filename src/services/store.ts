import { configureStore, combineSlices } from '@reduxjs/toolkit';
import ingredientsSlice from './ingredientsSlice';
import constructorSlice from './constructorSlice';
import ordersSlice from './ordersSlice';
import ProfileSlice from './profileSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineSlices({
  ingredients: ingredientsSlice,
  constructorBurger: constructorSlice,
  orders: ordersSlice,
  auth: ProfileSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
