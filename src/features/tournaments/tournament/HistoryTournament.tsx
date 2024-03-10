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


    const getDate = (createdAt: string, daysLeft: string) => {

        let res = new Date(createdAt);

        // Add ten days to specified date
        res.setDate(res.getDate() + Number(daysLeft));

        console.log(res);
        return res.toDateString()
    }

    if (!data) {
        return <Page404 />
    }
    if (isError) {
        return <Page404 />
    }
    return (
        <div className="background-image-yellow">
            <div className="wrapper-content">
                <div className="flex flex-col gap-[150px] justify-between h-full">
                    <div className="flex flex-col gap-8 font-orbitron">
                        <h1 className="font-orbitron w-2/3 text-yellow text-8xl font-extrabold">{data?.name}</h1>
                        <div className="w-2/5 font-medium text-[32px] text-white leading-10">{data?.goal}</div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <div className="flex flex-row items-center gap-2">
                                <span className="text-yellow text-2xl font-bold">
                                    Ended:
                                </span>
                                <span className="text-white text-2xl font-bold">
                                    {getDate(data?.createdAt, data?.daysLeft)}
                                </span>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <span className="text-yellow text-2xl font-bold">
                                    Game:
                                </span>
                                <span className="text-white text-2xl font-bold">
                                    {data?.game}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-10 font-orbitron ">
                        <h2 className="w-fit text-yellow text-8xl font-extrabold">Awards</h2>
                        <div className="flex flex-row gap-2 w-full justify-between">
                            {[...Array(5)].map((el, index) => {
                                return (
                                    <div className="flex flex-col gap-10">
                                        <span className="text-5xl text-white font-bold">
                                            #{index + 1} place
                                        </span>
                                        <span className="text-[32px] font-bold text-yellow">
                                            100 PAC
                                        </span>
                                    </div>)
                            })}
                        </div>

                    </div>
                    <div className="flex flex-col gap-10 font-orbitron ">
                        <h2 className="w-fit text-yellow text-8xl font-extrabold">Details</h2>
                        <div className="flex flex-row gap-5 w-full justify-between">
                            <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl w-1/4">
                                <span className="text-[32px] text-yellow font-bold ">
                                    Game
                                </span>
                                <span className="text-2xl font-normal text-white font-chakra">
                                    {data?.game}
                                </span>
                            </div>
                            <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl w-1/4">
                                <span className="text-[32px] text-yellow font-bold">
                                    Start
                                </span>
                                <span className="text-2xl font-normal text-white font-chakra">
                                    {new Date(data?.createdAt).toDateString()}
                                </span>
                            </div>
                            <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl w-1/4">
                                <span className="text-[32px] text-yellow font-bold">
                                    Finish
                                </span>
                                <span className="text-2xl font-normal text-white font-chakra">
                                    {getDate(data?.createdAt, data?.daysLeft)}
                                </span>
                            </div>
                            <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl w-1/4">
                                <span className="text-[32px] text-yellow font-bold">
                                    Participants
                                </span>
                                <span className="text-2xl font-normal text-white font-chakra">
                                    {data?.participants}
                                </span>
                            </div>
                        </div>

                    </div>
                    <Rating tournament_id={data?.id} typeTR={"active"} />
                </div>
            </div >

        </div>);
}

export default HistoryTournament;