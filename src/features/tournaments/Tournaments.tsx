import ITournaments from "./Tournaments.type";
import { useGetActiveTournamentsQuery, useGetHistoryTournamentsQuery } from "./Tournaments.slice";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Loader from "../../helpers/Loader";
import Error from "../../helpers/Error";
const Tournaments = () => {
    // const { data, isLoading, isError, error } = useGetActiveTournamentsQuery()
    // const { data: HistoryData } = useGetHistoryTournamentsQuery()

    const data = [{ "image": "/storage/tournaments/octa.svg", "disabled": false, "name": "OCTA Tournament", "description": "3 in row", "map": "3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145,147,149,151,153,155,157,159,161,163,165,167,169,171,173,175,177,179,181,183,185,187,189,191,193,195,197,199,204", "id": "1", "players": "1,9,12,85,75,20,117,29,104", "address": "0x63b3B5a9113D5e3e9cF50c2Ab619d89e8d8D7DA9", "chainID": "800001", "cost": 5, "game": "3inRow", "daysLeft": "7", "dayOfWeekFrom": "wednesday", "dayOfWeekTo": "Thursday", "tournament_key": "90a6ef738380cc48f90e", "goal": "Description", "participants": "9", "bank": "80", "createdAt": "2024-02-29T13:02:00.000Z", "updatedAt": "2024-02-29T13:02:00.000Z" }, { "image": "/storage/tournaments/octa.svg", "disabled": false, "name": "OCTA Tournament", "description": "3 in row", "map": "3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145,147,149,151,153,155,157,159,161,163,165,167,169,171,173,175,177,179,181,183,185,187,189,191,193,195,197,199,204", "id": "2", "players": "12,29,85,153,146,117,20,109", "address": "0x63b3B5a9113D5e3e9cF50c2Ab619d89e8d8D7DA9", "chainID": "800001", "cost": 5, "game": "3inRow", "daysLeft": "7", "dayOfWeekFrom": "friday", "dayOfWeekTo": "sunday", "tournament_key": "43e50bc1b4bf2037095a", "goal": "Description", "participants": "8", "bank": "80", "createdAt": "2024-03-03T15:00:00.000Z", "updatedAt": "2024-03-03T15:00:00.000Z" }];
    const HistoryData = [{ "image": "/storage/tournaments/octa.svg", "disabled": false, "name": "OCTA Tournament", "description": "3 in row", "map": "3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145,147,149,151,153,155,157,159,161,163,165,167,169,171,173,175,177,179,181,183,185,187,189,191,193,195,197,199,204", "id": "1", "players": "1,9,12,85,75,20,117,29,104", "address": "0x63b3B5a9113D5e3e9cF50c2Ab619d89e8d8D7DA9", "chainID": "800001", "cost": 5, "game": "3inRow", "daysLeft": "7", "dayOfWeekFrom": "wednesday", "dayOfWeekTo": "Thursday", "tournament_key": "90a6ef738380cc48f90e", "goal": "Description", "participants": "9", "bank": "80", "createdAt": "2024-02-29T13:02:00.000Z", "updatedAt": "2024-02-29T13:02:00.000Z" }, { "image": "/storage/tournaments/octa.svg", "disabled": false, "name": "OCTA Tournament", "description": "3 in row", "map": "3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145,147,149,151,153,155,157,159,161,163,165,167,169,171,173,175,177,179,181,183,185,187,189,191,193,195,197,199,204", "id": "2", "players": "12,29,85,153,146,117,20,109", "address": "0x63b3B5a9113D5e3e9cF50c2Ab619d89e8d8D7DA9", "chainID": "800001", "cost": 5, "game": "3inRow", "daysLeft": "7", "dayOfWeekFrom": "friday", "dayOfWeekTo": "sunday", "tournament_key": "43e50bc1b4bf2037095a", "goal": "Description", "participants": "8", "bank": "80", "createdAt": "2024-03-03T15:00:00.000Z", "updatedAt": "2024-03-03T15:00:00.000Z" }];

    const navigate = useNavigate();


    // if (isLoading) {
    //     return <Loader />
    // }
    return (
        <div className="background-image-black">
            <div className="wrapper-content">
                <h1 className="font-orbitron w-fit text-yellow text-8xl font-extrabold">Games</h1>

                <div className="grid grid-cols-3 gap-6 mt-10">
                    {data?.map((item: ITournaments, index: number) => {
                        return (
                            <div key={index} className="bg-lightGray p-6 rounded-[20px] flex flex-row gap-2 text-white">



                                <div className="flex flex-col w-full gap-6 justify-center">
                                    <div>
                                        <div className="flex flex-row justify-between items-center gap-2" >
                                            <div className="text-white font-orbitron text-3xl flex flex-col items-start">
                                                <div>{item.name}</div>
                                                <div>{item.id}</div>
                                            </div>
                                            <div className="text-gray">
                                                28.03
                                            </div>
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
                                    <button onClick={() => {
                                        navigate(`/tournaments/${item.id}`);
                                    }} className={`w-full text-black bg-yellow text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30`}
                                        disabled={item.disabled}>
                                        More datailed
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    {HistoryData?.map((item: ITournaments, index: number) => {
                        return (
                            <div key={index} className="border-yellow border-2 p-3 flex flex-row gap-2 text-white opacity-30">
                                <div className="w-2/3">
                                    <img src={import.meta.env.VITE_BACKEND_URL + item.image} alt="Фото игры" width={345} height={345} className="object-cover w-full h-full max-h-80" />
                                </div>
                                <div className="flex flex-col w-full gap-6 justify-center">
                                    <div>
                                        <div className="flex flex-row justify-between items-center gap-2" >
                                            <span className="text-yellow text-3xl">
                                                {item.name} | {item.id}
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
                                    <button onClick={() => {
                                        navigate(`/tournaments/history/${item.id}`);
                                    }} className={`w-full text-black bg-yellow text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30`}
                                        disabled={item.disabled}>
                                        More datailed
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    {(data?.length == 0 && HistoryData?.length == 0) && <Error />}
                </div>

            </div>

        </div>

    );
}

export default Tournaments;



{/* <div>
            <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
                Tournaments
            </h2>
            
        </div> */}

{/* <div className="w-2/3">
    <img src={import.meta.env.VITE_BACKEND_URL + item.image} alt="Фото игры" width={345} height={345} className="object-cover w-full h-full max-h-80" />
</div> */}