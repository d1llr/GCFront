import Loader from "../../../helpers/Loader";
import { useGetUserInfoQuery, useGetUserNameMutation } from "../../user/User.slice";
import { ReactNode, useEffect } from "react";
import tokenService from "../../../services/token.service";
import Page404 from "../../../helpers/Page404";
import Error from "../../../helpers/Error";
import { useGetRatingQuery } from "../../tournaments/tournament/Tournament.slice";
import { Spinner } from "flowbite-react";

interface IRat {
    tournament_id: string | undefined,
    typeTR: string
}

const HistotyTournamentRating = (props: IRat) => {
    const { data, isLoading, isSuccess, isError } = useGetRatingQuery({
        tournament_id: props.tournament_id,
        type: props.typeTR
    })

    if (isLoading) {
        return <span className="text-center text-yellow"><Spinner size="lg" light={false} color="warning" aria-label="Warning spinner example" /></span> 
    }
    if (isError) {
        return <Error />
    }
    if (!data) {
        return <Error />
    }

    return (
        <table className="gap-2 flex flex-col w-full h-full font-orbitron" key={'123'}>
            <tbody className="gap-1 flex flex-col">
                {
                    isSuccess && data?.map((item, index: number) => {
                        return index < 3 && (
                            <tr className="flex flex-row justify-between" key={index}>
                                <span className="text-2xl font-bold text-white">
                                    #{index + 1} place
                                </span>
                                <span className="text-[20px] font-bold text-yellow">
                                    {item.username}
                                </span>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}


export default HistotyTournamentRating;