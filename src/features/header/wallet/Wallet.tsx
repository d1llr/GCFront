import { memo, useEffect, useState } from "react"
import Loader from "../../../helpers/Loader"
import tokenService from "../../../services/token.service"
import { removeWallet, setBalance, setWallet, useGetUserBalanceQuery, useRefreshTokenMutation } from "../../user/User.slice"
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
import useWindowFocus from 'use-window-focus';
import walletImage from '../../../images/icons/wallet.svg'
import walletPacLogo from '../../../images/icons/pac-logo-wallet.svg'

// wagmi
import { bsc } from "@wagmi/core/chains"
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi"
import { changeChain } from "./meta/chainHelper"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { deposit, withdraw } from "./ChainInteractions"
import { supportedChain } from "./meta/chains"
import { useToast } from "@chakra-ui/react"
import { connect } from "../../../app/websocket/websocketSlice"
import { AppThunk } from "../../../app/store"
import { MessageType, Socket } from "../../../app/websocket/Socket"

enum Mode {
  recharge = "Recharge",
  withdraw = "Withdraw",
  switch = "Switch",
}

interface IWalletProps {
  padding: string
}

const Wallet = memo((props: IWalletProps) => {
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
  const { data: BalanceData, isError: BalanceError, isLoading: BalanceLoading, isSuccess: BalanceSuccess } = useGetUserBalanceQuery(tokenService.getUser()?.id)



  const [mode, setMode] = useState<Mode>()
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const [connectWallet, { isLoading }] = useConnectWalletMutation()

  type UserSubmitForm = { amount: number }

  const [RechargeBalance] = useRechargeBalanceMutation()
  const [WithdrawBalance, { isError: isErrorWithdrawBalance, error: errorWithdrawBalance },] = useWithdrawBalanceMutation()

  const isWindowFocused = useWindowFocus();

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

          // if (!neededAccount()) {
          //   console.error("Request denied")
          //   break
          // }

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

  useEffect(() => {
    if (BalanceData) {
      tokenService.setBalance(Number(BalanceData))
      dispatch(setBalance(Number(BalanceData)))
    }
  }, [BalanceSuccess])


  const navigate = useNavigate()
  const [refreshToken] = useRefreshTokenMutation()



  useEffect(() => {
    refreshToken(tokenService.getLocalRefreshToken())
      .unwrap()
      .then(async (response) => {
        const socket = new Socket()
        socket.connect(import.meta.env.VITE_WSBACKEND_URL)

        // socket.on('open', (event: any) => {
        //     socket.send('A message')
        //     console.log('You say hello...')
        // })

        socket.on('message', (event: any) => {
          const message = JSON.parse(event.data)
          console.log('got new message');
          switch (message.type) {
            case 'balance':

              dispatch(setBalance(message.message))
              tokenService.setBalance(message.message)
              break;
            case 'connect':
              socket.send({ type: 'auth', message: tokenService.getUser().id })

            default:
              break;
          }
        })
        tokenService.updateLocalAccessToken(response.accessToken)
        tokenService.updateLocalRefreshToken(response.refreshToken)
      })
      .catch((err) => {
        console.log(err);
        // navigate("/login")
      })
  }, [])

  const connectWebSocket = (): AppThunk => (dispatch, getState) => {
    // Здесь используем redux-thunk для отправки действия 'websocket/connect'
    dispatch({ type: 'websocket/connect' });
  };

  return account.isConnected ? (
    <div className="relative">

      <button
        className={`${isWalletOpen ? 'rounded_corner relative rounded-b-none' : ''} ring-0 flex flex-row items-center gap-2 px-4 font-orbitron font-extrabold w-full h-full text-customBlack bg-yellow text-base cursor-pointer rounded-[10px]`} onClick={() => setIsWalletOpen(prev => !prev)}
      >
        {isWalletOpen
          ? ``
          : <img src={walletImage} alt="wallet image" />
        }
        {isWalletOpen
          ? <div className="font-orbitron text-lg text-customBlack font-extrabold">Your balance</div>
          : `${balance} PAC`
        }
      </button >
      {isWalletOpen
        ?
        <div className="wallet_container bg-gameLeftToRightShards bg-no-repeat bg-left-top absolute top-[3rem] right-0 w-96 bg-yellow flex flex-col items-end gap-4 p-5 rounded-[20px] rounded-tr-none">
          <img className="max-w-[62px]" src={walletPacLogo} alt="Wallet pac logo" />
          <div className="font-orbitron text-xl text-customBlack font-extrabold">{balance} PAC</div>
          <div className="flex flex-row w-full gap-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={` flex-col text-white ${wallet ? "flex" : "hidden"
                } mx-auto my-auto w-full gap-2`}
            >
              <div className={`form-group flex-col ${mode ? "flex" : "hidden"} items-end`}>
                <label className="text-sm font-bold text-black float-right ">
                  Amount
                </label>
                <div className={`form-control ${errors.amount ? "is-invalid border-red-500" : ""} border-2 border-black bg-customBlack w-full px-1 rounded-lg flex flex-row items-center justify-between`} >
                  <span className="cursor-pointer text-white text-sm">PAC</span>
                  <input
                    {...register("amount")}
                    type="number"
                    className={`form-control focus:ring-0 border-0 focus:outline-none text-white ${errors.amount ? "is-invalid" : ""} bg-customBlack p-1 border-none focus:outline-none text-end`}
                    placeholder="Amount"
                  />
                </div>
                <div className="invalid-feedback text-red-500 text-sm">
                  {errors.amount?.message}
                </div>
                <div className="invalid-feedback text-red-500 text-sm" >
                  {isErrorWithdrawBalance &&
                    isApiResponse(errorWithdrawBalance) &&
                    errorWithdrawBalance.data.message}
                </div>
              </div>
              {wallet && (
                <div className="form-group w-full flex flex-row justify-between gap-2">
                  {mode === Mode.recharge ? (
                    <>
                      <button
                        className="w-full bg-lightGray py-2 text-white rounded-lg hover:bg-lightGrayHover"
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
                          className="w-full bg-customBlack py-2 text-yellow rounded-lg hover:bg-customBlackHover"
                        >
                          {Mode.recharge}
                        </button>
                      )}
                    </>
                  ) : mode === Mode.withdraw ? (
                    <>
                      <button
                        className="w-full bg-lightGray py-2 text-white rounded-lg hover:bg-lightGrayHover"
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
                          className="w-full bg-customBlack py-2 text-yellow rounded-lg hover:bg-customBlackHover"
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
                            className="w-full bg-customBlack py-2 text-yellow rounded-lg hover:bg-customBlackHover"
                            onClick={() => setMode(Mode.recharge)}
                          >
                            {Mode.recharge}
                          </button>
                          <button
                            className={"w-full bg-lightGray py-2 text-white rounded-lg hover:bg-lightGrayHover"}
                            onClick={() => {
                              setMode(Mode.withdraw)
                            }}
                          >
                            {Mode.withdraw}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
              <span className="text-sm text-black text-center opacity-2/3">
                Withdrawals may take a long time, please wait at least 30 minutes
              </span>
            </form>
          </div>


        </div>
        : ''
      }
    </div>
  ) : (
    <div className="max-[920px]:w-full">
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
          className={`yellow_btn px-8 ${props.padding} text-base rounded-[10px] max-[920px]:text-[16px]`}
          onClick={() => handleConnectWallet()}
        >
          {isLoading && <Loader />}
          Connect wallet
        </button>
      )}
    </div>

  )
})

export default Wallet
