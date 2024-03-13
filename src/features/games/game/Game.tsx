"use client"
import { NavLink, useNavigate, useParams } from "react-router-dom"
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
import { ITournaments } from "../../tournaments/Tournaments.type";
import Error from "../../../helpers/Error";
import HistotyTournamentRating from "./HistotyTournamentRating"


const Game = () => {
  let params = useParams()

  const { data, isLoading: GameDataLoading, isSuccess: GameDataSuccess } = useGetGameByIdQuery(params.gameId)
  const [getTournaments, { isLoading: TournamentsDataLoading, isSuccess: TournamentsDataSuccess }] = useGetTournamentsMutation()
  const [tournaments, setTournaments] = useState<ITournamentsActiveAndHistory>()

  useEffect(() => {
    console.log(data?.code);

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
        <div className="flex flex-col lg:md:gap-12 gap-8 justify-between">
          <div className="flex flex-col lg:md:gap-8 gap-4">
            <h1 className="font-orbitron w-fit text-yellow lg:text-8xl md:text-6xl text-4xl font-extrabold">{data?.name}</h1>
            <div className="lg:md:w-2/5 w-full sm:w-4/5 font-semibold lg:md:text-2xl text-base text-white">{data?.short_desc}</div>
            <div>
              <ul className="flex flex-row gap-3">
                {data?.links?.android && <a href={data?.links?.android} target="_blank" className="flex justify-center items-center rounded-lg w-11 h-11 bg-yellow hover:bg-hoverYellow"><img src={android_icon} alt="not found" className=""></img></a>}
                {data?.links?.windows && <a href={data?.links?.windows} target="_blank" className="flex justify-center items-center rounded-lg w-11 h-11 bg-yellow hover:bg-hoverYellow"><img src={win} alt="not found" className=""></img></a>}
                {data?.links?.web && <a href={data?.links?.web} target="_blank" className="flex justify-center items-center rounded-lg w-11 h-11 bg-yellow hover:bg-hoverYellow"><img src={web} alt="not found" className=""></img></a>}
              </ul>
            </div>
          </div>
          <div className="lg:md:mt-12">
            <h2 className="font-orbitron w-fit text-yellow lg:text-8xl md:text-6xl text-4xl mt-2 font-extrabold">Tournaments</h2>
            {TournamentsDataSuccess ? (
              <div className="text-xl font-semibold grid lg:grid-cols-3 gap-4 md:grid-cols-2 grid-cols-1 mt-10">
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
                              Ended {item.createdAt.substring(5, 10).replace('-', '.')}
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
              </div>)
              : (
                <div className="bg-lightGray rounded-[30px] flex flex-col items-center lg:md:mt-10 mt-3 gap-10 px-6 pt-16 pb-12 max-[920px]:pt-8 max-[920px]:pb-6">
                  <div className="flex flex-col items-center gap-5">
                    <div className="font-orbitron text-white text-center text-[28px] leading-[35px] max-[920px]:text-[18px] max-[920px]:leading-[23px]">
                      There have been no tournaments for this game yet, but they will appear soon.
                    </div>
                    <div className="font-chakra text-textGray text-[26px] leading-[34px] text-center max-[920px]:text-[16px] max-[920px]:leading-[21px]">
                      You can participate in other tournaments
                    </div>
                  </div>
                  <NavLink className="black_btn max-w-[475px]" to="/tournaments">
                    All tournaments
                  </NavLink>
                </div>)
            }
          </div>

          <div className="flex flex-col lg:md:gap-10 gap-2">
            <h2 className="font-orbitron w-fit text-yellow lg:text-8xl md:text-6xl text-4xl font-extrabold">Game History</h2>
            {gameHistory ? (
              <div>
                <div>
                  <ul className="px-10 lg:md:grid grid-cols-4 font-orbitron font-bold text-white text-3xl hidden">
                    <li>Title</li>
                    <li>Data</li>
                    <li>Reward</li>
                    <li>Balance</li>
                  </ul>
                </div>
                <ul className="">
                  {gameHistory?.map((item, index) => {
                    return (
                      <li className={`lg:md:px-10 lg:md:py-5 sm:px-6 sm:py-3 p-4 mt-4 w-full gap-2 rounded-2xl font-bold bg-lightGray lg:md:grid lg:md:grid-cols-4 flex flex-col font-orbitron text-white lg:md:text-2xl sm:text-lg text-sm`}>
                        <div className="flex flex-row justify-between items-center">
                          <span className="lg:md:hidden">
                            Title
                          </span>
                          <span>{item.title}</span>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <span className="lg:md:hidden">
                            Data
                          </span>
                          <span>{new Date(item?.createdAt).toDateString()}</span>

                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <span className="lg:md:hidden">
                            Reward
                          </span>
                          {item.isWinner ?
                            <span className="text-green-500">+{item.match_cost} PAC</span>
                            :
                            <span className="text-red-500">-{item.match_cost} PAC</span>
                          }

                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <span className="lg:md:hidden">
                            Balance
                          </span>
                          <span>*** PAC</span>

                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>

            ) : (
              <div className="bg-lightGray rounded-[30px] flex flex-col items-center gap-10 px-6 pt-16 pb-12 max-[920px]:pt-8 max-[920px]:pb-6">
                <div className="flex flex-col items-center gap-5">
                  <div className="font-orbitron text-white text-center text-[28px] leading-[35px] max-[920px]:text-[18px] max-[920px]:leading-[23px]">
                    You haven't played this game yet. Play at least once to see the rating
                  </div>
                  <div className="font-chakra text-textGray text-[26px] leading-[34px] text-center max-[920px]:text-[16px] max-[920px]:leading-[21px]">
                    Start playing
                  </div>
                </div>
                <ul className="flex flex-row justify-center items-center gap-3">

                  {data?.links?.android && <a href={data?.links?.android} target="_blank" className="flex justify-center items-center rounded-lg w-11 h-11 bg-yellow hover:bg-hoverYellow"><img src={android_icon} alt="not found" className=""></img></a>}
                  {data?.links?.windows && <a href={data?.links?.windows} target="_blank" className="flex justify-center items-center rounded-lg w-11 h-11 bg-yellow hover:bg-hoverYellow"><img src={win} alt="not found" className=""></img></a>}
                  {data?.links?.web && <a href={data?.links?.web} target="_blank" className="flex justify-center items-center rounded-lg w-11 h-11 bg-yellow hover:bg-hoverYellow"><img src={web} alt="not found" className=""></img></a>}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div >

    </div>

  )

}

export default Game
