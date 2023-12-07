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


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
        <Header />
        <App/>
    </Provider>
  </React.StrictMode>,
)
