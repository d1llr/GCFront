import Loader from "../../../helpers/Loader";
import { useGetRatingQuery } from "./Tournament.slice";
import { IRating } from '../Tournaments.type'
import { useGetUserInfoQuery, useGetUserNameMutation } from "../../user/User.slice";
import { ReactNode, useEffect } from "react";
import tokenService from "../../../services/token.service";
import Page404 from "../../../helpers/Page404";
import Error from "../../../helpers/Error";

interface IRat {
    tournament_id: string | undefined,
    typeTR: string
}

const Rating = (props: IRat) => {
    const { data, isLoading, isSuccess, isError } = useGetRatingQuery({
        tournament_id: props.tournament_id,
        type: props.typeTR
    })

    const [getUserName, { isLoading: getUserNameLoading }] = useGetUserNameMutation()

    if (isLoading) {
        return <Loader />
    }

    return data && (
        <div className="flex flex-col lg:md:gap-10 gap-4 font-orbitron ">
            <h2 className="w-fit text-yellow lg:text-8xl md:text-6xl text-4xl font-extrabold">Players Rating</h2>
            <table className="gap-2 flex flex-col w-full h-full" key={'123'}>
                <thead>
                    <tr className="text-white w-full lg:md:flex flex-row hidden items-center text-4xl text-center p-5 font-bold" key={'123'}>
                        <th className="w-1/4 text-start">Rating</th>
                        <th className="w-1/4 text-start">Login</th>
                        <th className="w-1/4 text-start leading-4">Games count</th>
                        <th className="w-1/4 text-start">Earned</th>
                    </tr>
                </thead>
                <tbody className="gap-3 flex flex-col">
                    {
                        isSuccess && data?.map((item: IRating, index: number) => {
                            return tokenService.getUser()?.username == item.username ?
                                <tr className="text-black bg-yellow w-full flex lg:md:flex-row flex-col p-5 lg:md:text-2xl sm:text-lg text-sm font-medium rounded-2xl" key={index}>
                                    <td className="lg:md:w-1/4 max-sm:flex max-sm:flex-row max-sm:justify-between text-start">
                                        <span className="lg:md:hidden">
                                            Rating
                                        </span>
                                        <span>
                                            #{index + 1}
                                        </span>
                                    </td>
                                    <td className="lg:md:w-1/4 max-sm:flex max-sm:flex-row max-sm:justify-between text-start">
                                        <span className="lg:md:hidden">
                                            Login
                                        </span>
                                        <span>
                                            {item.username}
                                        </span>
                                    </td>
                                    <td className="lg:md:w-1/4 max-sm:flex max-sm:flex-row max-sm:justify-between text-start">
                                        <span className="lg:md:hidden">
                                            Games count
                                        </span>
                                        <span>
                                            {item.games_count}
                                        </span>
                                    </td>
                                    <td className="lg:md:w-1/4 max-sm:flex max-sm:flex-row max-sm:justify-between text-start">
                                        <span className="lg:md:hidden">
                                            Earned
                                        </span>
                                        <span>
                                            {item.earned} PAC
                                        </span>
                                    </td>
                                </tr>
                                : <tr className="text-white bg-lightGray w-full flex lg:md:flex-row flex-col  p-5 lg:md:text-2xl sm:text-lg text-sm font-medium rounded-2xl" key={index}>
                                    <td className="lg:md:w-1/4 max-sm:flex max-sm:flex-row max-sm:justify-between text-start">
                                        <span className="lg:md:hidden">
                                            Rating
                                        </span>
                                        <span>
                                            #{index + 1}
                                        </span>
                                    </td>
                                    <td className="lg:md:w-1/4 max-sm:flex max-sm:flex-row max-sm:justify-between text-start">
                                        <span className="lg:md:hidden">
                                            Login
                                        </span>
                                        <span>
                                            {item.username}
                                        </span>
                                    </td>
                                    <td className="lg:md:w-1/4 max-sm:flex max-sm:flex-row max-sm:justify-between text-start">
                                        <span className="lg:md:hidden">
                                            Games count
                                        </span>
                                        <span>
                                            {item.games_count}
                                        </span>
                                    </td>
                                    <td className="lg:md:w-1/4 max-sm:flex max-sm:flex-row max-sm:justify-between text-start">
                                        <span className="lg:md:hidden">
                                            Earned
                                        </span>
                                        <span>
                                            {item.earned} PAC
                                        </span>
                                    </td>
                                </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default Rating;