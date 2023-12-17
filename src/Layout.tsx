import { Outlet, redirect, useNavigate } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import Header from "./features/header/Header"
import { useEffect } from "react";
function Layout() {
    return (
        <>
            <Header />
            <main className="text-lg p-5 w-full">
                <Outlet />
            </main>
        </>
    )


}

export default Layout;