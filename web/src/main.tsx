import React from "react"

import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"

import JwtAxios, { setupInterceptor } from "./JwtAxios"
import App from "./components/App"
import { initialize } from "./features/auth/auth.actions"
import { store } from "./store"

import "./index.css"

setupInterceptor(JwtAxios, store)
store.dispatch(initialize())

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
