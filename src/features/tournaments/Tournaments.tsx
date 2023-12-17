import ITournaments from "./Tournaments.type";
import { useGetTournamentsQuery } from "./Tournaments.slice";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
const Tournaments = () => {
    const { data, isLoading, isError, error } = useGetTournamentsQuery()
    const navigate = useNavigate();

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
        <div>
            <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
                Tournaments
            </h2>
            <div className="grid grid-cols-2 gap-6 mt-10">
                {data?.map((item: ITournaments, index: number) => {
                    return (
                        <div key={index} className="border-yellow border-2 p-3 flex flex-row gap-2 text-white">
                            <div className="w-2/3">
                                <img src={import.meta.env.VITE_BACKEND_URL + item.image} alt="Фото игры" width={345} height={345} className="object-cover w-full h-full max-h-80" />
                            </div>
                            <div className="flex flex-col w-full gap-6 justify-center">
                                <div>
                                    <div className="flex flex-row justify-between items-center gap-2" >
                                        <span className="text-yellow text-3xl">
                                            {item.name}
                                        </span>
                                        <span className="text-gray">
                                            {item.daysLeft} days
                                        </span>
                                    </div>
                                    <span className="text-white text-base break-normal">
                                        {item.description}
                                    </span>

                                </div>
                                <div>
                                    <ul>
                                        <li className="flex flex-row justify-between">
                                            <span className="text-yellow text-2xl">
                                                Goal
                                            </span>
                                            <span>
                                                {item.goal}
                                            </span>
                                        </li>
                                        <li className="flex flex-row justify-between">
                                            <span className="text-yellow text-2xl">
                                                Participants
                                            </span>
                                            <span>
                                                {item.participants}
                                            </span>
                                        </li>
                                        <li className="flex flex-row justify-between">
                                            <span className="text-yellow text-2xl">
                                                Bank
                                            </span>
                                            <span>
                                                {item.bank}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <a onClick={() => {
                                    navigate(`/tournaments/${item.id}`);
                                }} className="w-full text-black bg-yellow text-xl font-bold p-3 text-center cursor-pointer">
                                    More datailed
                                </a>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    );
}

export default Tournaments;