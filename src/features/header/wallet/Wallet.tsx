import { useState } from "react"
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
import { changeChain } from "./chainHelper"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"

enum Mode {
  recharge = "Recharge",
  withdraw = "Withdraw",
}

const Wallet = () => {
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected })
    },
  })

  const wallet = useAppSelector((state) => state.UserSlice.wallet)
  const balance = useAppSelector((state) => state.UserSlice.balance)
  const [mode, setMode] = useState<Mode>()
  const dispatch = useAppDispatch()
  const [connectWallet, { isError, isLoading, isSuccess, isUninitialized }] = useConnectWalletMutation()
  const [removeWalletAPI, { isError: removeWalletAPIErr, isLoading: removeWalletAPILoading, isSuccess: removeWalletAPISuccess, isUninitialized: removeWalletAPIUn }] = useRemoveWalletMutation()

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
    amount: Yup.number().required("Amount is required").moreThan(0, "Cant be 0"),
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
      case Mode.recharge:
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
          .catch((err) => { })

        break
    }
  }

  async function handleConnectWallet(): Promise<void> {
    try {
      await changeChain(bsc.id)

      if (isConnected) {
        await disconnectAsync()
      }
      const { account, chain: metamaskChain } = await connectAsync({
        connector: new MetaMaskConnector(),
      })
      const userData = { address: account, chainId: metamaskChain.id }

      await connectWallet({
        id: tokenService.getUser().id,
        wallet: account,
      })
        .then((response) => {
          tokenService.setWallet(account)
          dispatch(setWallet(account))
        })
        .catch((error) => {
          console.log(error)
        })

      console.log("User data: ", userData)
    } catch (e) {
      console.error((e as { message: string })?.message)
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

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-yellow p-3 flex-col flex gap-5">
        <span className="text-black text-xl font-bold">Your game balance</span>
        <span className="text-black self-end font-bold text-xl">{balance} PAC</span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={` flex-col text-white ${wallet ? "flex" : "d-none"
            } mx-auto my-auto w-full gap-2`}
        >
          <div className={`form-group  flex-col ${mode ? "flex" : "d-none"}`}>
            <label className="text-sm text-black">
              Amount<b className="text-black">*</b>
            </label>
            <div
              className={`form-control ${errors.amount ? "is-invalid border-red-500" : ""
                } border-2 border-black bg-inherit p-1 px-3 flex flex-row items-center justify-between`}
            >
              <input
                {...register("amount")}
                type="number"
                className={`form-control focus:outline-none text-black ${errors.amount ? "is-invalid" : ""
                  } bg-inherit border-none focus:outline-none`}
                placeholder="Amount"

              />
              <i className="cursor-pointer text-black">PAC</i>
            </div>
            <div className="invalid-feedback text-red-500 text-sm">
              {errors.amount?.message}
            </div>
          </div>
          {
            wallet &&
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
              ) :
                mode === Mode.withdraw ? (
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
                )
                  :
                  <div className={`form-group w-full flex flex-row justify-between gap-2`}>
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
                  </div>
              }
            </div>
          }
        </form>
        <div className="invalid-feedback text-red-500 text-sm">
          {isErrorWithdrawBalance &&
            isApiResponse(errorWithdrawBalance) &&
            errorWithdrawBalance.data.message}
        </div>

      </div>
      <>
        {wallet ?
          <button
            className="text-xl text-black font-bold bg-yellow p-3 flex-col flex gap-5 w-full items-center text-center"
            onClick={() => handleDisConnectWallet()}
          >
            {isLoading && <Loader />}
            Disconnect wallet
          </button>
          :

          <button
            className="text-xl text-black font-bold bg-yellow p-3 flex-col flex gap-5 w-full items-center text-center"
            onClick={() => handleConnectWallet()}
          >
            {isLoading && <Loader />}
            Connect wallet
          </button>

        }
      </>
    </div>
  )
}

export default Wallet
