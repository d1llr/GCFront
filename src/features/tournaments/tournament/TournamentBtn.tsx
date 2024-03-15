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
import { useToast } from "@chakra-ui/react"
import Loader from "../../../helpers/Loader"
import { NavLink, useNavigate } from "react-router-dom"
import { HashLink } from 'react-router-hash-link';


interface ButtonProps {
  transferTo: `0x${string}`
  tournamentChainId: number
  amount: string
  postRequest: () => Promise<void>
}

export const symbols = {
  800001: "OCTA",
  1972: "REDE",
  default: "PAC",
}


const TournamentBtn: FC<ButtonProps> = ({
  transferTo,
  tournamentChainId,
  amount,
  postRequest,
}) => {
  const { chain } = useNetwork()
  const { isDisconnected } = useAccount()
  const toast = useToast()

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

  function notification(
    title: string,
    message: string,
    status: "info" | "warning" | "success" | "error" | "loading",
  ) {
    toast({
      title,
      description: message,
      status,
      position: "top-right",
      duration: 9000,
      isClosable: true,
    })
  }

  useEffect(() => {
    if (transactionConfirmed) {
      console.log(`Transaction hash ${transactionData?.hash}`)

      postRequest()
      notification(
        "Now you're participating!",
        `${transactionData?.hash}`,
        "success",
      )
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [transactionConfirmed])

  useEffect(() => {
    txLoading &&
      notification(
        'Warning!',
        'Do not reload the page until the transaction is completed',
        'warning'
      )
  }, [txLoading])

  useEffect(() => {
    if (txError) {
      console.log(`Transaction error ${txError.message}`)
      notification("TRansaction reverted!", "See console logs", "error")
    }
  }, [txError])

  if (tournamentChainId !== chain?.id) {
    return (
      <button
        className="text-center max-w-20 bg-yellow text-black w-1/2 p-4 text-xl font-bold border-none rounded-xl  font-orbiton hover:bg-hoverYellow transition-al  disabled:opacity-30"
        onClick={() => changeChain(tournamentChainId)}
        disabled={!isDisconnected}
      >
        {`Participate`}
      </button>
    )
  }

  return (
    <button
      className="text-center bg-yellow text-black w-full p-4 text-xl font-bold border-none rounded-xl  font-orbiton hover:bg-hoverYellow transition-al  disabled:opacity-30"
      onClick={() => sendTransaction?.()}
      disabled={!sendTransaction || isDisconnected}
    >
      {
        txLoading ? <Loader />
          :
          `Participate`}
    </button>
  )
}

export default TournamentBtn
