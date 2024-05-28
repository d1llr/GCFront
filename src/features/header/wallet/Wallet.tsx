import { memo, useEffect, useRef, useState } from "react"
import Loader from "../../../helpers/Loader"
import tokenService from "../../../services/token.service"
import { removeWallet, setBalance, setWallet, useGetUserBalanceQuery, useRefreshTokenMutation } from "../../user/User.slice"
import {
  useCanIWithdrawMutation,
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
import { useIsTouchDevice } from "../../../helpers/detectMobileDevice"

// wagmi
import { bsc } from "@wagmi/core/chains"
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi"
import { changeChain } from "./meta/chainHelper"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { deposit, withdraw } from "./ChainInteractions"
import { supportedChain } from "./meta/chains"
import { useToast } from "@chakra-ui/react"
import { Modal, ModalFooter } from 'flowbite-react';

import { connect } from "../../../app/websocket/websocketSlice"
import { AppThunk } from "../../../app/store"
import { MessageType, Socket } from "../../../app/websocket/Socket"
import Button from "../../../helpers/Button"
import ConnectButtonMobile from "./ConnectButtonMobile"

enum Mode {
  recharge = "Recharge",
  withdraw = "Withdraw",
  switch = "Switch",
}

interface IWalletProps {
  padding: string
}


function useOutsideAlerter(ref: any) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        ref.current.classList.add
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
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

  const [availableToWithdraw, setAvailableToWithdraw] = useState<number>()
  const [commission, setCommision] = useState<number>()

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
  const [canIWithdraw, { isLoading: canIWithdrawLoading }] = useCanIWithdrawMutation()
  const navigate = useNavigate()
  const [refreshToken] = useRefreshTokenMutation()
  const isTouchDevice = useIsTouchDevice()
  const [RechargeBalance] = useRechargeBalanceMutation()
  const [WithdrawBalance, { isError: isErrorWithdrawBalance, error: errorWithdrawBalance },] = useWithdrawBalanceMutation()
  const isWindowFocused = useWindowFocus();
  const [removeWalletAPI] = useRemoveWalletMutation()


  // -------------------------------------- //

  type amountRecharge = { amountRecharge: number }
  type amountWithdrawal = { amountWithdrawal: number }

  const amountWithdrawalSchema = Yup.object().shape({
    amountWithdrawal: Yup.number()
      .required("Amount is required")
      .moreThan(49, "Min. amount = 50 PAC")
      .lessThan(availableToWithdraw!, 'Withdrawal amount above daily limit')
  })
  const amountRechargeSchema = Yup.object().shape({
    amountRecharge: Yup.number()
      .required("Amount is required")
  })

  const {
    register: amountRechargeRegister,
    handleSubmit: amountRechargeHandleSubmit,
    reset: amountRechargeReset,
    formState: { errors: amountRechargeErrors },
  } = useForm<amountRecharge>({
    resolver: yupResolver(amountRechargeSchema),
  })

  const {
    register: amountWithdrawalRegister,
    handleSubmit: amountWithdrawalHandleSumbit,
    reset: amountWithdrawalReset,
    formState: { errors: amountWithdrawalErrors },
  } = useForm<amountWithdrawal>({
    resolver: yupResolver(amountWithdrawalSchema),
  })

  // ---------------------------------- //

  const onSubmit = async (data: amountRecharge | amountWithdrawal) => {
    console.log(data);
    switch (mode) {
      case Mode.recharge:
        const dataRecharge = data as amountRecharge
        try {
          if (chain?.id !== bsc.id) {
            console.error("Selected chain is not supported")
            break
          }

          const result = (await deposit(dataRecharge.amountRecharge.toString())).status
          if (!result) {
            console.error("Transaction status: unfulfilled")
            break
          }

          await RechargeBalance({
            id: tokenService.getUser().id,
            amount: Number(dataRecharge.amountRecharge),
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
        const dataWithdrawal = data as amountWithdrawal

        try {
          if (chain?.id !== bsc.id) {
            console.error("Selected chain is not supported")
            break
          }

          // if (!neededAccount()) {
          //   console.error("Request denied")
          //   break
          // }

          const result = (await withdraw(dataWithdrawal.amountWithdrawal.toString())).status
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
      console.log(bsc);
      
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
      let error = (e as { message: string })?.message
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
              socket.send({ type: MessageType.auth, message: tokenService.getUser().id })

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
  const Theme = {
    "root": {
      "base": "fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
      "show": {
        "on": "flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80",
        "off": "hidden"
      },
      "sizes": {
        "sm": "max-w-sm",
        "md": "max-w-md",
        "lg": "max-w-lg",
        "xl": "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl"
      },
      "positions": {
        "top-left": "items-start justify-start",
        "top-center": "items-start justify-center",
        "top-right": "items-start justify-end",
        "center-left": "items-center justify-start",
        "center": "items-center justify-center",
        "center-right": "items-center justify-end",
        "bottom-right": "items-end justify-end",
        "bottom-center": "items-end justify-center",
        "bottom-left": "items-end justify-start"
      }
    },
    "content": {
      "base": "relative h-full w-full p-4 md:h-auto",
      "inner": "relative rounded-3xl bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh]"
    },
    "body": {
      "base": "flex-1 overflow-auto rounded-2xl",
      "popup": ""
    },
    "header": {
      "base": "flex bg-[#000] items-start justify-between rounded-t dark:border-gray-600 border-b p-5",
      "popup": "p-2 border-b-0",
      "title": "text-xl font-medium text-gray-900 dark:text-white",
      "close": {
        "base": "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
        "icon": "h-5 w-5 text-white"
      }
    },
    "footer": {
      "base": "flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600",
      "popup": "border-t"
    }
  }



  const wrapperRef = useRef<any>(null);
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsWalletOpen(prev => !prev)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);


  return account.isConnected ? (
    <div className="relative w-full">

      {!isWalletOpen ?
        <button
          className={`${isWalletOpen ? 'rounded_corner relative rounded-b-none' : 'hover:bg-hoverYellow'} ring-0 flex  flex-row items-center gap-2 px-4 font-orbitron font-extrabold w-full h-full text-customBlack bg-yellow w-36  text-base cursor-pointer rounded-[10px]`}
          onClick={() => setIsWalletOpen(prev => !prev)}
        >
          <div className="flex flex-row justify-center items-center gap-2 w-36">
            {balance &&
              <>
                <img src={walletImage} alt="wallet image" />
                <span>
                  {balance} PAC

                </span>
              </>
            }

          </div>
        </button>
        :
        <button
          className={`${isWalletOpen ? 'rounded_corner relative rounded-b-none' : 'hover:bg-hoverYellow'} ring-0 flex  flex-row items-center gap-2 px-4 font-orbitron font-extrabold w-full h-full text-customBlack bg-yellow w-36  text-base cursor-pointer rounded-[10px]`}
        >
          <div className="font-orbitron w-36 text-lg text-customBlack font-extrabold">Your balance</div>
        </button >
      }


      {isWalletOpen
        ?
        isTouchDevice ?
          <Modal dismissible show={isWalletOpen} theme={Theme} size="md" onClose={() => setIsWalletOpen(false)} popup className="bg-black opacity-1 bg-opacity-1 rounded-2xl" >
            <Modal.Header>

            </Modal.Header>
            <Modal.Body className=" bg-lightGray text-white font-orbitron ">
              <div className="wallet_container bg-gameLeftToRightShards bg-no-repeat bg-left-top absolute top-[3rem] right-0 w-96 bg-yellow flex flex-col items-end gap-4 p-5 rounded-[20px]">
                <img className="max-w-[62px]" src={walletPacLogo} alt="Wallet pac logo" />
                <div className="font-orbitron text-lg text-customBlack font-extrabold">Your balance</div>
                <div className="font-orbitron text-xl text-customBlack font-extrabold">{balance} PAC</div>
                <div className="flex flex-row w-full gap-4">
                  {
                    mode === Mode.withdraw &&
                    <form
                      onSubmit={amountWithdrawalHandleSumbit(onSubmit)}
                      className={` flex-col text-white ${wallet ? "flex" : "hidden"
                        } mx-auto my-auto w-full gap-2`}
                    >
                      <div className={`form-group flex-col ${mode ? "flex" : "hidden"} items-end`}>
                        <>

                          <label className="text-sm font-bold text-black float-right ">
                            Available to withdraw: <b className="text-black text-base">{availableToWithdraw}</b>
                          </label>

                          <div className={`form-control ${amountWithdrawalErrors.amountWithdrawal ? "is-invalid border-red-500" : ""} border-2 border-black bg-customBlack w-full px-1 rounded-lg flex flex-row items-center justify-between`} >
                            <span className="cursor-pointer text-white text-sm">PAC</span>

                            <input
                              {...amountWithdrawalRegister("amountWithdrawal")}
                              type="number"
                              className={`form-control focus:ring-0 border-0 focus:outline-none text-white ${amountWithdrawalErrors.amountWithdrawal ? "is-invalid" : ""} bg-customBlack p-1 border-none focus:outline-none text-end`}
                              placeholder="Amount"
                            />

                          </div>
                          <div className="invalid-feedback text-red-500 text-sm">
                            {amountWithdrawalErrors.amountWithdrawal?.message}
                          </div>
                          <>
                            <span className="text-black text-center font-bold w-full">
                              Withdrawal fee = {commission}%
                            </span>
                            <span className="text-sm text-black text-center opacity-2/3">
                              Withdrawals may take a long time, please wait at least 30 minutes
                            </span>

                          </>
                        </>
                      </div>
                      <div className="flex flex-row  gap-2">
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
                      </div>
                    </form>
                  }
                  {
                    mode === Mode.recharge &&
                    <form
                      onSubmit={amountRechargeHandleSubmit(onSubmit)}
                      className={` flex-col text-white ${wallet ? "flex" : "hidden"
                        } mx-auto my-auto w-full gap-2`}
                    >
                      <div className={`form-group flex-col ${mode ? "flex" : "hidden"} items-end`}>
                        <>
                          <div className={`form-control ${amountRechargeErrors.amountRecharge ? "is-invalid border-red-500" : ""} border-2 border-black bg-customBlack w-full px-1 rounded-lg flex flex-row items-center justify-between`} >
                            <span className="cursor-pointer text-white text-sm">PAC</span>
                            <input
                              {...amountRechargeRegister("amountRecharge")}
                              type="number"
                              className={`form-control focus:ring-0 border-0 focus:outline-none text-white ${amountRechargeErrors.amountRecharge ? "is-invalid" : ""} bg-customBlack p-1 border-none focus:outline-none text-end`}
                              placeholder="Amount"
                            />

                          </div>
                          <div className="invalid-feedback text-red-500 text-sm">
                            {amountRechargeErrors.amountRecharge?.message}
                          </div>
                        </>
                      </div>
                      <div className="flex flex-row  gap-2">
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
                      </div>
                    </form>
                  }
                  {
                    mode === undefined &&
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
                            onClick={() => {
                              amountRechargeReset()
                              amountWithdrawalReset()
                              setMode(Mode.recharge)
                            }}
                          >
                            {Mode.recharge}
                          </button>
                          <button
                            className={"w-full bg-lightGray py-2 text-white rounded-lg hover:bg-lightGrayHover"}
                            onClick={async () => {
                              amountRechargeReset()
                              amountWithdrawalReset()
                              setMode(Mode.withdraw)
                              await canIWithdraw({ id: tokenService?.getUser().id })
                                .unwrap()
                                .then(res => {

                                  setAvailableToWithdraw(res.AvailableToWithdraw)
                                  setCommision(res.commision)
                                })
                            }}
                          >
                            {Mode.withdraw}
                          </button>
                        </>
                      )}
                    </div>
                  }
                </div>


              </div>
            </Modal.Body>
          </Modal>
          :
          <div ref={wrapperRef} className="wallet_container bg-gameLeftToRightShards bg-no-repeat bg-left-top absolute top-[3rem] right-0 w-96 bg-yellow flex flex-col items-end gap-4 p-5 rounded-[20px] rounded-tr-none">
            <img className="max-w-[62px]" src={walletPacLogo} alt="Wallet pac logo" />
            <div className="font-orbitron text-xl text-customBlack font-extrabold">{balance} PAC</div>
            {canIWithdrawLoading ?
              <div className="w-full h-full flex justify-center items-center">
                <Loader text_color="text-black" />
              </div>
              :
              <div className="flex flex-row w-full gap-4">
                {
                  mode === Mode.withdraw &&
                  <form
                    onSubmit={amountWithdrawalHandleSumbit(onSubmit)}
                    className={` flex-col text-white ${wallet ? "flex" : "hidden"
                      } mx-auto my-auto w-full gap-2`}
                  >
                    <div className={`form-group flex-col ${mode ? "flex" : "hidden"} items-end`}>
                      <>

                        <label className="text-sm font-bold text-black float-right ">
                          Available to withdraw: <b className="text-black text-base">{availableToWithdraw}</b>
                        </label>

                        <div className={`form-control ${amountWithdrawalErrors.amountWithdrawal ? "is-invalid border-red-500" : ""} border-2 border-black bg-customBlack w-full px-1 rounded-lg flex flex-row items-center justify-between`} >
                          <span className="cursor-pointer text-white text-sm">PAC</span>

                          <input
                            {...amountWithdrawalRegister("amountWithdrawal")}
                            type="number"
                            className={`form-control focus:ring-0 border-0 focus:outline-none text-white ${amountWithdrawalErrors.amountWithdrawal ? "is-invalid" : ""} bg-customBlack p-1 border-none focus:outline-none text-end`}
                            placeholder="Amount"
                          />

                        </div>
                        <div className="invalid-feedback text-red-500 text-sm">
                          {amountWithdrawalErrors.amountWithdrawal?.message}
                        </div>
                        <>
                          <span className="text-black text-center font-bold w-full">
                            Withdrawal fee = {commission}%
                          </span>
                          <span className="text-sm text-black text-center opacity-2/3">
                            Withdrawals may take a long time, please wait at least 30 minutes
                          </span>

                        </>
                      </>
                    </div>
                    <div className="flex flex-row  gap-2">
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
                    </div>
                  </form>
                }
                {
                  mode === Mode.recharge &&
                  <form
                    onSubmit={amountRechargeHandleSubmit(onSubmit)}
                    className={` flex-col text-white ${wallet ? "flex" : "hidden"
                      } mx-auto my-auto w-full gap-2`}
                  >
                    <div className={`form-group flex-col ${mode ? "flex" : "hidden"} items-end`}>
                      <>
                        <div className={`form-control ${amountRechargeErrors.amountRecharge ? "is-invalid border-red-500" : ""} border-2 border-black bg-customBlack w-full px-1 rounded-lg flex flex-row items-center justify-between`} >
                          <span className="cursor-pointer text-white text-sm">PAC</span>
                          <input
                            {...amountRechargeRegister("amountRecharge")}
                            type="number"
                            className={`form-control focus:ring-0 border-0 focus:outline-none text-white ${amountRechargeErrors.amountRecharge ? "is-invalid" : ""} bg-customBlack p-1 border-none focus:outline-none text-end`}
                            placeholder="Amount"
                          />

                        </div>
                        <div className="invalid-feedback text-red-500 text-sm">
                          {amountRechargeErrors.amountRecharge?.message}
                        </div>
                      </>
                    </div>
                    <div className="flex flex-row  gap-2">
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
                    </div>
                  </form>
                }
                {
                  mode === undefined &&
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
                          onClick={() => {
                            amountRechargeReset()
                            amountWithdrawalReset()
                            setMode(Mode.recharge)
                          }}
                        >
                          {Mode.recharge}
                        </button>
                        <button
                          className={"w-full bg-lightGray py-2 text-white rounded-lg hover:bg-lightGrayHover"}
                          onClick={async () => {
                            amountRechargeReset()
                            amountWithdrawalReset()
                            setMode(Mode.withdraw)
                            await canIWithdraw({ id: tokenService?.getUser().id, subscription_id: tokenService?.getUser().subscribe })
                              .unwrap()
                              .then(res => {

                                setAvailableToWithdraw(res.AvailableToWithdraw)
                                setCommision(res.commision)
                              })
                          }}
                        >
                          {Mode.withdraw}
                        </button>
                      </>
                    )}
                  </div>
                }


              </div>

            }


          </div >
        : ''}
    </div >
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
        // <Button 
        //     content="Connect wallet" 
        //     buttonStyle="yellow"
        //     type="submit"

        //     fontSize="text-[18px] leading-[22px] max-[920px]:text-[16px] max-[920px]:leading-[20px]" 
        //     padding="py-2 px-3"
        //     textColor="text-customBlack" 
        //     rounded="rounded-[8px]" 
        //     maxSizes="min-h-[48px] max-[600px]:min-h-[44px]"

        //     loading={`${isLoading && 'true'}`}//true 
        //     // loading=""//true 
        //     disabled="" //disabled

        //     onClick={() => handleConnectWallet()}
        //     >
        // </Button>

        <>
          {/* {useIsTouchDevice() ?
            <ConnectButtonMobile />
            : */}
          <button
            className={`yellow_btn px-4 ${props.padding} text-base rounded-[10px] max-[920px]:text-[16px]`}
            onClick={() => handleConnectWallet()}
          >
            {isLoading && <Loader />}
            Connect wallet
          </button>
          {/* } */}
        </>
      )
      }
    </div >

  )
})

export default Wallet
