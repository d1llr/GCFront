"use client"
import { useNavigate, useParams } from "react-router-dom"
import { useGetGameByIdQuery, useGetUserGameHistoryMutation } from "./Game.slice"
import { Navigation, Pagination, Scrollbar, Controller } from 'swiper/modules';
import browser from "../../../images/icons/browser.svg"
import apple from "../../../images/icons/apple.svg"
import android from "../../../images/icons/android.svg"
import win from "../../../images/icons/win.svg"
import { IoChevronBack } from "react-icons/io5"
import { useEffect, useState } from "react"
import { useRefreshTokenMutation } from "../../user/User.slice"
import tokenService from "../../../services/token.service"
import Loader from "../../../helpers/Loader"
import 'swiper/css';
import { IHistory } from "./Game.type"
import { Swiper, SwiperSlide } from 'swiper/react';

const Game = () => {
  let params = useParams()
  const { data, isLoading, isError, isSuccess, refetch } = useGetGameByIdQuery(
    params.gamesId,
  )
  const navigate = useNavigate()
  const [getUserHistory, { isLoading: HistoryLoading }] = useGetUserGameHistoryMutation()

  const [gameHistory, setGameHistory] = useState<IHistory[]>()

  useEffect(() => {
    getUserHistory({
      id: tokenService.getUser().id,
      game: data?.game.name
    }).unwrap()
      .then((response) => {
        console.log(response);
        setGameHistory(response)
      })

  }, [isError, isSuccess])

  if (isLoading) {
    return <Loader />
  }




  return (
    <div className="flex flex-row gap-20 w-full h-full">
      <div className="text-white flex flex-col gap-5 w-3/4">
        <h2
          onClick={() => {
            navigate(`/games`)
          }}
          className="w-fit decoration-dotted underline text-yellow text-2xl flex flex-row items-center cursor-pointer"
        >
          <IoChevronBack />
          <span>Games</span>
        </h2>
        <div className="flex flex-row gap-6 mt-7">
          <div className="flex flex-row gap-5">
            <div className="">
              <img
                src={"https://back.pacgc.pw" + data?.game.image}
                alt="Фото"
                className="object-cover w-full h-full max-h-80"
              />
            </div>
            <div className="flex flex-col gap-2 h-full justify-between w-1/2">
              <div className="flex flex-col gap-2 text-white">
                <span className="text-yellow text-2xl">{data?.game.name}</span>
                <span className="text-xl">{data?.game.short_desc}</span>
              </div>
              <div className="flex flex-row gap-2 items-center">
                {data?.game.links.android && (
                  <a target="_blank" href={data?.game.links.android}>
                    <img src={android} alt="android" />
                  </a>
                )}
                {data?.game.links.windows && (
                  <a target="_blank" href={data?.game.links.windows}>
                    <img src={win} alt="windows" />
                  </a>
                )}
                {data?.game.links.apple && (
                  <a target="_blank" href={data?.game.links.apple}>
                    <img src={apple} alt="apple" />
                  </a>
                )}
                {data?.game.links.web && (
                  <a target="_blank" href={data?.game.links.web}>
                    <img src={browser} alt="browser" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <span>{data?.game.description}</span>
        </div>
        <div className="p-3">
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, Controller]}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            spaceBetween={30}
            slidesPerView={2}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {data?.screenshots.map((image) => (
              <SwiperSlide>
                <img
                  src={
                    "https://back.pacgc.pw" +
                    "/" +
                    data?.game.scr_dir +
                    "/" +
                    image
                  }
                  alt="Фото"
                  className="object-cover w-full max-h-100"
                />
              </SwiperSlide>
            ))}

          </Swiper>
        </div>
      </div>
      <div className="w-1/4 h-full">
        <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
          Game history
        </h2>
        <div className="flex flex-row gap-6 mt-10 h-full">
          <table className="gap-2 flex flex-col w-full overflow-y-scroll h-4/5">
            <tr className="text-yellow w-full flex flex-row justify-around text-xl">
              <th>Title</th>
              <th>Data</th>
              <th>Reward</th>
            </tr>
            {gameHistory?.map((game: IHistory, index: number) => {
              return (
                <tr key={index} className="text-white border-t-2 border-b-2 border-gray w-full flex flex-row  py-1 text-base md:text-sm">
                  <td className="w-1/3 text-center">{game.title}</td>
                  <td className="w-1/3 text-center">{new Date(game.createdAt).toISOString().substring(0, 10)}</td>
                  <td className="w-1/3 text-center">{game.isWinner ? `+${game.match_cost}` : `-${game.match_cost}`} PAC </td>
                </tr>
              )
            })}
          </table>
        </div>
      </div>
    </div>
  )
}

export default Game
