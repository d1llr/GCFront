import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../images/logo-game-center.svg"
import Wallet from "../header/wallet/Wallet";
import tokenService from "../../services/token.service"
import { useDisconnect } from "wagmi";
import tg_ru from '../../images/icons/tg_ru.svg'
import tg_en from '../../images/icons/tg_en.svg'
import x from '../../images/icons/x.svg'
import discord from '../../images/icons/discord.svg'
import { useAppSelector } from "../../app/hooks";



const Footer = () => {
    const mobBurger = useAppSelector(state => state.mobBurger.open)

    const { disconnectAsync } = useDisconnect()
    const navigate = useNavigate()

    const handleDisconnect = async () => {
        await disconnectAsync()
    }
    return (
        <footer className={`${mobBurger ? 'mob_element_close' : 'mob_element_open'} w-full pb-5`}>
            <div className="wrapper">

                <div className="p-8 grid grid-cols-[1fr_3fr_1fr] max-[1250px]:grid-flow-col max-[1250px]:grid-cols-none items-center bg-lightGray rounded-[20px] text-white max-[920px]:flex max-[920px]:flex-col max-[920px]:justify-center max-[920px]:items-center max-[920px]:gap-10 max-[920px]:px-4 max-[920px]:py-10">

                    <div className="gap-5 flex flex-col">
                        <NavLink to="/games" className="w-fit">
                            <img src={Logo} alt="logotype" className="w-full max-w-[120px] max-[920px]:max-w-[320px] max-[600px]:max-w-[153px]" />
                            {/* {import.meta.env.VITE_APP_DEVELOPMENT ?? ''} */}

                        </NavLink>

                    </div>

                    <div className="flex flex-col gap-2 justify-center items-center text-16 font-orbitron max-[920px]:gap-8">
                        <div className="flex flex-row gap-6 max-[1170px]:flex-wrap max-[1170px]:justify-center max-[1170px]:gap-2">
                            <div className="flex flex-row gap-3 text-base flex-wrap justify-center">
                                <NavLink
                                    to="https://pac-project.com/"
                                    className={({ isActive }) =>
                                        isActive ? "text-yellow" : "hover:text-yellow"
                                    }
                                >
                                    Offical website
                                </NavLink>
                                <NavLink to='https://www.pacex.io/#/' className={({ isActive }) => isActive ? 'text-yellow' : 'hover:text-yellow'}>
                                    PAC Exchange
                                </NavLink>
                                <NavLink
                                    to="https://t.me/AIFastBrain_bot?start=2099954707"
                                    className={({ isActive }) =>
                                        isActive ? "text-yellow" : "hover:text-yellow"
                                    }
                                >
                                    AI Bot

                                </NavLink>
                                <NavLink
                                    to="https://www.mexc.com/ru-RU/exchange/PACOIN_USDT"
                                    target="_blank"
                                    className={({ isActive }) =>
                                        isActive ? "text-yellow" : "hover:text-yellow"
                                    }
                                >
                                    Trade on MEXC
                                </NavLink>
                            </div>
                        </div>
                        {/* <div className="shrink grow-3">
                            <a href="https://www.mexc.com/ru-RU/exchange/PACOIN_USDT" target="_blank" className="text-gray font-chakra font-bold">
                                Withdrawal of coins to MEXC
                            </a>
                        </div> */}
                    </div>

                    <div className="flex flex-row justify-end gap-4">

                        <a className="default_icon_btn" href="https://t.me/PacmanCoinRU">
                            <img src={tg_ru} alt="telegram ru" />
                        </a>
                        <a className="default_icon_btn" href="https://t.me/PacmanCoinMain">
                            <img src={tg_en} alt="telegram en" />
                        </a>
                        <a className="default_icon_btn" href="https://discord.gg/JFwaENGDxy">
                            <img src={discord} alt="discord" />
                        </a>
                        <a className="default_icon_btn" href="https://twitter.com/Token_Pac">
                            <img src={x} alt="social X" />
                        </a>

                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;