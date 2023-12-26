import { useEffect, useState } from "react"
import Loader from "../../../helpers/Loader"
import tokenService from "../../../services/token.service"
import {
  removeWallet,
  setBalance,
  setWallet,
  useRefreshTokenMutation,
} from "../../user/User.slice"
import {
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

// wagmi
import { bsc } from "@wagmi/core/chains"
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi"
import { changeChain } from "./meta/chainHelper"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { transfer } from "./transferERC20"
import { supportedChain } from "./meta/chains"

enum Mode {
  recharge = "Recharge",
  withdraw = "Withdraw",
  switch = "Switch",
}

const Wallet = () => {
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { chain } = useNetwork()
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected })
    },
  })

  const [needToSwitch, setNeedToSwitch] = useState(false)
  useEffect(() => {
    chain?.id && supportedChain(chain?.id)
      ? setNeedToSwitch(false)
      : setNeedToSwitch(true)
  }, [chain])

  const wallet = useAppSelector((state) => state.UserSlice.wallet)
  const balance = useAppSelector((state) => state.UserSlice.balance)
  const [mode, setMode] = useState<Mode>()
  const dispatch = useAppDispatch()
  const [connectWallet, { isError, isLoading, isSuccess, isUninitialized }] =
    useConnectWalletMutation()
  const [
    removeWalletAPI,
    {
      isError: removeWalletAPIErr,
      isLoading: removeWalletAPILoading,
      isSuccess: removeWalletAPISuccess,
      isUninitialized: removeWalletAPIUn,
    },
  ] = useRemoveWalletMutation()

  type UserSubmitForm = {
    amount: number
  }

  const [
    RechargeBalance, // This is the mutation trigger
    {
      isLoading: LoadingBalance,
      isSuccess: SuccessBalance,
      isError: isErrorBalance,
      isUninitialized: UninitializedBalance,
      error,
    }, // This is the destructured mutation result
  ] = useRechargeBalanceMutation()
  const [
    WithdrawBalance, // This is the mutation trigger
    {
      isLoading: LoadingWithdrawBalance,
      isSuccess: SuccessWithdrawBalance,
      isError: isErrorWithdrawBalance,
      error: errorWithdrawBalance,
      isUninitialized: UninitializedWithdrawBalance,
    }, // This is the destructured mutation result
  ] = useWithdrawBalanceMutation()

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .moreThan(0, "Cant be 0"),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(validationSchema),
  })

  const navigate = useNavigate()
  const onSubmit = async (data: UserSubmitForm) => {
    switch (mode) {
      case Mode.switch:
        await changeChain(bsc.id)
        break

      case Mode.recharge:
        if (chain?.id !== bsc.id) {
          console.error("Selected chain is not supported")
          break
        }

        const result = (await transfer(data.amount.toString())).status
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

        break

      case Mode.withdraw:
        await WithdrawBalance({
          id: tokenService.getUser().id,
          amount: data.amount,
        })
          .unwrap()
          .then((response: IWallet) => {
            dispatch(setBalance(response.balance))
            tokenService.setBalance(response.balance)
          })
          .catch((err) => {})

        break
    }
  }

  async function handleConnectWallet(): Promise<void> {
    try {
      await changeChain(bsc.id)

      if (account.isConnected) {
        await disconnectAsync()
      }
      const { account: accountAddress, chain: metamaskChain } =
        await connectAsync({
          connector: new MetaMaskConnector(),
        })
      const userData = { address: accountAddress, chainId: metamaskChain.id }

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
      console.error("KEK: ", error)

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
                  <button
                    type="submit"
                    className="bg-inherit p-1 w-full border-2 border-black text-black font-bold"
                  >
                    {Mode.recharge}
                  </button>
                </>
              ) : mode === Mode.withdraw ? (
                <>
                  <button
                    className="bg-black p-1 w-full border-black text-sm text-white font-bold"
                    onClick={() => setMode(undefined)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-inherit p-1 w-full border-2 border-black text-black font-bold"
                  >
                    {Mode.withdraw}
                  </button>
                </>
              ) : (
                <div
                  className={`form-group w-full flex flex-row justify-between gap-2`}
                >
                  {needToSwitch ? (
                    <button
                      className="bg-black p-1 w-full border-black text-sm text-white font-bold"
                      onClick={() => setMode(Mode.switch)}
                      disabled
                    >
                      {Mode.switch}
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
                        className="bg-inherit p-1 w-full border-2 border-black text-black font-bold disabled:opacity-30"
                        onClick={() => setMode(Mode.withdraw)}
                        disabled
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
