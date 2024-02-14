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

  if (isLoading) {
    return <Loader />
  }

  if (!data) {
    return <Page404 navigateTo={'/tournaments'} />
  }

  if (isError) {
    return <Page404 navigateTo={'/tournaments'} />
  }

  return (
    <div className="flex flex-row gap-20">
      {/* <ParticipateEffect /> */}
      <div className="text-white flex flex-col gap-5 w-3/4">
        <h2
          onClick={() => {
            navigate(`/tournaments`)
          }}
          className="w-fit decoration-dotted underline text-yellow text-2xl flex flex-row items-center cursor-pointer"
        >
          <IoChevronBack />
          <span>Tournaments</span>
        </h2>
        <div className="flex flex-row gap-6 mt-7 w-2/3">
          <div className="flex flex-row gap-5">
            <div className="w-1/2">
              <img
                src={"https://back.pacgc.pw" + data?.image}
                alt="Фото"
                className="object-cover w-full"
              />
            </div>
            <div className="flex flex-col gap-2 h-full justify-between w-1/2">
              <div className="flex flex-col gap-2 text-white">
                <span className="text-yellow text-2xl">{data?.name}</span>
                <span className="text-xl">{data?.description}</span>
              </div>
              <div>
                <ul>
                  <li className="flex flex-row justify-between">
                    <span className="text-yellow text-2xl">Goal</span>
                    <span>{data?.goal}</span>
                  </li>
                  <li className="flex flex-row justify-between">
                    <span className="text-yellow text-2xl">Participants</span>
                    <span>{data?.participants}</span>
                  </li>
                  <li className="flex flex-row justify-between">
                    <span className="text-yellow text-2xl">Bank</span>
                    <span>{data?.bank}</span>
                  </li>
                </ul>
              </div>
              {data?.players
                ?.split(",")
                .includes(tokenService.getUser()?.id.toString()) ? (
                <button
                  style={{ cursor: "not-allowed" }}
                  className="w-full text-black bg-yellow text-xl font-bold p-3 text-center disabled:opacity-30"
                  disabled
                >
                  You are already participating
                </button>
              ) : (
                // <button className="w-full text-black bg-yellow text-xl font-bold p-3 text-center disabled:opacity-30"
                //   onClick={() => {
                //     getParticipate({
                //       user_id: tokenService.getUser()?.id,
                //       tournament_id: data?.id || "0",
                //     })
                //       .then((response: any) => {
                //         console.log(response)
                //         refetch()
                //       })
                //       .catch((error: any) => {
                //         console.log(error)
                //       })
                //   }}>
                //   Participate 2 PAC
                // </button>
                <TournamentBtn
                  transferTo={data?.address}
                  tournamentChainId={Number(data?.chainID)}
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
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="text-yellow text-2xl decoration-dotted underline">
            Tournament Rules
          </h1>
          <span>{data?.description}</span>
        </div>
      </div>
      <div className="w-2/5 relative">
        <h2 className="w-fit decoration-dotted underline text-yellow text-2xl z-0 pointer-events-none select-none p-2">
          Player rating
        </h2>
        <div className="flex flex-row gap-6 mt-10 z-0 h-full">
          {isSuccess && <Rating tournament_id={data?.id} typeTR={"active"} />}
        </div>
      </div>
    </div>
  )
}

export default Tournament
