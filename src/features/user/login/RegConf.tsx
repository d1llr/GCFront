import SucessRegister from '../../../images/icons/SucessRegister.svg'
const RegConf = () => {
    return (
        <div className="w-full flex flex-col gap-4 justify-center items-center">
            <div className="rounded-3xl w-[386px] h-[278px] flex flex-col gap-2 p-6 items-center bg-[#272727]">
                <div className="text-center text-white text-[24px] font-orbitron  font-bold">
                    You are registred
                    <div className='p-6 flex flex-col justify-center items-center'>
                        <img src={SucessRegister}alt="Sucess register"/>
                    </div>
                    </div>
                    <div>
                        <button className='font-orbitron text-[20px] font-bold text-black rounded-xl bg-yellow w-[322px] h-[50px]'>log in</button>
                    </div>
                </div>
            

        </div>
    )
}
export default RegConf