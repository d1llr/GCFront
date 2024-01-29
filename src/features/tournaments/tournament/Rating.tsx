import Loader from "../../../helpers/Loader";
import { useGetRatingQuery } from "./Tournament.slice";
import IRating from '../Tournaments.type'
import { useGetUserInfoQuery, useGetUserNameMutation } from "../../user/User.slice";
import { ReactNode, useEffect } from "react";
import tokenService from "../../../services/token.service";

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
        return <div className="text-white">Something went wrong!</div>
    }
    if (!data) {
        return <div className="text-white">Something went wrong!</div>
    }

    return (
        <table className="gap-2 flex flex-col w-full h-full" key={'123'}>
            <thead>
                <tr className="text-yellow w-full flex flex-row justify-around text-xl" key={'123'}>
                    <th >Rating</th>
                    <th>Earned</th>
                    <th >Login</th>
                </tr>
            </thead>
            <tbody className="gap-1 flex flex-col">
                {
                    isSuccess && data?.map((item: IRating, index: number) => {
                        return tokenService.getUser()?.username == item.username ?
                            <tr className="text-black border-t-2 border-b-2 border-yellow w-full flex flex-row py-1 text-base bg-yellow font-medium" key={index}>
                                <td className="w-1/3 text-center">
                                    #{index + 1}
                                </td>
                                <td className="w-1/3 text-center">
                                    {item.earned} PAC
                                </td>
                                <td className="w-1/3 text-center">
                                    {item.username}
                                </td>
                            </tr>
                            : <tr className="text-white border-t-2 border-b-2 border-gray w-full flex flex-row py-1 text-base font-medium" key={index}>
                                <td className="w-1/3 text-center">
                                    #{index + 1}
                                </td>
                                <td className="w-1/3 text-center">
                                    {item.earned} PAC
                                </td>
                                <td className="w-1/3 text-center  ">
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