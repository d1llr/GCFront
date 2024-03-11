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
import User from "./features/user/User"
import HistoryTournament from "./features/tournaments/tournament/HistoryTournament"
import Page404 from "./helpers/Page404"
import { ChakraProvider } from "@chakra-ui/react"

// wagmi
import { createClient, WagmiConfig, configureChains, Chain } from "wagmi"
import { bsc, bscTestnet } from "@wagmi/core/chains"
import { publicProvider } from "wagmi/providers/public"
import Code from "./helpers/Code"
import Attention from "./features/user/login/Attention"
import RegConf from "./helpers/SuccessAction"
import Recover from "./features/user/recover/Recover"
import ChangeEmail from "./features/user/changeEmail/ChangeEmail"
import ChangePassword from "./features/user/changePassword/ChangePassword"


const octaSpace = {
  id: 800001,
  name: "Octa Space",
  network: "octa_space",
  nativeCurrency: {
    decimals: 18,
    name: "OCTA",
    symbol: "OCTA",
  },
  rpcUrls: {
    default: { http: ["https://rpc.octa.space"] },
    public: { http: ["https://rpc.octa.space"] },
  },
  blockExplorers: {
    etherscan: { name: "OctaScan", url: "https://explorer.octa.space" },
    default: { name: "OctaScan", url: "https://explorer.octa.space" },
  },
  testnet: false,
} as Chain

const redev2 = {
  id: 1972,
  name: "REDEV2",
  network: "redev2",
  nativeCurrency: {
    decimals: 18,
    name: "REDEV2",
    symbol: "REDEV2",
  },
  rpcUrls: {
    default: { http: ["https://rpc2.redecoin.eu/"] },
    public: { http: ["https://rpc2.redecoin.eu/"] },
  },
  blockExplorers: {
    etherscan: { name: "RedeScan", url: "https://explorer3.redecoin.eu" },
    default: { name: "RedeScan", url: "https://explorer3.redecoin.eu" },
  },
  testnet: false,
} as Chain

const { provider, webSocketProvider } = configureChains(
  [bsc, bscTestnet, octaSpace, redev2],
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
        path: "/games/:gameId",
        element: <Game />,
      },
      // {
      //   path: "/nft",
      //   element: <Nft />,
      // },
      {
        path: "/tournaments",
        element: <Tournaments />,
      },
      {
        path: "/tournaments/:tournamentId",
        element: <Tournament />,
      },
      {
        path: "/tournaments/history/:tournamentId",
        element: <HistoryTournament />,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/recover",
    element: <Recover />,
  },
  {
    path: "/user/changeEmail",
    element: <ChangeEmail />,
  },
  {
    path: "/user/ChangePassword",
    element: <ChangePassword />,
  },
  {
    path: "/attention",
    element: <Attention />,
  },
  {
    path: "/register",
    element: <Register />,
  },
])

if (window.screen.width > 1000) {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <ChakraProvider resetCSS={true} disableGlobalStyle={true}>
      <Provider store={store}>
        <WagmiConfig client={client}>
          <RouterProvider router={router} />
        </WagmiConfig>
      </Provider>
    </ChakraProvider>,
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
