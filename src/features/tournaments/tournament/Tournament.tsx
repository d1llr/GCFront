import { useNavigate, useParams } from "react-router-dom";
import { useGetTournamentByIdQuery } from "./Tournament.slice";
import { Oval } from "react-loader-spinner";
import browser from '../../../images/icons/browser.svg'
import apple from '../../../images/icons/apple.svg'
import android from '../../../images/icons/android.svg'
import win from '../../../images/icons/win.svg'
import { IoChevronBack } from "react-icons/io5";
const Tournament = () => {
    let params = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useGetTournamentByIdQuery(params.tournamentId)
    console.log(data);

    if (isLoading) {
        return <Oval
            height={80}
            width={80}
            color="#FFF100"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}

        />
    }
    return (
        <div className="flex flex-row gap-20">
            <div className="text-white flex flex-col gap-5 w-3/4">
                <h2 onClick={() => { navigate(`/tournaments`) }}
                    className="w-fit decoration-dotted underline text-yellow text-2xl flex flex-row items-center cursor-pointer"
                >
                    <IoChevronBack />
                    <span>
                        Tournaments
                    </span>
                </h2>
                <div className="flex flex-row gap-6 mt-7 w-2/3">
                    <div className="flex flex-row gap-5">
                        <div className="w-1/2">
                            <img src={import.meta.env.VITE_BACKEND_URL + data?.image} alt="Фото" className="object-cover w-full" />
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
                            <button className="w-full text-black bg-yellow text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30 " disabled>
                                Participate in the tournament for 50 PAC
                            </button>
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
                <div className="bg-black/10 backdrop-blur-md z-10 w-full h-full absolute rounded-3xl">

                </div>
                <h2 className="w-fit decoration-dotted underline text-yellow text-2xl z-0 pointer-events-none select-none p-2">
                    Player rating
                </h2>
                <div className="flex flex-row gap-6 mt-10 z-0 h-full pointer-events-none select-none">
                    <table className="gap-2 flex flex-col w-full h-full">
                        <tr className="text-yellow w-full flex flex-row justify-around text-xl">
                            <th>Rating</th>
                            <th>Earned</th>
                            <th>Login</th>
                        </tr>
                        {
                            [...Array(8)].map((index: number) => {
                                return <tr className="text-white border-t-2 border-b-2 border-gray w-full flex flex-row justify-around py-1 text-base">
                                    <td>
                                        #{index}
                                    </td>
                                    <td>
                                        1 110 PAC
                                    </td>
                                    <td>
                                        SAVA
                                    </td>
                                </tr>
                            })
                        }
                    </table>
                </div>

            </div>
        </div>);
}

export default Tournament;