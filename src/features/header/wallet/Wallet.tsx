import { useEffect, useState } from "react"
import Loader from "../../../helpers/Loader"
import tokenService from "../../../services/token.service"
import { removeWallet, setBalance, setWallet } from "../../user/User.slice"
import {
  useCheckBalanceQuery,
  useConnectWalletMutation,
  useRechargeBalanceMutation,
  useRemoveWalletMutation,
  useWithdrawBalanceMutation,
} from "./wallet.slice"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigate } from "react-router-dom"
import IWallet from "./wallet.type"
import { isApiResponse } from "../../../helpers/isApiResponse"
import useWindowFocus from 'use-window-focus';

// wagmi
import { bsc } from "@wagmi/core/chains"
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi"
import { changeChain } from "./meta/chainHelper"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { deposit, withdraw } from "./ChainInteractions"
import { supportedChain } from "./meta/chains"
import { useToast } from "@chakra-ui/react"

enum Mode {
  recharge = "Recharge",
  withdraw = "Withdraw",
  switch = "Switch",
}

const Wallet = () => {
  const toast = useToast()
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { chain } = useNetwork()
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected })
    },
  })

  const regex = /reason="([^"]+)"/

  const [needToSwitch, setNeedToSwitch] = useState(false)
  useEffect(() => {
    chain?.id && supportedChain(chain?.id)
      ? setNeedToSwitch(false)
      : setNeedToSwitch(true)
  }, [chain])

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

  function neededAccount() {
    return (
      account.address === "0x8A9A13FDC2DA328C7FC96F61E2bE1eE6D4639E83" ||
      account.address === "0x5Af152d00A46D72021cF5fdfB94D9A997d520dd7" ||
      account.address === "0x66668a9DbBbDEc8310B210CF17a1d32bD12a20bC"
    )
  }

  const wallet = useAppSelector((state) => state.UserSlice.wallet)
  const balance = useAppSelector((state) => state.UserSlice.balance)
  const [mode, setMode] = useState<Mode>()
  const dispatch = useAppDispatch()
  const [connectWallet, { isLoading }] = useConnectWalletMutation()

  type UserSubmitForm = {
    amount: number
  }

  const [
    RechargeBalance, // This is the mutation trigger
  ] = useRechargeBalanceMutation()
  const [
    WithdrawBalance, // This is the mutation trigger
    { isError: isErrorWithdrawBalance, error: errorWithdrawBalance }, // This is the destructured mutation result
  ] = useWithdrawBalanceMutation()



  const isWindowFocused = useWindowFocus();
  const { data, status, error, refetch } = useCheckBalanceQuery(tokenService.getUser().id, {
    pollingInterval: 30000,
    skip: !isWindowFocused,
    refetchOnFocus: true
  })


  
  const [removeWalletAPI] = useRemoveWalletMutation()

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .moreThan(0, "Cant be 0"),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = async (data: UserSubmitForm) => {
    switch (mode) {
      case Mode.recharge:
        try {
          if (chain?.id !== bsc.id) {
            console.error("Selected chain is not supported")
            break
          }

          const result = (await deposit(data.amount.toString())).status
          if (!result) {
            console.error("Transaction status: unfulfilled")
            break
          }

          await RechargeBalance({
            id: tokenService.getUser().id,
            amount: data.amount,
          })
            .unwrap()
            .then((response: IWallet) => {
              dispatch(setBalance(response.balance))
              tokenService.setBalance(response.balance)
            })
        } catch (message) {
          const reason = (message as { message: string })?.message.match(regex)
          console.log("Error while recharge: ", reason)
          notification(
            `Error while recharge`,
            `${reason?.[1] ? reason?.[1] : message}`,
            "error",
          )
        }

        break

      case Mode.withdraw:
        try {
          if (chain?.id !== bsc.id) {
            console.error("Selected chain is not supported")
            break
          }

          if (!neededAccount()) {
            console.error("Request denied")
            break
          }

          const result = (await withdraw(data.amount.toString())).status
          if (!result) {
            console.error("Transaction status: unfulfilled")
            break
          }

          // await WithdrawBalance({
          //   id: tokenService.getUser().id,
          //   amount: data.amount,
          // })
          //   .unwrap()
          //   .then((response: IWallet) => {
          //     dispatch(setBalance(response.balance))
          //     tokenService.setBalance(response.balance)
          //   })
          //   .catch((err) => {})
        } catch (message) {
          const reason = (message as { message: string })?.message.match(regex)
          console.log("Error while withdraw: ", reason)
          notification(
            `Error while withdraw`,
            `${reason?.[1] ? reason?.[1] : message}`,
            "error",
          )
        }

        break
    }
  }

  async function handleConnectWallet(): Promise<void> {
    try {
      // connect logic
      await changeChain(bsc.id)

      if (account.isConnected) {
        await disconnectAsync()
      }
      const { account: accountAddress, chain: metamaskChain } =
        await connectAsync({
          connector: new MetaMaskConnector(),
        })
      const userData = { address: accountAddress, chainId: metamaskChain.id }

      // DB logic
      await connectWallet({
        id: tokenService.getUser().id,
        wallet: accountAddress,
      })
        .then((response) => {
          tokenService.setWallet(accountAddress)
          dispatch(setWallet(accountAddress))
        })
        .catch((error) => {
          console.log(error)
        })

      console.log("User data: ", userData)
    } catch (e) {
      const error = (e as { message: string })?.message
      console.error("Error while disconnect: ", error)

      if (
        error.includes("No crypto wallet found") ||
        error.includes("Connector not found")
      ) {
        window.open("https://metamask.io/", "_blank")
      }
    }
  }
  const handleDisConnectWallet = async () => {
    await removeWalletAPI({
      id: tokenService.getUser().id,
    })
      .then((response) => {
        tokenService.setWallet(null)
        dispatch(removeWallet())
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return account.isConnected ? (
    <div className="flex flex-col gap-3">
      <div className="bg-yellow p-3 flex-col flex gap-5">
        <span className="text-black text-xl font-bold">Your game balance</span>
        <span className="text-black self-end font-bold text-xl">
          {balance} PAC
        </span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={` flex-col text-white ${
            wallet ? "flex" : "hidden"
          } mx-auto my-auto w-full gap-2`}
        >
          <div className={`form-group  flex-col ${mode ? "flex" : "hidden"}`}>
            <label className="text-sm text-black">
              Amount<b className="text-black">*</b>
            </label>
            <div
              className={`form-control ${
                errors.amount ? "is-invalid border-red-500" : ""
              } border-2 border-black bg-inherit p-1 px-3 flex flex-row items-center justify-between`}
            >
              <input
                {...register("amount")}
                type="number"
                className={`form-control focus:outline-none text-black ${
                  errors.amount ? "is-invalid" : ""
                } bg-inherit border-none focus:outline-none`}
                placeholder="Amount"
              />
              <i className="cursor-pointer text-black">PAC</i>
            </div>
            <div className="invalid-feedback text-red-500 text-sm">
              {errors.amount?.message}
            </div>
          </div>
          {wallet && (
            <div className="form-group w-full flex flex-row justify-between gap-2">
              {mode === Mode.recharge ? (
                <>
                  <button
                    className="bg-black p-1 w-full border-black text-sm text-white font-bold"
                    onClick={() => setMode(undefined)}
                  >
                    Cancel
                  </button>
                  {needToSwitch ? (
                    <button
                      className="bg-black p-2 w-full border-black text-sm text-white font-bold"
                      onClick={() => changeChain(bsc.id)}
                    >
                      Switch
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-inherit p-1 w-full border-2 border-black text-black font-bold"
                    >
                      {Mode.recharge}
                    </button>
                  )}
                </>
              ) : mode === Mode.withdraw ? (
                <>
                  <button
                    className="bg-black p-1 w-full border-black text-sm text-white font-bold"
                    onClick={() => setMode(undefined)}
                  >
                    Cancel
                  </button>
                  {needToSwitch ? (
                    <button
                      className="bg-black p-2 w-full border-black text-sm text-white font-bold"
                      onClick={() => changeChain(bsc.id)}
                    >
                      Switch
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-inherit p-1 w-full border-2 border-black text-black font-bold"
                    >
                      {Mode.withdraw}
                    </button>
                  )}
                </>
              ) : (
                <div
                  className={`form-group w-full flex flex-row justify-between gap-2`}
                >
                  {needToSwitch ? (
                    <button
                      className="bg-black p-2 w-full border-black text-sm text-white font-bold"
                      onClick={() => changeChain(bsc.id)}
                    >
                      Switch
                    </button>
                  ) : (
                    <>
                      <button
                        className="bg-black p-1 w-full border-black text-sm text-white font-bold"
                        onClick={() => setMode(Mode.recharge)}
                      >
                        {Mode.recharge}
                      </button>
                      <button
                        className={
                          neededAccount()
                            ? "bg-black p-1 w-full border-black text-sm text-white font-bold"
                            : "bg-inherit p-1 w-full border-2 border-black text-black font-bold disabled:opacity-30"
                        }
                        onClick={() => {
                          if (neededAccount()) {
                            setMode(Mode.withdraw)
                          } else {
                            console.log("Still not available")
                          }
                        }}
                        disabled={!neededAccount()}
                      >
                        {Mode.withdraw}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </form>
        <div className="invalid-feedback text-red-500 text-sm">
          {isErrorWithdrawBalance &&
            isApiResponse(errorWithdrawBalance) &&
            errorWithdrawBalance.data.message}
        </div>
      </div>
    </div>
  ) : (
    <div>
      {account.isConnected ? (
        <button
          className="text-xl text-black font-bold bg-yellow p-3 flex-col flex gap-5 w-full items-center text-center"
          onClick={() => handleDisConnectWallet()}
        >
          {isLoading && <Loader />}
          Disconnect wallet
        </button>
      ) : (
        <button
          className="text-xl text-black font-bold bg-yellow p-3 flex-col flex gap-5 w-full items-center text-center"
          onClick={() => handleConnectWallet()}
        >
          {isLoading && <Loader />}
          Connect wallet
        </button>
      )}
    </div>
  )
}

export default Wallet
