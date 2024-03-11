import SucessRegister from '../images/icons/SucessRegister.svg'
const SuccessAction = (props: { h1: string, button: string, buttonAction: () => Promise<void> }) => {

    const { h1, button, buttonAction } = props

    return (
        <div className="w-full flex flex-col gap-4 mt-5 justify-center items-center">
            <div className="rounded-3xl max-w-[386px] w-full flex flex-col gap-7 p-6 items-center bg-[#272727]">

                <h1 className="text-center text-white text-2xl font-orbitron font-bold">
                    {h1}
                </h1>

                <img src={SucessRegister} alt="Sucess register" />

                <button className='default_btn' onClick={buttonAction}>{button}</button>

            </div>


        </div>
    )
}
export default SuccessAction