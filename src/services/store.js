import { configureStore } from '@reduxjs/toolkit';
import { weatherApi } from './weatherApi';

const store = configureStore({
  reducer: {
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
});

export default store;
