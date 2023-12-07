import logo from "./logo.svg"
import { Counter } from "./features/counter/Counter"
import "./App.css"
import Games from "./features/games/Games"
import Nft from "./features/nft/Nft"
import {
  createBrowserRouter,
  RouterProvider,
  redirect
} from "react-router-dom";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Games/>,
    },
    {
      path: "/games",
      element: <Games/>,
    },
    {
      path: "/nft",
      element: <Nft/>,
    },
  ]);
  
  return (
    <main className="text-lg p-5 w-full">
       <RouterProvider router={router} />
    </main>
  )
}

export default App
