import {
  useNetwork,
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi"
import { utils } from "ethers"
import { changeChain } from "../../header/wallet/meta/chainHelper"
import { FC, useEffect } from "react"

interface ButtonProps {
  transferTo: `0x${string}`
  tournamentChainId: number
  amount: string
  postRequest: () => Promise<void>
}
const TournamentBtn: FC<ButtonProps> = ({
  transferTo,
  tournamentChainId,
  amount,
  postRequest,
}) => {
  const { chain } = useNetwork()
  const { isDisconnected } = useAccount()

  const { config } = usePrepareSendTransaction({
    request: {
      to: transferTo,
      value: utils.parseEther(amount),
    },
  })
  const {
    data: transactionData,
    sendTransaction,
    isSuccess: transactionSend,
  } = useSendTransaction(config)
  const {
    data: txReceipt,
    error: txError,
    isLoading: txLoading,
    isSuccess: transactionConfirmed,
  } = useWaitForTransaction({ confirmations: 1, hash: transactionData?.hash })
  // ===========================================

  const symbols = {
    800001: "OCTA",
    1972: "REDE",
    default: "PAC",
  }

  // Extract the useEffect to a separate component
  useEffect(() => {
    console.log("transactionSend changed")
    if (transactionConfirmed) {
      console.log(`Transaction hash ${transactionData?.hash}`)

      postRequest()
    }
  }, [transactionConfirmed])

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
      onClick={() => sendTransaction?.()}
      disabled={!sendTransaction || txLoading || isDisconnected}
    >
      {`Participate in the tournament for ${amount} ${
        symbols.hasOwnProperty(tournamentChainId)
          ? symbols[tournamentChainId as keyof typeof symbols]
          : symbols.default
      }`}
    </button>
  )
}

export default TournamentBtn
