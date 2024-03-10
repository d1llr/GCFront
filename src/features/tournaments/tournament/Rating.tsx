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

    return data && (
        <div className="flex flex-col gap-10 font-orbitron ">
            <h2 className="w-fit text-yellow text-8xl font-extrabold">Players Rating</h2>
            <table className="gap-2 flex flex-col w-full h-full" key={'123'}>
                <thead>
                    <tr className="text-white w-full flex flex-row items-center text-4xl text-center p-5 font-bold" key={'123'}>
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
                                <tr className="text-black bg-yellow w-full flex flex-row p-5 text-2xl font-medium rounded-2xl" key={index}>
                                    <td className="w-1/4 text-start">
                                        #{index + 1}
                                    </td>
                                    <td className="w-1/4 text-start">
                                        {item.username}
                                    </td>
                                    <td className="w-1/4 text-start">
                                        {item.games_count}
                                    </td>
                                    <td className="w-1/4 text-start">
                                        {item.earned} PAC
                                    </td>
                                </tr>
                                : <tr className="text-white bg-lightGray w-full flex flex-row p-5 text-2xl font-medium rounded-2xl" key={index}>
                                    <td className="w-1/4 text-start">
                                        #{index + 1}
                                    </td>
                                    <td className="w-1/4 text-start">
                                        {item.username}
                                    </td>
                                    <td className="w-1/4 text-start">
                                        {item.games_count}
                                    </td>
                                    <td className="w-1/4 text-start">
                                        {item.earned} PAC
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