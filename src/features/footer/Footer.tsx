import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../images/logo-game-center.svg"
import Wallet from "../header/wallet/Wallet";
import tokenService from "../../services/token.service"
import { useDisconnect } from "wagmi";
import tg_ru from '../../images/icons/tg_ru.svg'
import tg_en from '../../images/icons/tg_en.svg'
import x from '../../images/icons/x.svg'
import discord from '../../images/icons/discord.svg'



const Footer = () => {

    const { disconnectAsync } = useDisconnect()
    const navigate = useNavigate()

    const handleDisconnect = async () => {
        await disconnectAsync()
    }
    return (
        <footer className="w-full mb-5">
            <div className="wrapper">

                <div id="header" className="p-8 grid grid-flow-col items-center bg-lightGray rounded-[20px] text-white">

                    <div className="gap-5 flex flex-col">
                        <NavLink to="/games" className="w-fit">
                            <img src={Logo} alt="logotype" className="max-w-[120px]" />
                            {/* {import.meta.env.VITE_APP_DEVELOPMENT ?? ''} */}

                        </NavLink>

                    </div>

                    <div className="flex flex-col gap-2 justify-center items-center text-16 font-orbitron">
                        <div className="flex flex-row gap-6">
                            <div className="flex flex-row gap-2">
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
                            <div className="flex flex-row gap-2">
                                <NavLink
                                    to=""
                                    className={({ isActive }) =>
                                        isActive ? "text-yellow" : ""
                                    }
                                >
                                    Offical website
                                </NavLink>
                                {/* <NavLink to='/nft' className={({ isActive }) => isActive ? 'w-fit decoration-dotted underline' : ''}>
                                  NFT
                              </NavLink> */}
                                <NavLink to='' className={({ isActive }) => isActive ? 'text-yellow' : ''}>
                                    PAC Exchange
                                </NavLink>
                                <NavLink
                                    to=""
                                    className={({ isActive }) =>
                                        isActive ? "text-yellow" : ""
                                    }
                                >
                                    AI Bot
                                </NavLink>
                            </div>
                        </div>
                        <div className="shrink grow-3">
                            <span className="text-gray font-chakra">
                                Withdrawal of coins to MEXC
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-row justify-end gap-4">
                        <img src={tg_ru} alt="tg_ru" />
                        <img src={tg_en} alt="tg_en" />
                        <img src={discord} alt="discord" />
                        <img src={x} alt="x" />
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;