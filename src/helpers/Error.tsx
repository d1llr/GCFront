import error from '../images/icons/error.svg'
const Error = () => {
    return (
        <div className="w-full flex justify-center items-center flex-col gap-2">
            <img className="w-8" src={error} alt="error" />
            <span className='text-white text-2xl'>
                Something went wrong!
            </span>
        </div>);
}

export default Error;