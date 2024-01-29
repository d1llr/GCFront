import { useNavigate, useParams } from "react-router-dom";
import { useGetCurrentDayMutation, useGetParticipateMutation, useGetTournamentByIdFromHistoryQuery } from "./Tournament.slice";
import { Oval } from "react-loader-spinner";
import browser from '../../../images/icons/browser.svg'
import apple from '../../../images/icons/apple.svg'
import android from '../../../images/icons/android.svg'
import win from '../../../images/icons/win.svg'
import { IoChevronBack } from "react-icons/io5";
import { memo, useMemo } from "react";
import tokenService from "../../../services/token.service";
import Rating from "./Rating";
import Loader from "../../../helpers/Loader";
import Page404 from "../../../helpers/Page404";
const HistoryTournament = () => {
    let params = useParams();
    const navigate = useNavigate();
    const [getCurrentDay, { isLoading: dayLoading }] = useGetCurrentDayMutation()
    const [getParticipate, { isLoading: participateLoading }] = useGetParticipateMutation()

    const { data, isLoading, isError, error, refetch } = useGetTournamentByIdFromHistoryQuery(params.tournamentId)
    // console.log(data?.players?.split(','));

    if (isLoading) {
        return <Loader />
    }

    const handleParticipate = () => {
        getParticipate({
            user_id: tokenService.getUser()?.id,
            tournament_id: data?.id || "0"
        })
            .then((response) => {
                console.log(response);
                refetch()
            })
            .catch((error) => {
                console.log(error)
            })

    }

    if (!data) {
        return <Page404 />
    }
    if (isError) {
        return <Page404 />
    }
    return (
        <div className="flex flex-row gap-20">
            <div className="text-white flex flex-col gap-5 w-3/4">
                <h2 onClick={() => { navigate(`/tournaments`) }}
                    className="w-fit decoration-dotted underline text-yellow text-2xl flex flex-row items-center cursor-pointer"
                >
                    <IoChevronBack />
                    <span>
                        Outdated Tournaments
                    </span>
                </h2>
                <div className="flex flex-row gap-6 mt-7 w-2/3">
                    <div className="flex flex-row gap-5">
                        <div className="w-1/2">
                            <img src={'https://back.pacgc.pw' + data?.image} alt="Фото" className="object-cover w-full" />
                        </div>
                        <div className="flex flex-col gap-2 h-full justify-between w-1/2">
                            <div className="flex flex-col gap-2 text-white">
                                <span className="text-yellow text-2xl">
                                    {data?.name}
                                </span>
                                <span className="text-xl">
                                    {data?.description}
                                </span>
                            </div>
                            <div>
                                <ul>
                                    <li className="flex flex-row justify-between">
                                        <span className="text-yellow text-2xl">
                                            Goal
                                        </span>
                                        <span>
                                            {data?.goal}
                                        </span>
                                    </li>
                                    <li className="flex flex-row justify-between">
                                        <span className="text-yellow text-2xl">
                                            Participants
                                        </span>
                                        <span>
                                            {data?.participants}
                                        </span>
                                    </li>
                                    <li className="flex flex-row justify-between">
                                        <span className="text-yellow text-2xl">
                                            Bank
                                        </span>
                                        <span>
                                            {data?.bank}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            {data?.players?.split(',').includes(tokenService.getUser()?.id.toString()) ?
                                <button className="w-full text-black bg-yellow text-xl font-bold p-3 text-center disabled:opacity-30">
                                    See you next time
                                </button>
                                :
                                <button className="w-full text-black bg-yellow text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30 " onClick={() => handleParticipate()}>
                                    See you next time
                                </button>}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <h1 className="text-yellow text-2xl decoration-dotted underline">
                        Tournament Rules
                    </h1>
                    <span>
                        {data?.description}
                    </span>
                </div>
            </div>
            <div className="w-1/4 relative">
                <h2 className="w-fit decoration-dotted underline text-yellow text-2xl z-0 pointer-events-none select-none p-2">
                    Player rating
                </h2>
                <div className="flex flex-row gap-6 mt-10 z-0 h-full" >
                    <Rating tournament_id={data?.id} typeTR={"history"} />
                </div>

            </div>
        </div >);
}

export default HistoryTournament;