import { Outlet, redirect, useNavigate } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import Header from "./features/header/Header"
import { useEffect } from "react";
import tokenService from "./services/token.service";
function Layout() {
    const navigate = useNavigate();
    if(tokenService.getUser() === null)  navigate('/login')
   
    return (
        <>
            <Header />
            <main className="text-lg p-5 w-full h-full">
                <Outlet />
            </main>
        </>
    )


}

export default Layout;