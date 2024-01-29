import { useNavigate, useParams } from "react-router-dom"
import {
  useGetCurrentDayMutation,
  useGetParticipateMutation,
  useGetTournamentByIdQuery,
} from "./Tournament.slice"
import { Oval } from "react-loader-spinner"
import browser from "../../../images/icons/browser.svg"
import apple from "../../../images/icons/apple.svg"
import android from "../../../images/icons/android.svg"
import win from "../../../images/icons/win.svg"
import { IoChevronBack } from "react-icons/io5"
import { memo, useMemo } from "react"
import tokenService from "../../../services/token.service"
import Rating from "./Rating"
import Loader from "../../../helpers/Loader"
import Page404 from "../../../helpers/Page404"
import Error from "../../../helpers/Error"

import {
  useNetwork,
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi"
import { utils } from "ethers"
import { changeChain } from "../../header/wallet/meta/chainHelper"

const Tournament = () => {
  let params = useParams()
  const navigate = useNavigate()
  const [getCurrentDay, { isLoading: dayLoading }] = useGetCurrentDayMutation()
  const [getParticipate, { isLoading: participateLoading }] =
    useGetParticipateMutation()

  const { data, isLoading, isError, error, refetch, isSuccess } =
    useGetTournamentByIdQuery(params.tournamentId)
  // console.log(data?.players?.split(','));
  // ===========================================
  const { chain } = useNetwork()
  const { isDisconnected } = useAccount()
  // TODO: request tgese fields from useGetTournamentByIdQuery
  const tournamentChainId = 800001
  const transferTo = "0x63b3B5a9113D5e3e9cF50c2Ab619d89e8d8D7DA9"

  const { config } = usePrepareSendTransaction({
    request: {
      to: transferTo,
      value: utils.parseEther((data?.cost ?? 0).toString()),
    },
  })
  const { data: transactionData, sendTransaction } = useSendTransaction(config)
  const {
    data: txReceipt,
    error: txError,
    isLoading: txLoading,
  } = useWaitForTransaction({ confirmations: 1, hash: transactionData?.hash })
  // ===========================================

  const symbols = {
    800001: "OCTA",
    1972: "REDE",
    default: "TOKEN",
  }

  if (isLoading) {
    return <Loader />
  }

  const handleParticipate = () => {
    getParticipate({
      user_id: tokenService.getUser()?.id,
      tournament_id: data?.id || "0",
    })
      .then((response) => {
        console.log(response)
        refetch()
      })
      .catch((error) => {
        console.log(error)
      })
  }
  if (!data) {
    return <Page404 />
  }
  if (isError) {
    return <Page404 />
  }

  console.log(tokenService.getUser(), " - kekekekek")

  const getCurrentButton = () => {
    if (tournamentChainId !== chain?.id) {
      return (
        <button
          className="w-full text-black bg-yellow text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30 "
          onClick={() => changeChain(tournamentChainId)}
          disabled={isDisconnected}
        >
          {`Switch to ${tournamentChainId}`}
        </button>
      )
    }

    return (
      <button
        className="w-full text-black bg-yellow text-xl font-bold p-3 text-center cursor-pointer disabled:opacity-30 "
        onClick={() => handleParticipate()}
        disabled={txLoading || isDisconnected}
      >
        {`Participate in the tournament for ${data?.cost}${
          symbols.hasOwnProperty(tournamentChainId)
            ? symbols[tournamentChainId as keyof typeof symbols]
            : symbols.default
        }`}
      </button>
    )
  }

  return (
    <div className="flex flex-row gap-20">
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
                .includes(tokenService.getUser()?.id.toString()) &&
              // TODO: remove
              tokenService.getUser().id.toString() !== "17" ? (
                <button className="w-full text-black bg-yellow text-xl font-bold p-3 text-center disabled:opacity-30">
                  You are already participating
                </button>
              ) : (
                getCurrentButton()
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
      <div className="w-1/4 relative">
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
