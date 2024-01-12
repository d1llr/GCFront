import { useNavigate } from "react-router-dom"
import IGames from "./Games.type"
import { useGetAllGamesQuery } from "./Games.slice"
import { useEffect } from "react"
import { useRefreshTokenMutation } from "../user/User.slice"
import tokenService from "../../services/token.service"
import Loader from "../../helpers/Loader"

var t = true
const Games = () => {
  const { data, isLoading, isError, error, refetch, isSuccess } =
    useGetAllGamesQuery()
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
        navigate("/login")
      })
  }, [isError])

  if (isLoading) {
    return <Loader />
  }
  return (
    <div>
      <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
        Games
      </h2>
      <div className="grid grid-cols-4 2xl:gap-6 mt-10 md:gap-3">
        {data?.map((item: IGames, index: number) => {
          return (
            <div
              key={index}
              className="border-yellow border-2 p-3 flex flex-col gap-2 justify-between"
            >
              <div className="flex flex-col gap-2">
                <img
                  src={"https://back.pacgc.pw" + item.image}
                  alt="Фото игры"
                />
                <span className="text-yellow 2xl:text-2xl md:text-xl">
                  {item.name}
                </span>
                <span className="text-white 2xl:text-xl md:text-base">
                  {item.short_desc}
                </span>
              </div>
              <button
                onClick={() => {
                  navigate(`/games/${item.id}`)
                }}
                disabled={!item.active}
                
                className="w-full bg-yellow 2xl:text-xl md:text-base font-bold 2xl:p-3 md:p-2 text-center cursor-pointer disabled:opacity-30"
              >
                More detailed
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Games
