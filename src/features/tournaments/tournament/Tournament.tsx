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
import TournamentBtn, { symbols } from "./TournamentBtn"
import { HashLink } from "react-router-hash-link"
import aboutIcon from "../../../images/icons/about-octa.svg"
import Button from "../../../helpers/Button"
import { useGetAllGamesQuery } from "../../games/Games.slice"
import { useEffect, useState } from "react"
import IGames from "../../games/Games.type"

const Tournament = () => {
  let params = useParams()
  const navigate = useNavigate()
  const [getParticipate] = useGetParticipateMutation()

  const { data, isLoading, isError, error, refetch, isSuccess } = useGetTournamentByIdQuery(params.tournamentId)
  const { data: gamesData, isLoading: gameDataLoading } = useGetAllGamesQuery();

  if (isLoading || gameDataLoading) {
    return <Loader />
  }

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

  function gameInfo() {
    const game = gamesData?.find(game => game.code === data?.game);
    navigate(`/games/${game?.id}`)
  }

  return data && (
    <div className="background-image-yellow">
      <div className="wrapper-content">
        <div className="flex flex-col lg:md:gap-[150px] sm:gap-[80px] gap-10 justify-between h-full">
          <div className="flex flex-col gap-8 font-orbitron">
            <h1 className="font-orbitron w-2/3 text-yellow lg:text-8xl md:text-6xl text-4xl font-extrabold max-[600px]:w-full">{data?.name}</h1>
            <div className="w-2/5 font-medium text-[32px] text-white lg:md:leading-10 leading-5 lg:md:w-2/5 w-full sm:w-4/5 font-semibold lg:md:text-2xl text-base text-white">{data?.goal}</div>
            <div className={`flex ${data?.players?.split(',').includes(tokenService.getUser()?.id.toString()) && 'hidden'} flex-row items-center gap-2`}>
              <span className="text-yellow text-2xl font-bold">
                The cost of participation:
              </span>
              <span className="text-white text-2xl font-bold">
                {data?.cost}
              </span>
            </div> 
            {data?.chainID === "800001" &&
            <a href="https://octa.space/" target="_blank">
                <button className="w-fit flex text-center bg-customBlack font-orbitron font-bold transition-all duration-300 disabled:text-textGray disabled:bg-[rgb(27, 27, 27)] rounded-lg hover:bg-lighterGray hover:transition-all hover:duration-300 text-white items-center gap-4 ">
                    <p className="h-fit">About OCTA</p>
                    <img src={aboutIcon} alt="about" />
                </button>                           
            </a>}
            <div className="flex lg:md:flex-row gap-2 lg:md:w-1/2 flex-col">
              {
                data?.players?.split(',').includes(tokenService.getUser()?.id.toString())
                  ?
                  <HashLink
                    to='#my-rating'
                    smooth
                    className="text-center bg-yellow text-black w-full p-4 text-xl font-bold border-none rounded-xl  font-orbiton hover:bg-hoverYellow transition-al  disabled:opacity-30"
                  >
                    Players rating
                  </HashLink>
                  :
                  <>
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

                    {/* <div className={`w-[384px] p-[1px] max-w-96 `}> */}
                    {/* <a href="" target="_blank" className="w-full md:max-w-[384px] h-[60px]"> */}
                      <button onClick={gameInfo} className=" w-full h-[60px] xl:h-auto max-w-none md:max-h-[78px] xl:max-w-[384px] font-semibold border-none font-orbitron text-center transition-all duration-300 hover:transition-all hover:duration-300 text-[#FFF100] bg-[#272727] rounded-xl">
                          Details about the game
                      </button>                        
                    {/* </a> */}
                    
                    {/* </div> */}

                  </>
              }

              {/* <button disabled className={`${data?.players?.split(',').includes(tokenService.getUser()?.id.toString()) && 'hidden'} disabled:opacity-30 text-center bg-lightGray text-yellow w-full p-4 text-xl font-bold border-none rounded-xl font-orbiton hover:bg-hoverYellow transition-al`}>
                Details about the game
              </button> */}
            </div>
          </div>
          <div className="flex flex-col gap-10 font-orbitron ">
            <h2 className="w-fit text-yellow lg:text-8xl md:text-6xl text-4xl font-extrabold">Rewards</h2>
            <div className="flex lg:md:flex-row flex-col gap-2 w-full justify-between">
              {data?.awards.split(',').map((el, index) => {
                return (
                  <div className="flex lg:md:flex-col flex-row justify-between gap-10">
                    <span className="lg:text-5xl md:text-4xl sm:text-2xl text-2xl text-white font-bold">
                      #{index + 1} place
                    </span>
                    <span className="lg:text-[32px] md:text-[26px] sm:text-[22px] text-[20px] font-bold text-yellow">
                      {el} {symbols.hasOwnProperty(data?.chainID)
                        ? symbols[data?.chainID as keyof typeof symbols]
                        : symbols.default
                      }
                    </span>
                  </div>)
              })}
            </div>

          </div>
          <div className="flex flex-col gap-10 font-orbitron ">
            <h2 className="w-fit text-yellow lg:text-8xl md:text-6xl text-4xl font-extrabold">Details</h2>
            <div className="grid lg:grid-cols-4 gap-4 md:grid-cols-2 grid-cols-1">
              <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl ">
                <span className="text-[32px] text-yellow font-bold ">
                  Game
                </span>
                <span className="text-2xl font-normal text-white font-chakra">
                  {data?.game_name}
                </span>
              </div>
              <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl">
                <span className="text-[32px] text-yellow font-bold">
                  Start
                </span>
                <span className="text-2xl font-normal text-white font-chakra">
                  {new Date(data?.createdAt).toDateString()}
                </span>
              </div>
              <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl">
                <span className="text-[32px] text-yellow font-bold">
                  Finish
                </span>
                <span className="text-2xl font-normal text-white font-chakra">
                  {getDate(data?.createdAt, data?.daysLeft)}
                </span>
              </div>
              <div className="flex flex-col gap-4 bg-lightGray justify-center items-center py-10 rounded-2xl">
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
