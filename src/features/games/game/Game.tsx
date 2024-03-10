"use client"
import { useNavigate, useParams } from "react-router-dom"
import { useGetGameByIdQuery, useGetTournamentsMutation, useGetUserGameHistoryMutation } from "./Game.slice"
import web from "../../../images/icons/web_icon.svg"
import android_icon from "../../../images/icons/android_icon.svg"
import win from "../../../images/icons/windows_icon.svg"
import { IoChevronBack } from "react-icons/io5"
import { useEffect, useState } from "react"
import { useRefreshTokenMutation } from "../../user/User.slice"
import tokenService from "../../../services/token.service"
import Loader from "../../../helpers/Loader"
import 'swiper/css';
import { IHistory, ITournamentsActiveAndHistory } from "./Game.type"
import { Swiper, SwiperSlide } from 'swiper/react';
import ITournaments from "../../tournaments/Tournaments.type";
import Error from "../../../helpers/Error";
import HistotyTournamentRating from "./HistotyTournamentRating"


const Game = () => {
  let params = useParams()

  const { data, isLoading: GameDataLoading, isSuccess: GameDataSuccess } = useGetGameByIdQuery(params.gameId)
  const [getTournaments, { isLoading: TournamentsDataLoading, isSuccess: TournamentsDataSuccess }] = useGetTournamentsMutation()
  const [tournaments, setTournaments] = useState<ITournamentsActiveAndHistory>()

  useEffect(() => {
    if (GameDataSuccess)
      getTournaments(data?.code)
        .unwrap()
        .then((responce: ITournamentsActiveAndHistory) => {
          console.log(responce);
          setTournaments(responce)
        })
        .catch(err => {
          console.log(err);
        })
  }, [GameDataSuccess])

  const navigate = useNavigate()
  const [getUserHistory, { isLoading: HistoryLoading, }] = useGetUserGameHistoryMutation()

  const [gameHistory, setGameHistory] = useState<IHistory[]>()
  const [historyError, setHistoryError] = useState<boolean>(false)
  type penis = {
    title: string;
    data: string;
    reward: number;
    balance: number
  }
  const previousdata: penis[] = [{
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
  useEffect(() => {
    if (GameDataSuccess)
      getUserHistory({
        id: tokenService.getUser().id,
        game: data?.code
      }).unwrap()
        .then((response) => {
          console.log(response);
          if (response.length == 0) {
            console.log('errr');
            setHistoryError(true)
          }
          else {
            setGameHistory(response)
          }
        })
        .catch(err => {
          setHistoryError(true)
        })

  }, [GameDataSuccess])



  return (
    <div className="background-image-yellow">
      <div className="wrapper-content">
        <div className="flex flex-col gap-12 justify-between">
          <div className="flex flex-col gap-8">
            <h1 className="font-orbitron w-fit text-yellow text-8xl font-extrabold">{data?.name}</h1>
            <div className="w-2/5 font-semibold text-2xl text-white">{data?.short_desc}</div>
            <div>
              <ul className="flex flex-row gap-3">
                {data?.links?.android && <li className="flex justify-center items-center rounded-lg w-11 h-11 bg-yellow"><img src={android_icon} alt="not found" className=""></img></li>}
                {data?.links?.windows && <li className="flex justify-center items-center rounded-lg w-11 h-11 bg-yellow"><img src={win} alt="not found" className=""></img></li>}
                {data?.links?.web && <li className="flex justify-center items-center rounded-lg w-11 h-11 bg-yellow"><img src={web} alt="not found" className=""></img></li>}
              </ul>
            </div>
          </div>
          {TournamentsDataSuccess &&
            <div className="mt-12">
              <h2 className="font-orbitron w-fit text-yellow text-8xl mt-2 font-extrabold">Tournaments</h2>
              <div className="text-xl font-semibold grid grid-cols-3 gap-6 mt-10">
                {tournaments?.active.map((item, index: number) => {
                  return (
                    <div key={index} className="bg-lightGray p-6 rounded-[20px] flex flex-row gap-2 text-white w-full">
                      <div className="flex flex-col w-full gap-6 justify-between">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-row justify-between items-base  gap-2" >
                            <div className="text-white font-orbitron text-3xl flex flex-col items-start w-2/3">
                              <div className="text-2xl font-bold">{item.name}</div>
                            </div>
                            <span className="p-2 text-base font-bold flex flex-col juistify-center text-center items-center rounded-3xl text-white w-36 h-10 bg-[#007E3D]">
                              active
                            </span>
                          </div>
                          <span className="pt-4 font-medium text-white text-2xl break-normal ">
                            {item.goal}
                          </span>

                        </div>
                        <div>
                          <ul>
                            <li className="flex flex-row justify-between">
                              <span className=" font-bold font-orbitron text-2xl">
                                Game
                              </span>
                              <span className="font-orbitron font-bold ">
                                {data?.name}
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
                                {item.cost}
                              </span>
                            </li>
                          </ul>
                        </div>
                        <button onClick={() => {
                          navigate(`/tournaments/${item.id}`);
                        }} className={`font-orbitron w-full text-yellow rounded-3xl bg-[#0D0D0D] text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30`}>
                          More datailed
                        </button>
                      </div>
                    </div>
                  )
                })}
                {tournaments?.history.map((item, index: number) => {
                  return (
                    <div key={index} className="bg-lightGray p-6 rounded-[20px] flex flex-row gap-2 text-white">
                      <div className="flex flex-col w-full gap-8 justify-between">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row justify-between items-base gap-2 " >
                            <span className="font-orbitron text-2xl font-bold w-2/3">
                              {item.name} | {item.id}
                            </span>
                            <span className="p-2 text-base font-bold flex flex-col juistify-center text-center items-center rounded-3xl text-white w-1/3 h-10 bg-[#898989]">
                              Completed {item.createdAt.substring(5, 10).replace('-', '.')}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-row justify-between items-center text-2xl font-orbitron">
                          <span>
                            Game
                          </span>
                          <span>
                            {data?.name}
                          </span>
                        </div>
                        <HistotyTournamentRating tournament_id={item.id} typeTR="history" />
                        <button onClick={() => {
                          navigate(`/tournaments/history/${item.id}`);
                        }} className={`font-orbitron w-full text-yellow rounded-3xl bg-[#0D0D0D] text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30`}>
                          More datailed
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>}
          {
            gameHistory &&
            <div className="flex flex-col gap-10">
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
                  {gameHistory?.map((item, index) => {
                    return (
                      <li className={`px-10 py-5 mt-4 w-full gap-2 rounded-2xl font-bold bg-lightGray grid grid-cols-4 font-orbitron text-white text-2xl`}>
                        <span>{item.title}</span>
                        <span>{item.createdAt}</span>
                        {item.isWinner ?
                          <span className="text-green-500">+{item.match_cost} PAC</span>
                          :
                          <span className="text-red-500">{item.match_cost} PAC</span>
                        }
                        <span>*** PAC</span>
                      </li>
                    )
                  })}
                </ul>
              </div>

            </div>}
        </div>
      </div >

    </div>

  )

}

export default Game
