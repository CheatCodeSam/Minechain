import React from "react"

import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"

import JwtAxios, { setupInterceptor } from "./app/JwtAxios"
import App from "./app/components/App"
import { initialize } from "./app/features/auth/auth.actions"
import { store } from "./app/store"

import "./styles.css"

setupInterceptor(JwtAxios, store)
store.dispatch(initialize())

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
