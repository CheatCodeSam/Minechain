import React from "react"

import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"

import App from "./app/components/App"
import { initialize } from "./app/features/auth/auth.actions"
import { store } from "./app/store"

import "./styles.css"
import "react-loading-skeleton/dist/skeleton.css"

store.dispatch(initialize())

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
