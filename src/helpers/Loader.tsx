import { Spinner } from 'flowbite-react';
import gif from '../images/git/loader.gif'
const Loader = (props: { size?: string }) => {
    return (
        <div className="w-full flex flex-col justify-center items-center h-full gap-10 font-orbitron">
            <span className='lg:text-5xl md:text-3xl sm:text-2xl text-xl text-yellow '>
                Loading...
            </span>
            <div className='bg-gradient-to-r from-black via-yellow from-0% via-50% to-black to-100% w-1/2 lg:md:h-5 h-2 rounded-2xl animate-gradient-x'>
            </div>
        </div>);
}

export default Loader;