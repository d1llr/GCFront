import { useNavigate, useParams } from "react-router-dom";
import { useGetCurrentDayMutation, useGetParticipateMutation, useGetRatingMutableMutation, useGetTournamentByIdFromHistoryQuery } from "./Tournament.slice";
import { Oval } from "react-loader-spinner";
import browser from '../../../images/icons/browser.svg'
import apple from '../../../images/icons/apple.svg'
import android from '../../../images/icons/android.svg'
import win from '../../../images/icons/win.svg'
import { IoChevronBack } from "react-icons/io5";
import { memo, useEffect, useMemo, useState } from "react";
import tokenService from "../../../services/token.service";
import Rating from "./Rating";
import Loader from "../../../helpers/Loader";
import Page404 from "../../../helpers/Page404";
import { symbols } from "./TournamentBtn";
import { IRating } from "../Tournaments.type";
const HistoryTournament = () => {
    let params = useParams();
    const navigate = useNavigate();
    const [getCurrentDay, { isLoading: dayLoading }] = useGetCurrentDayMutation()
    const [getParticipate, { isLoading: participateLoading }] = useGetParticipateMutation()
    const [rating, setRating] = useState<IRating[]>()

    const { data, isLoading, isError, isSuccess, error, refetch } = useGetTournamentByIdFromHistoryQuery(params.tournamentId)
    // console.log(data?.players?.split(','));
    const [getRating, { isLoading: getRatingLoading, isSuccess: getRatingSuccess, isError: getRatingIsError }] = useGetRatingMutableMutation()


    if (isLoading) {
        return <Loader />
    }



    // useEffect(() => {
    //     if (data) {
    //         getRating({
    //             tournament_id: data.id,
    //             type: 'history'
    //         })
    //             .unwrap()
    //             .then(responce => {
    //                 console.log(responce);
    //             })
    //             .catch(err => {
    //                 console.log(err);

    //             })
    //     }
    // }, [isSuccess])

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


    const getDate = (createdAt: string, daysLeft?: string) => {

        let res = new Date(createdAt);
        if (daysLeft) {
            res.setDate(res.getDate() + Number(daysLeft));

            console.log(res);
            return res.toDateString()
        }
        else {

            console.log(res);
            return res.toDateString()
        }
        // Add ten days to specified date
    }

    const getStartDate = (createdAt: string, daysLeft?: string) => {

        let res = new Date(createdAt);
        if (daysLeft) {
            res.setDate(res.getDate() - Number(daysLeft));

            console.log(res);
            return res.toDateString()
        }
        else {

            console.log(res);
            return res.toDateString()
        }
        // Add ten days to specified date
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
                <div className="flex flex-col lg:md:gap-[150px] sm:gap-[80px] gap-10 justify-between h-full">
                    <div className="flex flex-col lg:md:gap-8 sm:gap-6 gap-4 font-orbitron">
                        <h1 className="font-orbitron lg:md:w-2/3 w-full text-yellow lg:text-8xl md:text-6xl text-4xl  font-extrabold">{data?.name}</h1>
                        <div className="w-2/5 font-medium text-[32px] text-white lg:md:leading-10 leading-5 lg:md:w-2/5 w-full sm:w-4/5 font-semibold lg:md:text-2xl text-base text-white">{data?.goal}</div>
                        <div className="flex flex-col gap-2 lg:md:w-1/2 w-full">
                            <div className="flex flex-row items-center gap-2">
                                <span className="text-yellow lg:md:text-2xl sm:text-lg text-base font-bold">
                                    Ended:
                                </span>
                                <span className="text-white lg:md:text-2xl sm:text-lg text-base font-bold">
                                    {getDate(data?.createdAt)}
                                </span>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <span className="text-yellow lg:md:text-2xl sm:text-lg text-base font-bold">
                                    Game:
                                </span>
                                <span className="text-white lg:md:text-2xl sm:text-lg text-base font-bold">
                                    {data?.game_name}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-10 font-orbitron ">
                        <h2 className="w-fit text-yellow lg:text-8xl md:text-6xl text-4xl font-extrabold">Rewards</h2>
                        <div className="flex lg:md:flex-row flex-col gap-2 w-full justify-between">
                            {data?.awards.split(',').map((el, index) => {
                                return (
                                    <div className="flex lg:md:flex-col flex-row justify-between gap-10">
                                        <span className="lg:text-5xl md:text-4xl sm:text-2xl text-2xl text-white font-bold">
                                            #{index + 1} place
                                        </span>
                                        <span className="lg:text-[32px] md:text-[26px] sm:text-[22px] text-[20px] font-bold text-yellow">
                                            {el} {symbols.hasOwnProperty(data?.chainID)
                                                ? symbols[data?.chainID as keyof typeof symbols]
                                                : symbols.default
                                            }
                                        </span>
                                    </div>)
                            })}
                        </div>

                    </div>
                    <div className="flex flex-col gap-10 font-orbitron ">
                        <h2 className="w-fit text-yellow lg:text-8xl md:text-6xl text-4xl font-extrabold">Details</h2>
                        <div className="grid lg:grid-cols-4 gap-4 md:grid-cols-2 grid-cols-1">
                            <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl ">
                                <span className="text-[32px] text-yellow font-bold ">
                                    Game
                                </span>
                                <span className="text-2xl font-normal text-white font-chakra">
                                    {data?.game_name}
                                </span>
                            </div>
                            <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl ">
                                <span className="text-[32px] text-yellow font-bold">
                                    Start
                                </span>
                                <span className="text-2xl font-normal text-white font-chakra">
                                    {getStartDate(data?.createdAt, data?.daysLeft)}
                                </span>
                            </div>
                            <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl">
                                <span className="text-[32px] text-yellow font-bold">
                                    Finish
                                </span>
                                <span className="text-2xl font-normal text-white font-chakra">
                                    {getDate(data?.createdAt)}
                                </span>
                            </div>
                            <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl ">
                                <span className="text-[32px] text-yellow font-bold">
                                    Participants
                                </span>
                                <span className="text-2xl font-normal text-white font-chakra">
                                    {data?.participants}
                                </span>
                            </div>
                        </div>

                    </div>
                    <Rating tournament_id={data?.id} typeTR={"history"} />
                </div>
            </div >

        </div>);
}

export default HistoryTournament;