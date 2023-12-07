import Logo from '../../images/logo.svg'
import Discord from '../../images/icons/discord.svg'
import Telegram from '../../images/icons/telegram.svg'
import Mail from '../../images/icons/mail.svg'
import X from '../../images/icons/x.svg'
import { Link } from 'react-router-dom'



const Header = () => {
    return (
        <header className="w-1/4 h-screen text-white p-5 gap-5 flex flex-col justify-between">
            <div className='gap-5 flex flex-col'>
                <a href="/">
                    <img src={Logo} alt="Логотип" />
                </a>
                <div className="bg-yellow p-3 flex-col flex gap-5">
                    <span className='text-black text-xl font-bold'>
                        Your game balance
                    </span>
                    <span className='text-black self-end font-bold text-xl'>
                        100 000 PAC
                    </span>
                    <div className='w-full flex flex-row justify-between gap-2'>
                        <button className='bg-black p-1 w-full border-black text-sm'>
                            Recharge
                        </button>
                        <button className='bg-inherit p-1 w-full border-2 border-black text-black'>
                            Withdraw
                        </button>
                    </div>
                </div>
                <ul className='text-yellow text-2xl gap-3 flex flex-col'>
                    <a href='/games' className='w-fit decoration-dotted underline '>
                        Games
                    </a>
                    <a href='/nft' className='w-fit decoration-dotted underline '>
                        NFT
                    </a>
                    <li className='w-fit decoration-dotted underline '>
                        Tournaments
                    </li>
                    <li className='w-fit decoration-dotted underline'>
                        My account
                    </li>
                </ul>
            </div>
            <div className='flex flex-row justify-between'>
                <div className='flex flex-row align-middle gap-2'>
                    <img src={Discord} alt="Discord" />
                    <img src={Telegram} alt="Telegram" />
                    <img src={Mail} alt="Mail" />
                    <img src={X} alt="X" />
                </div>
                <span className='text-yellow text-xl'>
                    Exit
                </span>
            </div>
        </header>
    );
}

export default Header;