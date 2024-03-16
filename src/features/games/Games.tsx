import { useNavigate } from "react-router-dom"
import IGames from "./Games.type"
import { useGetAllGamesQuery } from "./Games.slice"
import Loader from "../../helpers/Loader"



const Games = () => {


  const { data, isLoading, isError, error, refetch, isSuccess } = useGetAllGamesQuery()
  // const { data, isLoading, isError, error, refetch, isSuccess } = useGetAllGamesQuery()
  const navigate = useNavigate()


  if (isLoading) {
    return <Loader />
  }
  return (
    <div className="background-image-black">
      <div className="wrapper-content">
        <h1 className="font-orbitron w-fit text-yellow lg:text-8xl md:text-6xl text-4xl font-extrabold">Games</h1>

        <div className="grid grid-cols-3 gap-7 mt-10 max-[1300px]:grid-cols-2 max-[760px]:grid-cols-1">
          {data?.map((item, index: number) => {
            return (
              <div key={index} className="bg-yellow bg-gameShards bg-contain bg-no-repeat bg-right-top rounded-[20px] h-full">

                <div className="h-full overflow-hidden flex flex-col gap-4">
                  <div className="game-name text-white font-orbitron py-3 px-6 text-3xl max-w-fit bg-customBlack rounded-br-3xl max-[920px]:text-[18px]">
                    {item.name}
                  </div>

                  <div className="h-full overflow-hidden flex flex-col justify-between gap-6">

                    <div className="text-customBlack text-xl py-6 px-6 pb-0 font-medium max-[920px]:text-base max-[920px]:font-bold max-[500px]:text-sm max-[500px]:font-semibold">
                      {item.short_desc}
                    </div>

                    <div className="py-6 px-6 pt-0">
                      <button
                        onClick={() => {
                          navigate(`/games/${item.id}`)
                        }}
                        disabled={!item.active}
                        className="black_btn"

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
