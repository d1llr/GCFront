import { useNavigate } from "react-router-dom"
import IGames from "./Games.type"
import { useGetAllGamesQuery } from "./Games.slice"
import Loader from "../../helpers/Loader"

var t = true
const Games = () => {

  const data = [
    {
        "id": "1",
        "name": "PAC Shoot",
        "short_desc": "PAC Shoot is a dynamic multiplayer first-person shooter with various game modes. Immerse yourself in the exciting world of PAC Shoot, where your every move and victory can help you get rewarded!",
        "active": true
    },
    {
        "id": "2",
        "name": "PAC&Ball",
        "short_desc": "The aim of the game is to be the first to reach the finish line. The task seems easy at first glance, but throughout the game you will be hindered by other players (or bots), knocking you down or using various traps against you",
        "active": false
    },
    {
        "id": "3",
        "name": "PAC Squad",
        "short_desc": "Emergency call: Bank robbery!\nYou must prevent a crime and go on a challenging mission. Avoid traps and gather reinforcements for the final battle. The peace and safety of the town's citizens are in your hands",
        "active": false
    },
    {
        "id": "4",
        "name": "Pacman Wars",
        "short_desc": "In this game you have to lead a squad and go into battle to defeat the enemy! To cope with the task, you must increase the number of your troops, their strength and endurance, as well as show personal activity on the battlefield!",
        "active": true
    },
    {
        "id": "5",
        "name": "PAC Match 3",
        "short_desc": "Immerse yourself in the world of exciting puzzles with PAC Match 3! In this casual game you have to combine colorful cubes connected in meaning. Use power-ups to complete levels and unlock new chapters of the story!",
        "active": true
    }
]

  const {isLoading, isError, error, refetch, isSuccess } = useGetAllGamesQuery()
  // const { data, isLoading, isError, error, refetch, isSuccess } = useGetAllGamesQuery()
  const navigate = useNavigate()


  // if (isLoading) {
  //   return <Loader />
  // }
  return (
    <div className="background-image-black">
      <div className="wrapper-content">
        <h1 className="font-orbitron w-fit text-yellow text-8xl font-extrabold">Games</h1>

        <div className="grid grid-cols-3 gap-7 mt-10 max-[1300px]:grid-cols-2 max-[760px]:grid-cols-1">
          {data?.map((item: IGames, index: number) => {
            return (
              <div key={index} className="bg-yellow bg-gameShards bg-no-repeat bg-right-top rounded-[20px] h-full">

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

      

      {/* ADDITIONAL COMPONENTS */}
      <div className="wrapper-content">

        <div className="bg-lightGray rounded-[30px] flex flex-col items-center gap-10 px-6 pt-16 pb-12 max-[920px]:pt-8 max-[920px]:pb-6">
          <div className="flex flex-col items-center gap-5">
              <div className="font-orbitron text-white text-center text-[28px] leading-[35px] max-[920px]:text-[18px] max-[920px]:leading-[23px]">
                There have been no tournaments for this game yet, but they will appear soon.
              </div>
              <div className="font-chakra text-textGray text-[26px] leading-[34px] text-center max-[920px]:text-[16px] max-[920px]:leading-[21px]">
                You can participate in other tournaments
              </div>
          </div>
          <button className="black_btn max-w-[475px]" href="">
            All tournaments
          </button>
        </div>



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
            {/* ИКОНКИ OS */}
          </ul>
        </div>


        <div className="flex flex-row gap-3 flex-wrap max-[920px]:gap-2">
            <button class="filter_btn active">OCTA</button>
            <button class="filter_btn">REDEV2</button>
            <button class="filter_btn">PAC Match 3</button>
            <button class="filter_btn">PAC Shoot</button>
            <button class="filter_btn">Active</button>
            <button class="filter_btn">Completed</button>
        </div>

      </div>


      



      {/* ADDITIONAL COMPONENTS */}



    </div>
  )
}

export default Games
