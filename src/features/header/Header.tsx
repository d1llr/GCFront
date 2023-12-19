import Logo from '../../images/logo.svg'
import Discord from '../../images/icons/discord.svg'
import Telegram from '../../images/icons/telegram.svg'
import Mail from '../../images/icons/mail.svg'
import X from '../../images/icons/x.svg'
import { NavLink } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import tokenService from '../../services/token.service'
import Wallet from './wallet/Wallet'



const Header = () => {
    const navigate = useNavigate();
    return (
        <header className="w-1/4 h-screen text-white p-5 gap-5 flex flex-col justify-between">
            <div className='gap-5 flex flex-col'>
                <NavLink to='/games'>
                    <img src={Logo} alt="Логотип" />
                </NavLink>
                <div className="bg-yellow p-3 flex-col flex gap-5">
                    <Wallet />
                </div>
                <ul className='text-yellow text-2xl gap-3 flex flex-col'>
                    <NavLink to='/games' className={({ isActive }) => isActive ? 'w-fit decoration-dotted underline' : ''}>
                        Games
                    </NavLink>
                    <NavLink to='/nft' className={({ isActive }) => isActive ? 'w-fit decoration-dotted underline' : ''}>
                        NFT
                    </NavLink>
                    {/* <NavLink to='/tournaments' className={({ isActive }) => isActive ? 'w-fit decoration-dotted underline' : ''}>
                        Tournaments
                    </NavLink> */}
                    <NavLink to='/user' className={({ isActive }) => isActive ? 'w-fit decoration-dotted underline' : ''}>
                        My account
                    </NavLink>
                </ul>
            </div>
            <div className='flex flex-row justify-between'>
                <div className='flex flex-row align-middle gap-2'>
                    <a target='_blank' href="https://discord.gg/JFwaENGDxy"><img src={Discord} alt="Discord" /></a>
                    <a target='_blank' href="https://t.me/PacmanCoinRU"><img src={Telegram} alt="Telegram" /></a>
                    <a target='_blank' href="mailto:coin.pacman@gmail.com"><img src={Mail} alt="Mail" /></a>
                    <a target='_blank' href="https://twitter.com/PACMan_Token"><img src={X} alt="X" /></a>
                </div>
                <span onClick={() => {
                    tokenService.removeUser()
                    navigate('/login')
                }}
                    className='text-yellow text-xl cursor-pointer'>
                    Exit
                </span>
            </div>
        </header >
    );
}

export default Header;