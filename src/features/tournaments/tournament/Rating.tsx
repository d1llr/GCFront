import Loader from "../../../helpers/Loader";
import { useGetRatingQuery } from "./Tournament.slice";
import IRating from '../Tournaments.type'
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
    if (isError) {
        return <Error />
    }
    if (!data) {
        return <Error />
    }

    return (
        <table className="gap-2 flex flex-col w-full h-full" key={'123'}>
            <thead>
                <tr className="text-yellow w-full flex flex-row items-center text-xl text-center" key={'123'}>
                    <th className="w-1/4 text-center">Rating</th>
                    <th className="w-1/4 text-center">Earned</th>
                    <th className="w-1/4 text-center leading-4">Games count</th>
                    <th className="w-1/4 text-center">Login</th>
                </tr>
            </thead>
            <tbody className="gap-1 flex flex-col">
                {
                    isSuccess && data?.map((item: IRating, index: number) => {
                        return tokenService.getUser()?.username == item.username ?
                            <tr className="text-black border-t-2 border-b-2 border-yellow w-full flex flex-row py-1 text-base bg-yellow font-medium" key={index}>
                                <td className="w-1/4 text-center">
                                    #{index + 1}
                                </td>
                                <td className="w-1/4 text-center">
                                    {item.earned} PAC
                                </td>
                                <td className="w-1/4 text-center">
                                    {item.games_count}
                                </td>
                                <td className="w-1/4 text-center">
                                    {item.username}
                                </td>
                            </tr>
                            : <tr className="text-white border-t-2 border-b-2 border-gray w-full flex flex-row py-1 text-base font-medium" key={index}>
                                <td className="w-1/4 text-center">
                                    #{index + 1}
                                </td>
                                <td className="w-1/4 text-center">
                                    {item.earned} PAC
                                </td>
                                <td className="w-1/4 text-center">
                                    {item.games_count}
                                </td>
                                <td className="w-1/4 text-center  ">
                                    {item.username}
                                </td>

                            </tr>
                    })
                }
            </tbody>
        </table>
    );
}

export default Rating;