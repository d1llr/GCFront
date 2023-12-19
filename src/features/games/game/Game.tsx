import { useNavigate, useParams } from "react-router-dom";
import { useGetGameByIdQuery } from "./Game.slice";
import { Oval } from "react-loader-spinner";
import browser from '../../../images/icons/browser.svg'
import apple from '../../../images/icons/apple.svg'
import android from '../../../images/icons/android.svg'
import win from '../../../images/icons/win.svg'
import { IoChevronBack } from "react-icons/io5";
import redirectFunc from "../../../helpers/redirect";
import { useEffect } from "react";
import { useRefreshTokenMutation } from "../../user/User.slice";
import tokenService from "../../../services/token.service";
import Loader from "../../../helpers/Loader";

const Game = () => {
    let params = useParams();
    const { data, isLoading, isError, error, refetch } = useGetGameByIdQuery(params.gamesId)
    const navigate = useNavigate();
    const [refreshToken] = useRefreshTokenMutation()
    useEffect(() => {
        refreshToken(tokenService.getLocalRefreshToken())
            .unwrap()
            .then(response => {
                tokenService.updateLocalAccessToken(response.accessToken)
                tokenService.updateLocalRefreshToken(response.refreshToken)
                refetch()
            })
            .catch(err => {
                switch (err.status) {
                    case (422 && 421):
                        navigate('/login')
                        break;
                    case 423:
                        alert(err.message)
                        break;
                }
            })
    }, [isError])

    if (isLoading) {
        return <Loader />
    }
    return (
        <div className="flex flex-row gap-20">
            <div className="text-white flex flex-col gap-5">
                <h2 onClick={() => { navigate(`/games`) }}
                    className="w-fit decoration-dotted underline text-yellow text-2xl flex flex-row items-center cursor-pointer"
                >
                    <IoChevronBack />
                    <span>
                        Games
                    </span>
                </h2>
                <div className="flex flex-row gap-6 mt-7    ">
                    <div className="flex flex-row gap-5">
                        <div className="w-1/2">
                            <img src={import.meta.env.VITE_BACKEND_URL + data?.image} alt="Фото" className="object-cover w-full h-full max-h-80" />
                        </div>
                        <div className="flex flex-col gap-2 h-full justify-between">
                            <div className="flex flex-col gap-2 text-white">
                                <span className="text-yellow text-2xl">
                                    {data?.name}
                                </span>
                                <span className="text-xl">
                                    {data?.description}
                                </span>
                            </div>
                            <div className="flex flex-row gap-2">
                                <img src={android} alt="android" />
                                <img src={win} alt="win" />
                                <img src={apple} alt="apple" />
                                <img src={browser} alt="browser" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <span>
                        {data?.description}
                    </span>
                </div>
                <div className="flex flex-row gap-5">
                    <div className="w-1/2">
                        <img src={import.meta.env.VITE_BACKEND_URL + data?.image} alt="Фото" className="object-cover w-full h-full max-h-80" />
                    </div>
                    <div className="w-1/2">
                        <img src={import.meta.env.VITE_BACKEND_URL + data?.image} alt="Фото" className="object-cover w-full h-full max-h-80" />
                    </div>
                </div>
            </div>
            <div className="w-1/3">
                <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
                    Game history
                </h2>
                <div className="flex flex-row gap-6 mt-10">
                    <table className="gap-2 flex flex-col w-full">
                        <tr className="text-yellow w-full flex flex-row justify-around text-xl">
                            <th>Time</th>
                            <th>Data</th>
                            <th>Reward</th>
                        </tr>
                        {
                            [...Array(20)].map(() => {
                                return <tr className="text-white border-t-2 border-b-2 border-gray w-full flex flex-row justify-around py-1 text-base">
                                    <td>
                                        23:44
                                    </td>
                                    <td>
                                        22.02.2023
                                    </td>
                                    <td>
                                        + 10 $
                                    </td>
                                </tr>
                            })
                        }
                    </table>
                </div>

            </div>
        </div >);
}

export default Game;