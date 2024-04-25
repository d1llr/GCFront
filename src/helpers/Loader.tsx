import { Spinner } from 'flowbite-react';
import gif from '../images/git/loader.gif'
const Loader = ({ size, gap = '10', text_color = 'text-yellow', lgtext = 'xl', text = 'Loading...', reverse = false, width = '1/2', lgheight = '5', padding = '0', fontweight = 'medium' }: { size?: string, gap?: string, text_color?: string, lgtext?: string, text?: string, reverse?: boolean, width?: string, lgheight?: string, padding?: string, fontweight?: string }) => {
    return (
        <div className={`w-full flex flex-col justify-center items-center h-full gap-${gap} font-orbitron `}>
            <div className={`flex ${reverse ? 'flex-col-reverse' : 'flex-col'} items-center justify-center p-${padding} gap-${gap} w-full`}>
                <div className={`w-${width} bg-gradient-to-r from-black via-yellow from-0% via-50% to-black to-100%  lg:md:h-${lgheight} h-2 rounded-2xl animate-gradient-x`}>
                </div>
                <span className={`lg:text-${lgtext} text-center ${text_color} font-${fontweight}`}>
                    {text}
                </span>
            </div>
        </div>);
}

export default Loader;