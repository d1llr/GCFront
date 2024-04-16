import { Spinner } from 'flowbite-react';
import gif from '../images/git/loader.gif'
const Loader = ({ size, gap = '10', lgtext = 'xl', text = 'Loading...', reverse = false, width = '1/2', lgheight='5', padding = '0', fontweight='medium'}: { size?: string, gap?: string, lgtext?: string, text?: string, reverse?: boolean, width?:string, lgheight?:string, padding?:string, fontweight?:string }) => {
    return (
        <div className={`w-full flex flex-col justify-center items-center h-full gap-${gap} font-orbitron `}>
            {reverse ?
                <div className={`flex flex-col items-center justify-center p-${padding} gap-${gap} w-full`}>
                    <div className={`w-${width} bg-gradient-to-r from-black via-yellow from-0% via-50% to-black to-100%  lg:md:h-${lgheight} h-2 rounded-2xl animate-gradient-x`}>
                    </div>
                    <span className={`lg:text-${lgtext} text-center text-yellow font-${fontweight}`}>
                        {text}
                    </span>
                </div>
                :
                <div className={`flex flex-col p-${padding} gap-${gap}`}>
                    <span className={`lg:text-${lgtext} md:text-3xl sm:text-2xl text-xl text-yellow  font-${fontweight}`}>
                        {text}
                    </span>
                    <div className='bg-gradient-to-r from-black via-yellow from-0% via-50% to-black to-100% w-1/2 lg:md:h-5 h-2 rounded-2xl animate-gradient-x'>
                    </div>
                </div>
            }
        </div>);
}

export default Loader;