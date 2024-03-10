import { useNavigate } from "react-router-dom"
import IGames from "./Games.type"
import { useGetAllGamesQuery } from "./Games.slice"
import Loader from "../../helpers/Loader"

var t = true
const Games = () => {
  const { data, isLoading, isError, error, refetch, isSuccess } = useGetAllGamesQuery()
  const navigate = useNavigate()


  if (isLoading) {
    return <Loader />
  }
  return (
    <div className="background-image-black">
      <div className="wrapper-content">
        <h1 className="font-orbitron w-fit text-yellow text-8xl font-extrabold">Games</h1>

        <div className="grid grid-cols-3 gap-7 mt-10">
          {data?.map((item: IGames, index: number) => {
            return (
              <div key={index} className="bg-yellow bg-gameShards bg-no-repeat bg-right-top rounded-[20px] h-full">

                <div className="h-full overflow-hidden flex flex-col gap-4">
                  <div className="game-name text-white font-orbitron py-3 px-6 text-3xl max-w-fit bg-customBlack rounded-br-3xl">
                    {item.name}
                  </div>

                  <div className="h-full overflow-hidden flex flex-col justify-between gap-6">

                    <div className="text-customBlack text-xl py-6 px-6 pb-0 font-medium">
                      {item.short_desc}
                    </div>

                    <div className="py-6 px-6 pt-0">
                      <button
                        onClick={() => {
                          navigate(`/games/${item.id}`)
                        }}
                        disabled={!item.active}
                        className="w-full bg-customBlack font-orbitron font-semibold text-yellow rounded-3xl 2xl:text-xl md:text-base font-bold 2xl:p-3 md:p-2 text-center cursor-pointer disabled:text-[#898989] disabled:bg-[#1B1B1B]"
                      >
                        {item.active ? 'More detailed' : 'Under development'}
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Games
