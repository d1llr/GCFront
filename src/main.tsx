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
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import Login from "./features/user/login/Login"
import Game from "./features/games/game/Game"
import Register from "./features/user/register/Register"


function Layout() {
  return (
    <>
      <Header />
      <main className="text-lg p-5 w-full">
        <Outlet />
      </main>
    </>
  );
}
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Games />
      },
      {
        path: '/games',
        element: <Games />
      },
      {
        path: '/nft',
        element: <Nft />
      },
      {
        path: '/games/:gamesId',
        element: <Game />
      },

    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
])
if (window.screen.width > 1000) {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
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
