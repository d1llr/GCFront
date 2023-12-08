import { useParams } from "react-router-dom";
import { useGetGameByIdQuery } from "./Game.slice";
import { Oval } from "react-loader-spinner";
import browser from '../../../images/icons/browser.svg'
import apple from '../../../images/icons/apple.svg'
import android from '../../../images/icons/android.svg'
import win from '../../../images/icons/win.svg'
const Game = () => {
    let params = useParams();

    const { data, isLoading, isError, error } = useGetGameByIdQuery(params.gamesId)
    console.log(data);

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
        <div className="flex flex-row gap-20">
            <div className="text-white flex flex-col gap-5">
                <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
                    Games
                </h2>
                <div className="flex flex-row gap-6 mt-7    ">
                    <div className="flex flex-row gap-5">
                        <div className="w-1/2">
                            <img src={data?.image} alt="Фото" className="object-cover w-full h-full max-h-80" />
                        </div>
                        <div className="flex flex-col gap-2 h-full justify-between">
                            <div className="flex flex-col gap-2 text-white">
                                <span className="text-yellow text-2xl">
                                    {data?.name}
                                </span>
                                <span className="text-xl">
                                    {data?.description}
                                </span>
                            </div>
                            <div className="flex flex-row gap-2">
                                <img src={android} alt="android" />
                                <img src={win} alt="win" />
                                <img src={apple} alt="apple" />
                                <img src={browser} alt="browser" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <span>
                        {data?.description}
                    </span>
                </div>
                <div className="flex flex-row gap-5">
                    <div className="w-1/2">
                        <img src={data?.image} alt="Фото" className="object-cover w-full h-full max-h-80" />
                    </div>
                    <div className="w-1/2">
                        <img src={data?.image} alt="Фото" className="object-cover w-full h-full max-h-80" />
                    </div>
                </div>
            </div>
            <div className="w-1/3">
                <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
                    Game history
                </h2>
                <div className="flex flex-row gap-6 mt-10">
                    <table className="gap-2 flex flex-col w-full">
                        <tr className="text-yellow w-full flex flex-row justify-around text-xl">
                            <th>Time</th>
                            <th>Data</th>
                            <th>Reward</th>
                        </tr>
                        {
                            [...Array(20)].map(() => {
                                return <tr className="text-white border-t-2 border-b-2 border-gray w-full flex flex-row justify-around py-1 text-base">
                                    <td>
                                        23:44
                                    </td>
                                    <td>
                                        22.02.2023
                                    </td>
                                    <td>
                                      + 10 $
                                    </td>
                                </tr>
                            })
                        }
                    </table>
                </div>

            </div>
        </div>);
}

export default Game;