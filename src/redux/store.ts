import { configureStore } from '@reduxjs/toolkit';
import deckBuilderReducer from './slices/deckBuilderSlice';

export const store = configureStore({
  reducer: {
    deckBuilder: deckBuilderReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;