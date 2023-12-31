import Logo from "../../images/logo.svg"
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
    <header className="w-1/4 h-screen text-white p-5 gap-5 flex flex-col justify-between">
      <div className="gap-5 flex flex-col">
        <NavLink to="/games">
          <img src={Logo} alt="Логотип" />
        </NavLink>
          <Wallet />
        <ul className="text-yellow text-2xl gap-3 flex flex-col">
          <NavLink
            to="/games"
            className={({ isActive }) =>
              isActive ? "w-fit decoration-dotted underline" : ""
            }
          >
            Games
          </NavLink>
          {/* <NavLink to='/nft' className={({ isActive }) => isActive ? 'w-fit decoration-dotted underline' : ''}>
                        NFT
                    </NavLink> */}
          <NavLink to='/tournaments' className={({ isActive }) => isActive ? 'w-fit decoration-dotted underline' : ''}>
              Tournaments
          </NavLink>
          <NavLink
            to="/user"
            className={({ isActive }) =>
              isActive ? "w-fit decoration-dotted underline" : ""
            }
          >
            My account
          </NavLink>
        </ul>
      </div>
      <div className="flex flex-row justify-between">
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
          Exit
        </span>
      </div>
    </header>
  )
}

export default Header
