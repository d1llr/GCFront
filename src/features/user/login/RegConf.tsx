import SucessRegister from '../../../images/icons/SucessRegister.svg'
const RegConf = () => {
    return (
        <div className="w-full flex flex-col gap-4 justify-center items-center">
            <div className="rounded-3xl max-w-[386px] w-full flex flex-col gap-7 p-6 items-center bg-[#272727]">
                
                <h1 className="text-center text-white text-2xl font-orbitron font-bold">
                    You are registred
                </h1>

                <img src={SucessRegister} alt="Sucess register" />

                <button className='p-2 font-orbitron text-xl font-bold text-black rounded-xl bg-yellow w-full'>log in</button>

            </div>


        </div>
    )
}
export default RegConf