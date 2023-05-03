import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/auth.slice"
import propertyReducer, {propertyMiddlware} from "../features/propery"


export const store = configureStore({
  middleware: (gDM) => gDM().concat(propertyMiddlware),
  reducer: {
    auth: authReducer,
    property: propertyReducer
  } 
})

export type Store = typeof store
export type State = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
