import Logo from "../../images/logo-game-center.svg"
import ExitIcon from "../../images/icons/exit-account.svg"
import BurgerOpen from "../../images/icons/mob-burger-open.svg"
import BurgerClose from "../../images/icons/mob-burger-close.svg"
import Discord from "../../images/icons/discord.svg"
import TelegramRU from "../../images/icons/tg_ru.svg"
import TelegramEN from "../../images/icons/tg_eng.svg"
import Mail from "../../images/icons/mail.svg"
import X from "../../images/icons/x.svg"

import tg_ru from '../../images/icons/tg_ru.svg'
import tg_en from '../../images/icons/tg_en.svg'
import x from '../../images/icons/x.svg'
import discord from '../../images/icons/discord.svg'

import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import tokenService from "../../services/token.service"
import Wallet from "./wallet/Wallet"
import { useDisconnect } from "wagmi"
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setMobBurger } from "./Header.slice"



const Header = () => {
  // const mobBurgerOpen = false;
  const { disconnectAsync } = useDisconnect()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const mobBurger = useAppSelector(state => state.mobBurger.open)
  // const [mobBurger, setMobBurger] = useState<boolean>(false)


  const handleDisconnect = async () => {
    await disconnectAsync()
  }

  return (

    <header className="fixed w-full mt-5 z-40">
      <div className={`${mobBurger ? 'mob_element_close' : 'mob_element_open'} wrapper`}>

        <div id="header" className="p-4 gap-5 flex justify-between items-center bg-lightGray rounded-[20px] text-white">

          <div className="gap-5 flex flex-col w-full max-w-[25%] max-[1050px]:max-w-[fit-content] max-w-[920px]:hidden">
            <NavLink to="/games" className="w-fit hover:text-textGray">
              <img src={Logo} alt="logotype" className="max-w-[120px] max-[600px]:max-w-[95px]" />
              {/* {import.meta.env.VITE_APP_DEVELOPMENT ?? ''} */}

            </NavLink>

          </div>

          <div className="flex flex-row gap-6 justify-center items-center text-xl font-orbitron max-[920px]:hidden">
            <NavLink
              to="/games"
              className={({ isActive }) =>
                isActive ? "text-yellow" : "hover:text-textGray"
              }
            >
              Games
            </NavLink>
            {/* <NavLink to='/nft' className={({ isActive }) => isActive ? 'w-fit decoration-dotted underline' : ''}>
                                NFT
                            </NavLink> */}
            <NavLink to='/tournaments' className={({ isActive }) => isActive ? 'text-yellow' : 'hover:text-textGray'}>
              Tournaments
            </NavLink>
            <NavLink
              to="/user"
              className={({ isActive }) =>
                isActive ? "text-yellow" : "hover:text-textGray"
              }
            >
              My account
            </NavLink>
          </div>

          <div className="flex flex-row justify-end gap-4 max-[920px]:hidden">

            <Wallet />

            <button
              onClick={() => {
                handleDisconnect()
                tokenService.removeUser()
                navigate("/login")
              }}
              className="yellow_icon_btn"
            >
              <img src={ExitIcon} alt="Exit" />
            </button>
          </div>

          <div id="burger_open" className="min-[920px]:hidden">
            <button
              onClick={() => {
                dispatch(setMobBurger())
              }}
              className="yellow_icon_btn"

            >
              <img src={BurgerOpen} alt="Open burger" />
            </button>
          </div>

        </div>

      </div>

            

      <div id="mob_menu" className={`${mobBurger ? 'mob_element_open' : 'mob_element_close'}`}>
        <div className="flex flex-col gap-[50px]">
          <div className="flex justify-between items-start">
            <NavLink to="/games" className="w-fit">
              <img src={Logo} alt="logotype" className="max-w-[95px]" />
            </NavLink>
            <button
              onClick={() => {
                dispatch(setMobBurger())
              }}
              className="pl-4 mt-2"
            >
              <img src={BurgerClose} alt="Close burger" />
            </button>
          </div>
          <div className="flex gap-2 justify-between">
            <Wallet />

            <button
              onClick={() => {
                handleDisconnect()
                tokenService.removeUser()
                navigate("/login")
              }}
              className="mobile_icon_button"
            >
              <img src={ExitIcon} alt="Exit" />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <NavLink
              to="/games"
              className={({ isActive }) =>
              `font-orbitron text-[16px] font-extrabold ${isActive ? "text-yellow" : "text-white"}`
              }
            >
              Games
            </NavLink>
            <NavLink 
              to='/tournaments' 
              className={({ isActive }) => 
                `font-orbitron text-[16px] font-extrabold ${isActive ? 'text-yellow' : 'text-white'}`
              }
            >
              Tournaments
            </NavLink>
            <NavLink
              to="/user"
              className={({ isActive }) =>
                `font-orbitron text-[16px] font-extrabold ${isActive ? "text-yellow" : "text-white"}`
              }
            >
              My account

            </NavLink>

          </div>
        </div>
        
        <div className="flex flex-row justify-start gap-3">

            <a className="yellow_icon_btn" href="">
                <img src={tg_ru} alt="telegram ru" />
            </a>
            <a className="yellow_icon_btn" href="">
                <img src={tg_en} alt="telegram en" />
            </a>
            <a className="yellow_icon_btn" href="">
                <img src={discord} alt="discord" />
            </a>
            <a className="yellow_icon_btn" href="">
                <img src={x} alt="social X" />
            </a>

        </div>

      </div>

    </header>

  )
}

export default Header



{/* SOCIAL AND OLD BUTTON(SPAN) EXIT */ }
{/* <div className="flex flex-row justify-between">
  <div className="flex flex-row align-middle gap-2">
    <a target="_blank" href="https://discord.gg/JFwaENGDxy">
      <img src={Discord} alt="Discord" />
    </a>
    <a target="_blank" href="https://t.me/PacmanCoinRU">
      <img src={TelegramRU} alt="TelegramRU" />
    </a>
    <a target="_blank" href="mailto:coin.pacman@gmail.com">
      <img src={Mail} alt="Mail" />
    </a>
    <a target="_blank" href="https://twitter.com/PACMan_Token">
      <img src={X} alt="X" />
    </a>
    <a target="_blank" href="https://t.me/PacmanCoinMain">
      <img src={TelegramEN} alt="TelegramEN" />
    </a>
  </div>
  <span
    onClick={() => {
      handleDisconnect()
      tokenService.removeUser()
      navigate("/login")
    }}
    className="text-yellow text-xl cursor-pointer"
  >
  
</div> */}