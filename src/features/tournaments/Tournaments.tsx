import { ITournaments, ITournament, IFilters } from "./Tournaments.type";
import { useGetTournamentsQuery, useGetFiltersQuery, useGetTournamentsCountQuery, useGetTournamentsByFiltersMutation } from "./Tournaments.slice";
import { Oval } from "react-loader-spinner";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "../../helpers/Loader";
import Error from "../../helpers/Error";
import HistotyTournamentRating from "../games/game/HistotyTournamentRating";
import { createRef, useEffect, useState } from "react";
import { symbols } from "./tournament/TournamentBtn";
import { object } from "yup";



type filteredFields = 'chainID' | 'game_name' | 'type'


    const limit = 6
    const [pagination, setPagination] = useState<number>(0)

    const { data, isLoading, isError, isSuccess: ActiveTournamentsSuccess, error, refetch } = useGetTournamentsQuery({
        offset: pagination * limit,
        limit: limit
    })
    const [dataFilterAll, setDataFilterAll] = useState<{ history: any; active: string | any[]; }>({history: "", active: ""});
    const [dataFilter, setDataFilter] = useState(data);

    useEffect(() => {
        refetch()
        if (activeFilters.chainID.length || activeFilters.game_name.length || activeFilters.type.length) {
            paginationSlice(dataFilterAll);
        }
    }, [pagination])

    useEffect(() => {
        if (!activeFilters.chainID.length && !activeFilters.game_name.length && !activeFilters.type.length) {
            setDataFilter(data);
        }
    }, [data])


    const { data: FilterData, isSuccess: FilterDataSuccess, isLoading: FilterDataLoading } = useGetFiltersQuery()
    const { data: tournamentsCount, isSuccess: tournamentsCountSuccess } = useGetTournamentsCountQuery()

    const [pagesCount, setPagesCount] = useState<number>()

    const [filter, setFilter] = useState<IFilters>()
    const navigate = useNavigate();


    const [activeFilters, setActiveFilters] = useState<IFilters>({
        chainID: [],
        game_name: [],
        type: []
    })


    const [tournamentsRefsArray] = useState(() =>
        Array.from({ length: data?.length ?? 2 }, () => createRef<HTMLDivElement>())
    );
    // useEffect(() => {
    //     refetch()
    // }, [pagination])

    const GetNumberContainer = (props: { fill?: string, value: number }) => {
        return <div className={`flex items-center justify-center border-2 cursor-pointer rounded-xl hover:border-yellow h-12 w-12  ${pagination == props.value ? ' border-yellow bg-yellow text-black hover:text-black ' : `border-lightGray text-lightGray hover:text-yellow`}`} onClick={() => setPagination(props.value)}>
            {props.value + 1}
        </div >
    }

    function transformObject(inputs: any) {
        let output: any = {
            chainID: [],
            game_name: [],
            type: []
        };

        inputs.map((input: any) => {
            for (let key in input) {
                if (input[key]['chainID'] && !output.chainID.includes(input[key]['chainID'])) {
                    output.chainID.push(input[key]['chainID']);
                }
                if (input[key]['game_name'] && !output.game_name.includes(input[key]['game_name'])) {
                    output.game_name.push(input[key]['game_name']);
                }
            }
            output.type.push(input['type']);
        })
        return output;
    }
    
    useEffect(() => {
        if (FilterData) {
            setFilter(() => transformObject(FilterData))
            

            // setFilter(() => {
            //     let res: string[] = []
            //     FilterData.map(item => {
            //         let values = Object.keys(item).filter(key => !Number.isNaN(Number(key)) ?? key).map(key => Object.values(item[key]))
            //         values.map((value, index: number) => {
            //             value.map(v => {
            //                 if (!res.includes(v))
            //                     res.push(v)
            //             })
            //         })
            //         if (!res.includes(item.type))
            //             res.push(item.type)

            //     })
            //     return res
            // })

        }
    }, [FilterDataSuccess])

    useEffect(() => {
        if (activeFilters.chainID.length || activeFilters.game_name.length || activeFilters.type.length) {
            getTournamentsByFilter(activeFilters)
                .unwrap()
                .then(responce => {
                    setDataFilterAll(responce);
                    setPagesCount(responce.active.length + responce.history.length);
                    setPagination(0);
                    paginationSlice(responce);              

                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            setDataFilter(data);
            setPagesCount(tournamentsCount)
        }
    }, [activeFilters])

    function paginationSlice(arr: { history: any; active: string | any[]; }) {
        let offset = pagination * limit;        
        let res: any = {};
        res.active = arr.active.slice(offset, offset + limit);

        if (!res.active.length) { 
            let historyOffset =  offset - arr.active.length;
            res.history = arr.history.slice(historyOffset, historyOffset + limit);   
        } else {
            res.history = arr.history.slice(0, limit - arr.active.length);
        }

        setDataFilter(res);
    }

    function activeFiltersChange(key: string, item: string) {
        if (!activeFilters[key as filteredFields].includes(item)) {
            setActiveFilters(prev => ({ ...prev, [key]: [...prev[key as filteredFields], item] }))
        } else {
            setActiveFilters(prev => ({ ...prev, [key]: prev[key as filteredFields].filter(x => x != item) }))
        }
    }

    useEffect(() => {
        if (tournamentsCount)
            setPagesCount(tournamentsCount)
    }, [tournamentsCountSuccess])

    if (isLoading || getUserNameLoading) {

        return <Loader />
    }

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
                    {
                        filter &&
                        <div className="flex flex-row gap-3 flex-wrap max-[920px]:gap-2">
                            {
                                Object.keys(filter)?.map((key: string | filteredFields) => {
                                    return filter[key as filteredFields].map((item: string) => {
                                        return <button
                                            className={`filter_btn ${activeFilters[key as filteredFields]?.includes(item) ? 'active' : ""}`}
                                            onClick={(e) => activeFiltersChange(key, item)}

                                            data-field={item}>
                                            {symbols.hasOwnProperty(item)
                                                ? symbols[item as keyof typeof symbols]
                                                : item
                                            }</button>

                                    })
                                })
                            }

                        </div>}
                    <div className={`grid lg:grid-cols-3 gap-4 md:grid-cols-2 grid-cols-1 ${dataFilter?.length == 0 && 'hidden'}`}>
                        {dataFilter?.active?.map((item: any, index: number) => {
                            return (
                                <div key={index} className={`bg-lightGray p-6 rounded-[20px] flex flex-row gap-2 text-white w-full `} data-chainID={item.chainID} data-game_name={item.game_name} data-type="active" ref={tournamentsRefsArray[index]}>
                                    <div className="flex flex-col w-full gap-6 justify-between">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-row justify-between items-base  gap-2" >
                                                <div className="text-white font-orbitron text-3xl flex flex-col items-start w-2/3">
                                                    <div className="lg:md:text-2xl sm:text-lg text-lg font-bold">{item.name}</div>

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
                            {data &&
                                data['history']?.map((item: any, index: number) => {

                                    return (
                                        <div key={index} className="bg-lightGray p-6 rounded-[20px] flex flex-row gap-2 text-white" data-chainID={item.chainID} data-game_name={item.game_name} data-type="ended" >
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
                        {dataFilter?.history?.map((item: any, index: number) => {

                            return (
                                <div key={index} className="bg-lightGray p-6 rounded-[20px] flex flex-row gap-2 text-white" data-chainID={item.chainID} data-game_name={item.game_name} data-type="ended" >
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
                        {/* {HistoryData?.map((item: ITournaments, index: number) => {
                            return (
                                <div key={index} className="bg-lightGray p-6 rounded-[20px] flex flex-row gap-2 text-white" data-chainID={item.chainID} data-game_name={item.game_name} data-type="ended" ref={endedRefsArray[index]}>
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
                        })} */}
                    </div>
                    
                    {/* {data?.length == 0 && (

                        <div className="bg-lightGray rounded-[30px] flex flex-col items-center lg:md:mt-10 mt-3 gap-10 px-6 pt-16 pb-12 max-[920px]:pt-8 max-[920px]:pb-6">
                            <div className="flex flex-col items-center gap-5">
                                <div className="font-orbitron text-white text-center text-[28px] leading-[35px] max-[920px]:text-[18px] max-[920px]:leading-[23px]">
                                    We are not holding tournaments now, but they will appear soon
                                </div>
                                <div className="font-chakra text-textGray text-[26px] leading-[34px] text-center max-[920px]:text-[16px] max-[920px]:leading-[21px]">
                                    In the meantime, you can play our games
                                </div>
                            </div>
                            <NavLink className="black_btn max-w-[475px]" to="/games">
                                Games
                            </NavLink>
                        </div>)} */}
                    <div className="flex flex-row justify-center items-center gap-2 mt-5">
                        {(pagesCount && pagesCount > limit) && ([...new Array(Math.ceil(pagesCount / limit))].map((page, index: number) => {                          

                            return <GetNumberContainer value={index} />
                        }))}
                    </div> */}
                </div>
            </div>

        </div >
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