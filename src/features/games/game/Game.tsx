"use client"
import { useNavigate, useParams } from "react-router-dom"
import { useGetGameByIdQuery, useGetUserGameHistoryMutation } from "./Game.slice"
import { Navigation, Pagination, Scrollbar, Controller } from 'swiper/modules';
import web from "../../../images/icons/web_icon.svg"
import apple from "../../../images/icons/apple.svg"
import android_icon from "../../../images/icons/android_icon.svg"
import win from "../../../images/icons/windows_icon.svg"
import { IoChevronBack } from "react-icons/io5"
import { useEffect, useState } from "react"
import { useRefreshTokenMutation } from "../../user/User.slice"
import tokenService from "../../../services/token.service"
import Loader from "../../../helpers/Loader"
import 'swiper/css';
import IHistory from "./Game.type"
import { Swiper, SwiperSlide } from 'swiper/react';
import ITournaments from "../../tournaments/Tournaments.type";
import Error from "../../../helpers/Error";


const Game = () => {
  let params = useParams()
  // const { data, isLoading, isError, isSuccess, refetch } = useGetGameByIdQuery(
  //   params.gamesId,
  // )
  const navigate = useNavigate()
  const [getUserHistory, { isLoading: HistoryLoading, }] = useGetUserGameHistoryMutation()

  const [gameHistory, setGameHistory] = useState<IHistory[]>()
  const [historyError, setHistoryError] = useState<boolean>(false)
  const data = [{ "image": "/storage/tournaments/octa.svg", "disabled": false, "name": "OCTA Tournament", "description": "The goal of the tournament is to score more points than other players", "map": "3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145,147,149,151,153,155,157,159,161,163,165,167,169,171,173,175,177,179,181,183,185,187,189,191,193,195,197,199,204", "id": "1", "players": "1,9,12,85,75,20,117,29,104", "address": "0x63b3B5a9113D5e3e9cF50c2Ab619d89e8d8D7DA9", "chainID": "800001", "cost": 5, "game": "3inRow", "daysLeft": "7", "dayOfWeekFrom": "wednesday", "dayOfWeekTo": "Thursday", "tournament_key": "90a6ef738380cc48f90e", "goal": "Description", "participants": "9", "bank": "80", "createdAt": "2024-02-29T13:02:00.000Z", "updatedAt": "2024-02-29T13:02:00.000Z" }, { "image": "/storage/tournaments/octa.svg", "disabled": false, "name": "OCTA Tournament", "description": "The goal of the tournament is to score more points than other players", "map": "3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145,147,149,151,153,155,157,159,161,163,165,167,169,171,173,175,177,179,181,183,185,187,189,191,193,195,197,199,204", "id": "2", "players": "12,29,85,153,146,117,20,109", "address": "0x63b3B5a9113D5e3e9cF50c2Ab619d89e8d8D7DA9", "chainID": "800001", "cost": 5, "game": "3inRow", "daysLeft": "7", "dayOfWeekFrom": "friday", "dayOfWeekTo": "sunday", "tournament_key": "43e50bc1b4bf2037095a", "goal": "Description", "participants": "8", "bank": "80", "createdAt": "2024-03-03T15:00:00.000Z", "updatedAt": "2024-03-03T15:00:00.000Z" }];
  const HistoryData = [{ "image": "/storage/tournaments/octa.svg", "disabled": false, "name": "OCTA Tournament", "description": "3 in row", "map": "3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145,147,149,151,153,155,157,159,161,163,165,167,169,171,173,175,177,179,181,183,185,187,189,191,193,195,197,199,204", "id": "1", "players": "1,9,12,85,75,20,117,29,104", "address": "0x63b3B5a9113D5e3e9cF50c2Ab619d89e8d8D7DA9", "chainID": "800001", "cost": 5, "game": "3inRow", "daysLeft": "7", "dayOfWeekFrom": "wednesday", "dayOfWeekTo": "Thursday", "tournament_key": "90a6ef738380cc48f90e", "goal": "Description", "participants": "9", "bank": "80", "createdAt": "2024-02-29T13:02:00.000Z", "updatedAt": "2024-02-29T13:02:00.000Z" }, { "image": "/storage/tournaments/octa.svg", "disabled": false, "name": "OCTA Tournament", "description": "3 in row", "map": "3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145,147,149,151,153,155,157,159,161,163,165,167,169,171,173,175,177,179,181,183,185,187,189,191,193,195,197,199,204", "id": "2", "players": "12,29,85,153,146,117,20,109", "address": "0x63b3B5a9113D5e3e9cF50c2Ab619d89e8d8D7DA9", "chainID": "800001", "cost": 5, "game": "3inRow", "daysLeft": "7", "dayOfWeekFrom": "friday", "dayOfWeekTo": "sunday", "tournament_key": "43e50bc1b4bf2037095a", "goal": "Description", "participants": "8", "bank": "80", "createdAt": "2024-03-03T15:00:00.000Z", "updatedAt": "2024-03-03T15:00:00.000Z" }, { "image": "/storage/tournaments/octa.svg", "disabled": false, "name": "OCTA Tournament", "description": "3 in row", "map": "3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145,147,149,151,153,155,157,159,161,163,165,167,169,171,173,175,177,179,181,183,185,187,189,191,193,195,197,199,204", "id": "2", "players": "12,29,85,153,146,117,20,109", "address": "0x63b3B5a9113D5e3e9cF50c2Ab619d89e8d8D7DA9", "chainID": "800001", "cost": 5, "game": "3inRow", "daysLeft": "7", "dayOfWeekFrom": "friday", "dayOfWeekTo": "sunday", "tournament_key": "43e50bc1b4bf2037095a", "goal": "Description", "participants": "8", "bank": "80", "createdAt": "2024-03-03T15:00:00.000Z", "updatedAt": "2024-03-03T15:00:00.000Z" }, { "image": "/storage/tournaments/octa.svg", "disabled": false, "name": "OCTA Tournament", "description": "3 in row", "map": "3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145,147,149,151,153,155,157,159,161,163,165,167,169,171,173,175,177,179,181,183,185,187,189,191,193,195,197,199,204", "id": "2", "players": "12,29,85,153,146,117,20,109", "address": "0x63b3B5a9113D5e3e9cF50c2Ab619d89e8d8D7DA9", "chainID": "800001", "cost": 5, "game": "3inRow", "daysLeft": "7", "dayOfWeekFrom": "friday", "dayOfWeekTo": "sunday", "tournament_key": "43e50bc1b4bf2037095a", "goal": "Description", "participants": "8", "bank": "80", "createdAt": "2024-03-03T15:00:00.000Z", "updatedAt": "2024-03-03T15:00:00.000Z" }];
  type penis = {
    title:string;
    data:string;
    reward:number;
    balance:number
  }
  const previousdata:penis[] = [{
    title: "initial match",
    data: "28.02.2024",
    reward: +10,
    balance: 100,
  },
  {
    title: "initial match",
    data: "28.02.2024",
    reward: -10,
    balance: 100000,
  },
  {
    title: "initial match",
    data: "28.02.2024",
    reward: +10,
    balance: 100000,
  },
  {
    title: "initial match",
    data: "28.02.2024",
    reward: +10,
    balance: 100000,
  },
  {
    title: "initial match",
    data: "28.02.2024",
    reward: -10,
    balance: 100000,
  },
  {
    title: "initial match",
    data: "28.02.2024",
    reward: +10,
    balance: 100000,
  },
  {
    title: "initial match",
    data: "28.02.2024",
    reward: -10,
    balance: 100000,
  }]
  // useEffect(() => {
  //   getUserHistory({
  //     id: tokenService.getUser().id,
  //     game: data?.game.code
  //   }).unwrap()
  //     .then((response) => {
  //       console.log(response);
  //       if (response.length == 0) {
  //         console.log('errr');

  //         setHistoryError(true)
  //       }
  //       else {
  //         setGameHistory(response)
  //       }
  //     })

  // }, [isError, isSuccess])



  return (
    <div className="wrapper-content">
      <h1 className="font-orbitron w-fit text-yellow text-8xl font-extrabold">PAC Shoot</h1>
      <div className="w-2/5 font-semibold text-2xl text-white">Packshot is a dynamic multiplayer first-person shooter with various game modes. Immerse yourself in the exciting world of PAC Shoot, where your every move and victory can help you get rewarded!</div>
      <div>
        <ul className="flex flex-row gap-6 " >
          <li className="flex justify-center items-center rounded-xl w-11 h-11 bg-yellow"><img src={android_icon} alt="not found" className=""></img></li>
          <li className="flex justify-center items-center rounded-xl w-11 h-11 bg-yellow"><img src={win} alt="not found" className=""></img></li>
          <li className="flex justify-center items-center rounded-xl w-11 h-11 bg-yellow"><img src={web} alt="not found" className=""></img></li>
        </ul>
      </div>
      <h2 className="font-orbitron w-fit text-yellow text-8xl font-extrabold">Tournaments</h2>
      <div className="text-xl font-semibold grid grid-cols-3 gap-6 mt-10">
        {data?.map((item: ITournaments, index: number) => {
          return (
            <div key={index} className="bg-lightGray p-6 rounded-[20px] flex flex-row gap-2 text-white">



              <div className="flex flex-col w-full gap-6 justify-center">
                <div>
                  <div className="flex flex-row justify-between  gap-2" >
                    <div className="text-white font-orbitron text-3xl flex flex-col items-start">
                      <div className="text-2xl font-bold">{item.name}</div>
                      <div className="pb-6">{item.id}</div>
                    </div>
                    <div className="p-2 text-xl font-bold flex flex-col juistify-center text-center items-center rounded-3xl text-white w-36 h-10 bg-[#007E3D]">
                      28.03
                    </div>
                  </div>
                  <span className="pt-4 font-medium text-white text-2xl break-normal ">
                    {item.description}
                  </span>

                </div>
                <div>
                  <ul>
                    <li className="flex flex-row justify-between">
                      <span className=" font-bold font-orbitron text-2xl">
                        Game
                      </span>
                      <span className="font-orbitron font-bold ">
                        {item.game}
                      </span>
                    </li>
                    <li className="flex flex-row justify-between">
                      <span className=" font-bold font-orbitron text-2xl">
                        Duration
                      </span>
                      <span className="font-orbitron font-bold ">
                        7 days
                      </span>
                    </li>
                    <li className="flex flex-row justify-between">
                      <span className=" font-bold font-orbitron text-2xl">
                        Cost
                      </span>
                      <span className="font-orbitron font-bold ">
                        {item.bank}
                      </span>
                    </li>
                  </ul>
                </div>
                <button onClick={() => {
                  navigate(`/tournaments/${item.id}`);
                }} className={`font-orbitron w-full text-yellow rounded-3xl bg-[#0D0D0D] text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30`}
                  disabled={item.disabled}>
                  More datailed
                </button>
              </div>
            </div>
          )
        })}
        {HistoryData?.map((item: ITournaments, index: number) => {
          return (
            <div key={index} className="bg-lightGray p-6 rounded-[20px] flex flex-row gap-2 text-white">
              <div className="flex flex-col w-full gap-6 ">
                <div>
                  <div className="flex flex-row justify-between items-center gap-2" >
                    <span className="font-orbitron text-2xl font-bold">
                      {item.name} | {item.id}
                    </span>
                    <span className="p-2 text-xl font-bold flex flex-col juistify-center text-center items-center rounded-3xl text-white w-36 h-10 bg-[#898989]">
                      {item.daysLeft} days
                    </span>
                  </div>


                </div>
                <div className="pb-7">
                  <ul className="pt-4 font-orbitron">
                    <li className="flex flex-row justify-between"><div className="text-white text-2xl">Game</div>
                      <span className="text-white  break-normal text-2xl">
                        {item.description}
                      </span></li>
                    <li className="pt-10 flex flex-row justify-between">
                      <span className=" text-2xl">
                        #1 place
                      </span>
                      <span>
                        {item.goal}
                      </span>
                    </li>
                    <li className="flex flex-row justify-between">
                      <span className=" text-2xl">
                        #2 place
                      </span>
                      <span>
                        {item.participants}
                      </span>
                    </li>
                    <li className="flex flex-row justify-between">
                      <span className=" text-2xl">
                        #3 place
                      </span>
                      <span>
                        {item.bank}
                      </span>
                    </li>
                  </ul>
                </div>
                <button onClick={() => {
                  navigate(`/tournaments/history/${item.id}`);
                }} className={`font-orbitron w-full text-yellow rounded-3xl bg-[#0D0D0D] text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30`}
                  disabled={item.disabled}>
                  More datailed
                </button>
              </div>
            </div>
          )
        })}
        {(data?.length == 0 && HistoryData?.length == 0) && <Error />}
      </div>
      <h2 className="font-orbitron w-fit text-yellow text-8xl font-extrabold">Game History</h2>
      <div>
        <div>
          <ul className="px-10 grid grid-cols-4 font-orbitron font-bold text-white text-3xl">
            <li>Title</li>
            <li>Data</li>
            <li>Reward</li>
            <li>Balance</li>
          </ul>
        </div>
        <ul className="">
          {previousdata?.map((item, index) => {
            return (
              <li className={`px-10 py-5 mt-4 w-full gap-2 rounded-2xl font-bold bg-lightGray grid grid-cols-4 font-orbitron text-white text-2xl`}>
                <span>{item.title}</span>
                <span>{item.data}</span>
                {item.reward > 0 ? 
                <span className="text-green-500">+{item.reward} PAC</span>
                :
                <span className="text-red-500">{item.reward} PAC</span>
              }
                <span>{item.balance} PAC</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div >

  )

}

export default Game
