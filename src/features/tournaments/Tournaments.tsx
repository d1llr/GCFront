import ITournaments from "./Tournaments.type";
import { useGetActiveTournamentsQuery, useGetHistoryTournamentsQuery } from "./Tournaments.slice";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Loader from "../../helpers/Loader";
import Error from "../../helpers/Error";
const Tournaments = () => {
    const { data, isLoading, isError, error } = useGetActiveTournamentsQuery()
    const { data: HistoryData } = useGetHistoryTournamentsQuery()

    const navigate = useNavigate();

    if (isLoading) {
        return <Loader />
    }
    return (
        <div>
            <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
                Tournaments
            </h2>
            <div className="grid grid-cols-2 gap-6 mt-10">
                {data?.map((item: ITournaments, index: number) => {
                    return (
                        <div key={index} className="border-yellow border-2 p-3 flex flex-row gap-2 text-white">
                            <div className="w-2/3">
                                <img src={'https://back.pacgc.pw' + item.image} alt="Фото игры" width={345} height={345} className="object-cover w-full h-full max-h-80" />
                            </div>
                            <div className="flex flex-col w-full gap-6 justify-center">
                                <div>
                                    <div className="flex flex-row justify-between items-center gap-2" >
                                        <span className="text-yellow text-3xl">
                                            {item.name} | {item.id}
                                        </span>
                                        <span className="text-gray">
                                            {item.daysLeft} days
                                        </span>
                                    </div>
                                    <span className="text-white text-base break-normal">
                                        {item.description}
                                    </span>

                                </div>
                                <div>
                                    <ul>
                                        <li className="flex flex-row justify-between">
                                            <span className="text-yellow text-2xl">
                                                Goal
                                            </span>
                                            <span>
                                                {item.goal}
                                            </span>
                                        </li>
                                        <li className="flex flex-row justify-between">
                                            <span className="text-yellow text-2xl">
                                                Participants
                                            </span>
                                            <span>
                                                {item.participants}
                                            </span>
                                        </li>
                                        <li className="flex flex-row justify-between">
                                            <span className="text-yellow text-2xl">
                                                Bank
                                            </span>
                                            <span>
                                                {item.bank}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <button onClick={() => {
                                    navigate(`/tournaments/${item.id}`);
                                }} className={`w-full text-black bg-yellow text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30`}
                                    disabled={item.disabled}>
                                    More datailed
                                </button>
                            </div>
                        </div>
                    )
                })}
                {HistoryData?.map((item: ITournaments, index: number) => {
                    return (
                        <div key={index} className="border-yellow border-2 p-3 flex flex-row gap-2 text-white opacity-30">
                            <div className="w-2/3">
                                <img src={'https://back.pacgc.pw' + item.image} alt="Фото игры" width={345} height={345} className="object-cover w-full h-full max-h-80" />
                            </div>
                            <div className="flex flex-col w-full gap-6 justify-center">
                                <div>
                                    <div className="flex flex-row justify-between items-center gap-2" >
                                        <span className="text-yellow text-3xl">
                                            {item.name} | {item.id}
                                        </span>
                                        <span className="text-gray">
                                            {item.daysLeft} days
                                        </span>
                                    </div>
                                    <span className="text-white text-base break-normal">
                                        {item.description}
                                    </span>

                                </div>
                                <div>
                                    <ul>
                                        <li className="flex flex-row justify-between">
                                            <span className="text-yellow text-2xl">
                                                Goal
                                            </span>
                                            <span>
                                                {item.goal}
                                            </span>
                                        </li>
                                        <li className="flex flex-row justify-between">
                                            <span className="text-yellow text-2xl">
                                                Participants
                                            </span>
                                            <span>
                                                {item.participants}
                                            </span>
                                        </li>
                                        <li className="flex flex-row justify-between">
                                            <span className="text-yellow text-2xl">
                                                Bank
                                            </span>
                                            <span>
                                                {item.bank}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <button onClick={() => {
                                    navigate(`/tournaments/history/${item.id}`);
                                }} className={`w-full text-black bg-yellow text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30`}
                                    disabled={item.disabled}>
                                    More datailed
                                </button>
                            </div>
                        </div>
                    )
                })}
                {(data?.length == 0 && HistoryData?.length == 0) && <Error />}
            </div>
        </div>
    );
}

export default Tournaments;