import { Outlet, redirect, useNavigate } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import Header from "./features/header/Header"
import { useEffect } from "react";
import tokenService from "./services/token.service";
import Footer from "./features/footer/Footer";
function Layout() {
  const navigate = useNavigate();
  if (tokenService.getUser() === null) navigate('/login')

  function requestPermission() {
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (result) {
        // Поддержка устаревшей версии с функцией обратного вызова.
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    })
      .then(function (permissionResult) {
        if (permissionResult !== 'granted') {
          throw new Error('Permission not granted.');
        }
      });
  }
  requestPermission()
  console.log('APP IS RUNNING IN', import.meta.env.VITE_APP_VERSION, 'MODE');


  return (
    <>

      <main className="text-lg w-full h-dvh flex flex-col justify-between">
        <Header />
        <Outlet />
        <Footer />
      </main>
    </>
  )


}

export default Layout;