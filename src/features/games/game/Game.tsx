"use client"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { useGetGameByIdQuery, useGetTournamentsMutation, useGetUserGameHistoryMutation, useGetUserGamesCountMutation } from "./Game.slice"
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
  const [pagination, setPagination] = useState<number>(0)
  const GetNumberContainer = (props: { fill?: string, value: number }) => {
    return <div className={`flex items-center justify-center border-2 cursor-pointer rounded-xl hover:border-yellow h-12 w-12  ${pagination == props.value ? ' border-yellow bg-yellow text-black hover:text-black ' : `border-lightGray text-lightGray hover:text-yellow`}`} onClick={() => setPagination(props.value)}>
      {props.value + 1}
    </div >
  }
  const Left = (props: { fill: string }) => {
    return <div className="flex items-center justify-center border-2 border-white rounded-xl h-12 w-12" onClick={() => setPagination((prev) => prev--)}>
      <svg width="11" height="18" viewBox="0 0 11 18" className="-ml-1" fill={props.fill} xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_768_1563)">
          <path d="M11 2.02616V0.190375C11 0.0312577 10.8221 -0.056613 10.7019 0.0407571L0.284276 8.40272C0.195764 8.47346 0.124143 8.56404 0.0748767 8.66755C0.0256103 8.77106 0 8.88477 0 9C0 9.11523 0.0256103 9.22894 0.0748767 9.33245C0.124143 9.43596 0.195764 9.52654 0.284276 9.59728L10.7019 17.9592C10.8244 18.0566 11 17.9687 11 17.8096V15.9738C11 15.8575 10.9468 15.7459 10.859 15.6746L2.53973 9.00119L10.859 2.32539C10.9468 2.25415 11 2.14253 11 2.02616Z" />
        </g>
        <defs>
          <clipPath id="clip0_768_1563">
            <rect width="11" height="18" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div >
  }

  const Right = (props: { fill: string }) => {
    return <div className="flex items-center justify-center border-2 border-white rounded-xl h-12 w-12" onClick={() => setPagination((prev) => prev++)}>
      <svg width="11" height="18" viewBox="0 0 11 18" className="-mr-1" fill={props.fill} xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_768_1555)">
          <path d="M10.7157 8.4015L0.298109 0.0405534C0.270888 0.0185318 0.238173 0.00484645 0.203724 0.0010687C0.169274 -0.00270905 0.134486 0.00357408 0.103355 0.0191967C0.0722236 0.0348192 0.0460123 0.0591476 0.0277305 0.0893877C0.00944857 0.119628 -0.000162254 0.154553 2.07249e-06 0.190153V2.02571C2.07249e-06 2.14207 0.0531531 2.25368 0.140968 2.32491L8.46024 8.9999L0.140968 15.6749C0.0508422 15.7461 2.07249e-06 15.8577 2.07249e-06 15.9741V17.8096C2.07249e-06 17.9687 0.177942 18.0566 0.298109 17.9592L10.7157 9.5983C10.8042 9.52733 10.8759 9.43654 10.9251 9.33285C10.9744 9.22916 11 9.11529 11 8.9999C11 8.88451 10.9744 8.77064 10.9251 8.66695C10.8759 8.56326 10.8042 8.47247 10.7157 8.4015Z" />
        </g>
        <defs>
          <clipPath id="clip0_768_1555">
            <rect width="11" height="18" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  }

  let params = useParams()
  const { data, isLoading: GameDataLoading, isSuccess: GameDataSuccess } = useGetGameByIdQuery(params.gameId)
  const [getTournaments, { isLoading: TournamentsDataLoading, isSuccess: TournamentsDataSuccess }] = useGetTournamentsMutation()
  const [getUserGamesCount, { isLoading: getUserGameCountLoading, isSuccess: getUserGameCountSuccess }] = useGetUserGamesCountMutation()

  const [getUserHistory, { isLoading: HistoryLoading, reset }] = useGetUserGameHistoryMutation()
  const navigate = useNavigate()

  const [gameHistory, setGameHistory] = useState<IHistory[]>()
  const [historyError, setHistoryError] = useState<boolean>(false)
  const limit = 5
  const [tournaments, setTournaments] = useState<ITournamentsActiveAndHistory>()
  const [pagesCount, setPagesCount] = useState<number>()

  useEffect(() => {
    if (data)
      getUserGamesCount({
        id: tokenService.getUser().id,
        game: data?.code,
      }).unwrap()
        .then((response) => {
          console.log(response);
          setPagesCount(response)
        })
        .catch(err => {
          setHistoryError(true)
        })

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


  useEffect(() => {
    reset()
    console.log(pagination);

    getUserHistory({
      id: tokenService.getUser().id,
      game: data?.code,
      offset: pagination * limit,
      limit: limit
    })
      .unwrap()
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
        console.log(err);

        setHistoryError(true)
      })
  }, [pagination])

  useEffect(() => {
    if (GameDataSuccess)
      getUserHistory({
        id: tokenService.getUser().id,
        game: data?.code,
        offset: pagination * limit,
        limit: limit
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


  if (GameDataLoading) {
    return <Loader />
  }


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
            <h2 className="font-orbitron w-fit text-yellow lg:text-8xl md:text-6xl text-4xl mt-2 font-extrabold mb-8">Tournaments</h2>
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
            <h2 className="font-orbitron w-fit text-yellow lg:text-8xl md:text-6xl text-4xl font-extrabold mb-2">Game History</h2>
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
                <ul className="lg:h-[450px]">
                  {
                    HistoryLoading ? <Loader />
                      :
                      gameHistory?.map((item, index) => {
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
                <div className="flex flex-row justify-center items-center gap-2 mt-5">
                  {/* <Left fill={'#FFF'} /> */}
                  {pagesCount && ([...new Array(Math.ceil(pagesCount / 5))].map((page, index: number) => {
                    return <GetNumberContainer value={index} />
                  }))
                  }

                  {/* <Right fill={'#FFF'} /> */}
                </div>
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
