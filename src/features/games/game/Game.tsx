"use client"
import { useNavigate, useParams } from "react-router-dom"
import { useGetGameByIdQuery } from "./Game.slice"
import { Oval } from "react-loader-spinner"
import browser from "../../../images/icons/browser.svg"
import apple from "../../../images/icons/apple.svg"
import android from "../../../images/icons/android.svg"
import win from "../../../images/icons/win.svg"
import { IoChevronBack } from "react-icons/io5"
import redirectFunc from "../../../helpers/redirect"
import { useEffect } from "react"
import { useRefreshTokenMutation } from "../../user/User.slice"
import tokenService from "../../../services/token.service"
import Loader from "../../../helpers/Loader"
import { Carousel } from "flowbite-react"

const Game = () => {
  let params = useParams()
  const { data, isLoading, isError, error, refetch } = useGetGameByIdQuery(
    params.gamesId,
  )
  const navigate = useNavigate()
  const [refreshToken] = useRefreshTokenMutation()
  useEffect(() => {
    refreshToken(tokenService.getLocalRefreshToken())
      .unwrap()
      .then((response) => {
        tokenService.updateLocalAccessToken(response.accessToken)
        tokenService.updateLocalRefreshToken(response.refreshToken)
        refetch()
      })
      .catch((err) => {
        switch (err.status) {
          case 422 && 421:
            navigate("/login")
            break
          case 423:
            alert(err.message)
            break
        }
      })
  }, [isError])

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
        <div className="h-76 sm:h-64 xl:h-80 2xl:h-96 2xl:w-1/2 md:w-3/4">
          <Carousel indicators={false}>
            {data?.screenshots.map((image) => (
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
            ))}
          </Carousel>
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
            {[...Array(40)].map((i: number, index: number) => {
              return (
                <tr className="text-white border-t-2 border-b-2 border-gray w-full flex flex-row justify-around py-1 text-base md:text-sm">
                  <td>{index} level completed</td>
                  <td>23:44 22.02.2023</td>
                  <td>+ 10 PAC</td>
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
