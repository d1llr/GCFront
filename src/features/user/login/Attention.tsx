const Attention = () => {
    return (
        <div className="w-full flex flex-col gap-4 justify-center items-center">
            <div className="rounded-3xl w-[520px] h-[313px] flex flex-col gap-2 p-4 items-center bg-[#272727]">
        <div className="text-white font-orbitron font-bold pt-4 text-2xl">Attention!</div>

        <main className=" text-white text-center ">
        <ol className="text-[14px] m-3 ">
            <li className="">Take into account all commissions when making a transfer. If the amount is less or more than 10 PAC, the payment will not be credited automatically</li>
            <li className="mt-10">Send only USDT TRC20. Sending any other coin may result in its loss</li>
       </ol>
        
        </main>
        <button className=" rounded-xl font-bold text-lg font-orbitron bg-yellow w-[322px] h-[48px]">Accept</button>
    </div></div>
        
      
    )
}

export default Attention;