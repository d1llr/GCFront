import INFT from "./Nft.type";
import QPhoto from '../../images/nft/que.png'
const Nft = () => {
    const data:INFT[] = [
        {
            image:'../../src/images/nft/1.png',
            name: 'Name',
            description: 'Description',
            button: 'More detailed'
        },
        {
            image:'../../src/images/nft/test2.png',
            name: 'Name',
            description: 'Description',
            button: 'More detailed'
        },
        {
            image:'../../src/images/nft/test2.png',
            name: 'Name',
            description: 'Description',
            button: 'More detailed'
        }
    ]
    return (
        <div>
            <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
               NFT
            </h2>
            <div className="flex flex-row gap-6 mt-10">
                {data.map((item:INFT, index: number)=>{
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