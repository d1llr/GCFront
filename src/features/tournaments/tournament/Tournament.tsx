import { useNavigate, useParams } from "react-router-dom"
import {
  useGetParticipateMutation,
  useGetTournamentByIdQuery,
} from "./Tournament.slice"
import { IoChevronBack } from "react-icons/io5"
import tokenService from "../../../services/token.service"
import Rating from "./Rating"
import Loader from "../../../helpers/Loader"
import Page404 from "../../../helpers/Page404"
import TournamentBtn from "./TournamentBtn"

const Tournament = () => {
  let params = useParams()
  const navigate = useNavigate()
  const [getParticipate] = useGetParticipateMutation()

  const { data, isLoading, isError, error, refetch, isSuccess } = useGetTournamentByIdQuery(params.tournamentId)
  // console.log(data?.players?.split(','));

  // if (isLoading) {
  //   return <Loader />
  // }

  if (!data) {
    return <Page404 navigateTo={'/tournaments'} />
  }

  if (isError) {
    return <Page404 navigateTo={'/tournaments'} />
  }


  const getDate = (createdAt: string, daysLeft: string) => {

    let res = new Date(createdAt);

    // Add ten days to specified date
    res.setDate(res.getDate() + Number(daysLeft));

    console.log(res);
    return res.toDateString()
  }

  return (
    <div className="background-image-yellow">
      <div className="wrapper-content">
        <div className="flex flex-col gap-[150px] justify-between h-full">
          <div className="flex flex-col gap-8 font-orbitron">
            <h1 className="font-orbitron w-2/3 text-yellow text-8xl font-extrabold">{data?.name}</h1>
            <div className="w-2/5 font-medium text-[32px] text-white leading-10">{data?.goal}</div>
            <div className="flex flex-row items-center gap-2">
              <span className="text-yellow text-2xl font-bold">
                The cost of participation:
              </span>
              <span className="text-white text-2xl font-bold">
                {data?.cost}
              </span>
            </div>
            <div className="flex flex-row gap-2 w-1/2">
              <TournamentBtn
                transferTo={data?.address}
                tournamentChainId={Number(data?.chainID)}
                // amount={data?.cost.toString()}
                amount={data?.cost.toString()}

                // transferTo={"0x63b3B5a9113D5e3e9cF50c2Ab619d89e8d8D7DA9"} // TODO: integrate address for each tournament
                // tournamentChainId={800001} // TODO: integrate chainId of current tournament for each tournament (chain)
                // amount={"5"} // TODO: change on `data?.cost.toString()`
                postRequest={() =>
                  // post request
                  getParticipate({
                    user_id: tokenService.getUser()?.id,
                    tournament_id: data?.id || "0",
                  })
                    .then((response: any) => {
                      console.log(response)
                      refetch()
                    })
                    .catch((error: any) => {
                      console.log(error)
                    })
                }
              />
              <button className={`text-center bg-lightGray text-yellow w-full p-4 text-xl font-bold border-none rounded-xl font-orbiton hover:bg-hoverYellow transition-al`}>
                Details about the game
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-10 font-orbitron ">
            <h2 className="w-fit text-yellow text-8xl font-extrabold">Rewards</h2>
            <div className="flex flex-row gap-2 w-full justify-between">
              {[...Array(5)].map((el, index) => {
                return (
                  <div className="flex flex-col gap-10">
                    <span className="text-5xl text-white font-bold">
                      #{index + 1} place
                    </span>
                    <span className="text-[32px] font-bold text-yellow">
                      100 PAC
                    </span>
                  </div>)
              })}
            </div>

          </div>
          <div className="flex flex-col gap-10 font-orbitron ">
            <h2 className="w-fit text-yellow text-8xl font-extrabold">Details</h2>
            <div className="flex flex-row gap-5 w-full justify-between">
              <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl w-1/4">
                <span className="text-[32px] text-yellow font-bold ">
                  Game
                </span>
                <span className="text-2xl font-normal text-white font-chakra">
                  {data?.game_name}
                </span>
              </div>
              <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl w-1/4">
                <span className="text-[32px] text-yellow font-bold">
                  Start
                </span>
                <span className="text-2xl font-normal text-white font-chakra">
                  {new Date(data?.createdAt).toDateString()}
                </span>
              </div>
              <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl w-1/4">
                <span className="text-[32px] text-yellow font-bold">
                  Finish
                </span>
                <span className="text-2xl font-normal text-white font-chakra">
                  {getDate(data?.createdAt, data?.daysLeft)}
                </span>
              </div>
              <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl w-1/4">
                <span className="text-[32px] text-yellow font-bold">
                  Participants
                </span>
                <span className="text-2xl font-normal text-white font-chakra">
                  {data?.participants}
                </span>
              </div>
            </div>

          </div>
          <Rating tournament_id={data?.id} typeTR={"active"} />
        </div>
      </div >

    </div>
  )
}

export default Tournament
