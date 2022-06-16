import React from "react"

import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom"

import JwtAxios, { setupInterceptor } from "./JwtAxios"
import App from "./components/App"
import { whoAmI } from "./features/auth/authSlice"
import history from "./router/history"
import { store } from "./store"

import "./index.css"

setupInterceptor(JwtAxios, store)
store.dispatch(whoAmI())

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HistoryRouter history={history}>
        <App />
      </HistoryRouter>
    </Provider>
  </React.StrictMode>
)
