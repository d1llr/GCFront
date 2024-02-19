import { useNavigate } from 'react-router-dom';
import image from '../images/icons/lerror.svg'

const Page404 = ({ navigateTo = '/' }: { navigateTo?: string }) => {
    const navigate = useNavigate()

    setTimeout(() => {
        navigate(navigateTo ?? '/')
    }, 2000);
    return (
        <div className='flex flex-row items-center gap-4 w-full h-full justify-center'>
            <img src={image} alt='err' />
            <div className='flex flex-col gap-2 items-center'>
                <span className='text-yellow text-8xl font-bold'>
                    ERROR
                </span>
                <span className='font-bold text-yellow text-8xl'>
                    404
                </span>
                <span className='text-white text-2xl'>
                    Oops...
                </span>
                <span className='text-white text-2xl'>
                    There is no such page
                </span>
            </div>
        </div>
    );
}

export default Page404;