import Logo from "../../images/logo-game-center.svg"
import Discord from "../../images/icons/discord.svg"
import TelegramRU from "../../images/icons/tg_ru.svg"
import TelegramEN from "../../images/icons/tg_eng.svg"
import Mail from "../../images/icons/mail.svg"
import X from "../../images/icons/x.svg"
import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import tokenService from "../../services/token.service"
import Wallet from "./wallet/Wallet"
import { useDisconnect } from "wagmi"

const Header = () => {
  const { disconnectAsync } = useDisconnect()
  const navigate = useNavigate()

  const handleDisconnect = async () => {
    await disconnectAsync()
  }

  return (

    <header className="fixed w-full mt-5 z-40">
      <div className="wrapper">

        <div id="header" className="p-4 gap-5 grid grid-cols-3 items-center bg-lightGray rounded-[20px] text-white">

          <div className="gap-5 flex flex-col">
            <NavLink to="/games" className="w-fit">
              <img src={Logo} alt="logotype" className="max-w-[120px]" />
              {/* {import.meta.env.VITE_APP_DEVELOPMENT ?? ''} */}

            </NavLink>

          </div>

          <div className="flex flex-row gap-6 justify-center items-center text-xl font-orbitron">
            <NavLink
              to="/games"
              className={({ isActive }) =>
                isActive ? "text-yellow" : ""
              }
            >
              Games
            </NavLink>
            {/* <NavLink to='/nft' className={({ isActive }) => isActive ? 'w-fit decoration-dotted underline' : ''}>
                                NFT
                            </NavLink> */}
            <NavLink to='/tournaments' className={({ isActive }) => isActive ? 'text-yellow' : ''}>
              Tournaments
            </NavLink>
            <NavLink
              to="/user"
              className={({ isActive }) =>
                isActive ? "text-yellow" : ""
              }
            >
              My account
            </NavLink>
          </div>

          <div className="flex flex-row justify-end gap-4">

            <Wallet />

            <button
              onClick={() => {
                handleDisconnect()
                tokenService.removeUser()
                navigate("/login")
              }}
              className="
                h-[48px]
                w-[48px]
                bg-yellow 
                text-xl 
                cursor-pointer
                rounded-[10px]
                after:flex
                after:items-center
                after:justify-center
                after:content-exit
                after:w-full
                after:h-full
                after:mt-0.5
              "
            ></button>
          </div>
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