import { ITournaments, ITournament } from "./Tournaments.type";
import { useGetActiveTournamentsQuery, useGetHistoryTournamentsQuery } from "./Tournaments.slice";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Loader from "../../helpers/Loader";
import Error from "../../helpers/Error";
import HistotyTournamentRating from "../games/game/HistotyTournamentRating";
import { useEffect, useState } from "react";
import { symbols } from "./tournament/TournamentBtn";


interface test {
    chainID: string[],
    game_name: string[]
}

const filteredFields = ['chainID', 'game_name']

const Tournaments = () => {
    const { data, isLoading, isError, isSuccess: ActiveTournamentsSuccess, error } = useGetActiveTournamentsQuery()
    const { data: HistoryData, isSuccess: HistoryTournamentsSuccess } = useGetHistoryTournamentsQuery()

    const [filter, setFilter] = useState<test>()
    const navigate = useNavigate();

    //     useEffect(() => {
    //         if (ActiveTournamentsSuccess && HistoryTournamentsSuccess) {
    //             let array = new Array<ITournament>().concat(data).concat(HistoryData)
    //             console.log(array);
    //             array.map((item: ITournament) => {
    //                 filteredFields.map(field => {
    //                     console.log(field); 
    //                     setFilter(prev => ({...prev, [field]: item[field]}))
    //             })


    //         })

    //     console.log(filter);


    // }
    //     }, [ActiveTournamentsSuccess, HistoryTournamentsSuccess])

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
                <div className="flex flex-col gap-5 lg:md:gap-10">


                    <h1 className="font-orbitron w-fit text-yellow lg:text-8xl md:text-6xl text-4xl font-extrabold">Tournaments</h1>
                    {/* <div className="flex flex-row mt-12 mb-7 gap-3 flex-wrap max-[920px]:gap-2"> */}
                    {/* {
                        filter?.map(item => {
                            return <button className="filter_btn">{{
                                symbols.hasOwnProperty(data?.chainID)
                                    ? symbols[data?.chainID as keyof typeof symbols]
                                    : symbols.default
                            }}</button>
                        })
                    } */}
                    {/* <button className="filter_btn active">OCTA</button>
                    <button className="filter_btn">REDEV2</button>
                    <button className="filter_btn">PAC Match 3</button>
                    <button className="filter_btn">PAC Shoot</button>
                    <button className="filter_btn">Active</button>
                    <button className="filter_btn">Completed</button> */}
                    {/* </div> */}
                    <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 grid-cols-1">
                        {data?.map((item: ITournaments, index: number) => {
                            return (
                                <div key={index} className="bg-lightGray p-6 rounded-[20px] flex flex-row gap-2 text-white w-full">
                                    <div className="flex flex-col w-full gap-6 justify-between">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-row justify-between items-base  gap-2" >
                                                <div className="text-white font-orbitron text-3xl flex flex-col items-start w-2/3">
                                                    <div className="lg:md:text-2xl sm:text-lg text-lg font-bold">{item.name}</div>
                                                </div>
                                                <span className="lg:md:p-2 p-1 lg:md:text-base text-sm  font-bold flex flex-col juistify-center whitespace-nowrap text-center items-center rounded-3xl text-white w-36 h-fit bg-[#007E3D]">
                                                    active
                                                </span>
                                            </div>
                                            <span className="pt-4 font-medium text-white lg:md:text-2xl sm:text-lg text-base break-normal ">
                                                {item.goal}
                                            </span>

                                        </div>
                                        <div>
                                            <ul>
                                                <li className="flex flex-row justify-between">
                                                    <span className=" font-bold font-orbitron lg:md:text-2xl sm:text-lg text-base">
                                                        Game
                                                    </span>
                                                    <span className="font-orbitron font-bold ">
                                                        {item.game_name}
                                                    </span>
                                                </li>
                                                <li className="flex flex-row justify-between">
                                                    <span className=" font-bold font-orbitron lg:md:text-2xl sm:text-lg text-base">
                                                        Duration
                                                    </span>
                                                    <span className="font-orbitron font-bold ">
                                                        {item.daysLeft} days
                                                    </span>
                                                </li>
                                                <li className="flex flex-row justify-between">
                                                    <span className=" font-bold font-orbitron lg:md:text-2xl sm:text-lg text-base">
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
                                        }} className={`font-orbitron w-full text-yellow rounded-3xl bg-[#0D0D0D] lg:md:text-xl text-base font-bold p-3 text-center cursor-pointer disabled:opacity-30 hover:bg-[#1B1B1B]`}>
                                            More detailed
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
                                                <span className="font-orbitron lg:md:text-2xl sm:text-lg text-lg font-bold w-2/3">
                                                    {item.name} | {item.id}
                                                </span>
                                                <span className="lg:md:p-2 p-1 lg:md:text-base text-sm font-bold flex flex-col juistify-center text-center items-center rounded-3xl text-white w-1/3 h-fit bg-[#898989]">
                                                    Ended {convertISO8601ToDDMM(item.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-between items-center lg:md:text-2xl sm:text-lg text-base font-orbitron">
                                            <span>
                                                Game
                                            </span>
                                            <span>
                                                {item.game_name}
                                            </span>
                                        </div>
                                        <HistotyTournamentRating tournament_id={item.id} typeTR="history" />
                                        <button onClick={() => {
                                            navigate(`/tournaments/history/${item.id}`);
                                        }} className={`font-orbitron w-full text-yellow rounded-3xl bg-[#0D0D0D] lg:md:text-xl text-base font-bold p-3 text-center cursor-pointer disabled:opacity-30 hover:bg-[#1B1B1B]`}>
                                            More detailed
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                        {(data?.length == 0 && HistoryData?.length == 0) && <Error />}
                    </div>
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