import logo from "./logo.svg"
import { Counter } from "./features/counter/Counter"
import "./App.css"
import Games from "./features/games/Games"
import Nft from "./features/nft/Nft"
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import Game from "./features/games/game/Game"
import Header from "./features/header/Header"
function App() {

function Layout() {
  return (
      <>
        <Outlet />
      </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout/>,
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
  }
])
  
  return (
    <main className="text-lg p-5 w-full">
       <RouterProvider router={router} />
    </main>
  )
}

export default App
