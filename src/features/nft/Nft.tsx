import INFT from "./Nft.type";
import QPhoto from '../../images/nft/que.png'
import { useGetNFTSQuery } from "./Nft.slice";
import { Oval } from "react-loader-spinner";
const Nft = () => {
    const { data, isLoading, isError, error } = useGetNFTSQuery(null)


    
    if (isLoading) {
        return <Oval
            height={80}
            width={80}
            color="#FFF100"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}

        />
    }
    return (
        <div>
            <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
                NFT
            </h2>
            <div className="flex flex-row gap-6 mt-10">
                {data?.map((item: INFT, index: number) => {
                    return (
                        <div key={index} className="border-yellow border-2 p-3 flex flex-col gap-2">
                            <img src={item.image} alt="Фото игры" />
                            <span className="text-yellow text-2xl">
                                {item.name}
                            </span>
                            <span className="text-white text-xl break-normal">
                                {item.description}
                            </span>
                        </div>
                    )
                })}
                <div className="border-yellow border-2 p-3 flex flex-col justify-between">
                    <img src={QPhoto} alt="Go to store" />
                    <button className="w-full bg-yellow text-xl font-bold p-3">
                        Go to store
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Nft;