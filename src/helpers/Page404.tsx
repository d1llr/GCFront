import { useNavigate } from 'react-router-dom';
import image from '../images/icons/lerror.svg'

const Page404 = ({ navigateTo = '/' }: { navigateTo?: string }) => {
    const navigate = useNavigate()

    // setTimeout(() => {
    //     navigate(navigateTo ?? '/')
    // }, 2000);
    return (
        // <div className='flex flex-row items-center gap-4 w-full h-full justify-center'>
        //     <img src={image} alt='err' />
        //     <div className='flex flex-col gap-2 items-center'>
        //         <span className='text-yellow text-8xl font-bold'>
        //             ERROR
        //         </span>
        //         <span className='font-bold text-yellow text-8xl'>
        //             404
        //         </span>
        //         <span className='text-white text-2xl'>
        //             Oops...
        //         </span>
        //         <span className='text-white text-2xl'>
        //             There is no such page
        //         </span>
        //     </div>
        // </div>
        <div id="error-page" className="flex justify-center items-center">
            <div className="wrapper w-full">
                <div className="flex flex-col justify-center items-center gap-16 max-[700px]:gap-10">
                    <h1 className="flex flex-col justify-center items-center text-yellow font-orbitron font-bold text-[100px] leading-[100%] max-[700px]:text-[68px]">
                        <span>ERROR</span>
                        <span>404</span>
                    </h1>
                    <div className="flex flex-col items-center justify-center text-white font-orbitron text-[36px] leading-[132%] max-[700px]:text-[18px]">
                        <span>Oops...</span>
                        <span>There is no such page</span>
                    </div>
                    <a className="yellow_btn" href="/">
                        To the main page
                    </a>
                </div>
            </div>
        </div>

    );
}

export default Page404;