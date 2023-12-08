import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import App from "./App"
import "./index.css"
import Header from "./features/header/Header"

import "./index.css";
import Games from "./features/games/Games"
import Nft from "./features/nft/Nft"
import Mobile from "./features/mobile/mobile"


if (window.screen.width > 1000) {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <Header />
        <App />
      </Provider>
    </React.StrictMode>

  )
}
else {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <Mobile />
      </Provider>
    </React.StrictMode>

  )
}
