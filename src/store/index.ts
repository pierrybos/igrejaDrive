// /src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import eventReducer from './eventSlice'

export const store = configureStore({
  reducer: {
    event: eventReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

// Tipagens para usar em useSelector e useDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
