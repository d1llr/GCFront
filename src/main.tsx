import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import "./index.css"
import "./index.css"
import Games from "./features/games/Games"
import Nft from "./features/nft/Nft"
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  redirect,
  useNavigate,
} from "react-router-dom"
import Login from "./features/user/login/Login"
import Game from "./features/games/game/Game"
import Register from "./features/user/register/Register"
import Mobile from "./features/mobile/Mobile"
import Tournaments from "./features/tournaments/Tournaments"
import Tournament from "./features/tournaments/tournament/Tournament"
import InDevelop from "./features/inDevelop/InDevelop"
import Layout from "./Layout"
import { useAppSelector } from "./app/hooks"
import User from "./features/user/User"

// next-auth
import { SessionProvider } from "next-auth/react"

// wagmi
import { createClient, WagmiConfig } from "wagmi"
import { configureChains } from "@wagmi/core"
import { bsc, bscTestnet } from "@wagmi/core/chains"
import { publicProvider } from "wagmi/providers/public"

const { provider, webSocketProvider } = configureChains(
  [bsc, bscTestnet],
  [publicProvider()],
)

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: false,
})

// etc

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Games />,
      },
      {
        path: "/games",
        element: <Games />,
      },
      {
        path: "/games/:gamesId",
        element: <Game />,
      },
      // {
      //   path: "/nft",
      //   element: <Nft />,
      // },
      {
        path: '/tournaments',
        element: <Tournaments />
      },
      {
        path: '/tournaments/:tournamentId',
        element: <Tournament />
      },
      {
        path: "/user",
        element: <User />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
])

if (window.screen.width > 1000) {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <WagmiConfig client={client}>
        <RouterProvider router={router} />
      </WagmiConfig>
    </Provider>,
  )
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <Mobile />
      </Provider>
    </React.StrictMode>,
  )
}
