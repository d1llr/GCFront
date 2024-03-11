import ITournaments from "./Tournaments.type";
import { useGetActiveTournamentsQuery, useGetHistoryTournamentsQuery } from "./Tournaments.slice";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Loader from "../../helpers/Loader";
import Error from "../../helpers/Error";
import HistotyTournamentRating from "../games/game/HistotyTournamentRating";
const Tournaments = () => {
    const { data, isLoading, isError, error } = useGetActiveTournamentsQuery()
    const { data: HistoryData } = useGetHistoryTournamentsQuery()


    const navigate = useNavigate();


    // if (isLoading) {
    //     return <Loader />
    // }
    function convertISO8601ToDDMM(isoDate: string) {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed, so we add 1
        return `${day}.${month}`;
    }
    return (
        <div className="background-image-black">
            <div className="wrapper-content">
                <h1 className="font-orbitron w-fit text-yellow text-8xl font-extrabold">Tournaments</h1>

                <div className="grid grid-cols-3 gap-6 mt-10">
                    {data?.map((item: ITournaments, index: number) => {
                        return (
                            <div key={index} className="bg-lightGray p-6 rounded-[20px] flex flex-row gap-2 text-white w-full">
                                <div className="flex flex-col w-full gap-6 justify-between">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex flex-row justify-between items-base  gap-2" >
                                            <div className="text-white font-orbitron text-3xl flex flex-col items-start w-2/3">
                                                <div className="text-2xl font-bold">{item.name}</div>
                                            </div>
                                            <span className="p-2 text-base font-bold flex flex-col juistify-center text-center items-center rounded-3xl text-white w-36 h-10 bg-[#007E3D]">
                                                active
                                            </span>
                                        </div>
                                        <span className="pt-4 font-medium text-white text-2xl break-normal ">
                                            {item.goal}
                                        </span>

                                    </div>
                                    <div>
                                        <ul>
                                            <li className="flex flex-row justify-between">
                                                <span className=" font-bold font-orbitron text-2xl">
                                                    Game
                                                </span>
                                                <span className="font-orbitron font-bold ">
                                                    {item.game}
                                                </span>
                                            </li>
                                            <li className="flex flex-row justify-between">
                                                <span className=" font-bold font-orbitron text-2xl">
                                                    Duration
                                                </span>
                                                <span className="font-orbitron font-bold ">
                                                    {item.daysLeft} days
                                                </span>
                                            </li>
                                            <li className="flex flex-row justify-between">
                                                <span className=" font-bold font-orbitron text-2xl">
                                                    Cost
                                                </span>
                                                <span className="font-orbitron font-bold ">
                                                    {item.cost}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <button onClick={() => {
                                        navigate(`/tournaments/${item.id}`);
                                    }} className={`font-orbitron w-full text-yellow rounded-3xl bg-[#0D0D0D] text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30`}>
                                        More datailed
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    {HistoryData?.map((item: ITournaments, index: number) => {
                        return (
                            <div key={index} className="bg-lightGray p-6 rounded-[20px] flex flex-row gap-2 text-white">
                                <div className="flex flex-col w-full gap-8 justify-between">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-row justify-between items-base gap-2 " >
                                            <span className="font-orbitron text-2xl font-bold w-2/3">
                                                {item.name} | {item.id}
                                            </span>
                                            <span className="p-2 text-base font-bold flex flex-col juistify-center text-center items-center rounded-3xl text-white w-1/3 h-10 bg-[#898989]">
                                                Completed {convertISO8601ToDDMM(item.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between items-center text-2xl font-orbitron">
                                        <span>
                                            Game
                                        </span>
                                        <span>
                                            {item.game}
                                        </span>
                                    </div>
                                    <HistotyTournamentRating tournament_id={item.id} typeTR="history" />
                                    <button onClick={() => {
                                        navigate(`/tournaments/history/${item.id}`);
                                    }} className={`font-orbitron w-full text-yellow rounded-3xl bg-[#0D0D0D] text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30`}>
                                        More datailed
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    {(data?.length == 0 && HistoryData?.length == 0) && <Error />}
                </div>

            </div>

        </div>
    );
}

export default Tournaments;



{/* <div>
            <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
                Tournaments
            </h2>
            
        </div> */}

{/* <div className="w-2/3">
    <img src={import.meta.env.VITE_BACKEND_URL + item.image} alt="Фото игры" width={345} height={345} className="object-cover w-full h-full max-h-80" />
</div> */}