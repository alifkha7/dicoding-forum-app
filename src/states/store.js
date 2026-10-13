import { configureStore } from '@reduxjs/toolkit';
import { loadingBarReducer } from 'react-redux-loading-bar';

const store = configureStore({
  reducer: {
    loadingBar: loadingBarReducer,
  },
});

export default store;
