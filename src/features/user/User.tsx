import { useNavigate } from "react-router-dom"
import {
  removeWallet,
  useGetUserInfoQuery,
  useRefreshTokenMutation,
} from "./User.slice"
import tokenService from "../../services/token.service"
import { useEffect } from "react"
import Loader from "../../helpers/Loader"
import { useRemoveWalletMutation } from "../header/wallet/wallet.slice"
import Wallet from "../header/wallet/Wallet"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useAccount, useDisconnect } from "wagmi"
import pencil_icon from '../../images/icons/pencil.svg'
const User = () => {
  const { isConnected } = useAccount()
  const { disconnectAsync } = useDisconnect()
  const { data, isLoading, isError, error, refetch } = useGetUserInfoQuery(tokenService.getUser()?.id)
  const [removeWalletApi, { isError: isErrorRemoveWallet, isLoading: isLoadingRemoveWallet, isSuccess, isUninitialized, },] = useRemoveWalletMutation()
  const wallet = useAppSelector((state) => state.UserSlice.wallet)
  const dispatch = useAppDispatch()
  if (isLoading) {
    return <Loader />
  }

  async function handleRemoveWallet(): Promise<void> {
    await handleDisconnect()
    await removeWalletApi({
      id: tokenService.getUser().id,
    })
      .then((response) => {
        dispatch(removeWallet())
        tokenService.setWallet(null)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleDisconnect = async () => {
    await disconnectAsync()
  }

  return (
    <div className="background-image-black">
      <div className="wrapper-content">
        <h1 className="font-orbitron w-fit text-yellow text-8xl font-extrabold">My account</h1>
        <div className="flex flex-row gap-4 w-full mt-10">
          <div className="flex flex-col p-8 bg-lightGray rounded-3xl text-white gap-5 font-orbitron font-bold w-1/3">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-yellow text-3xl">
                Your data
              </h2>
              <span className="w-5 h-5">
                <img src={pencil_icon} alt="pencil" />
              </span>
            </div>
            <div className="flex flex-row justify-between text-2xl">
              <span>
                Your name
              </span>
              <span className="font-chakra font-normal">
                {data?.name}
              </span>
            </div>
            <div className="flex flex-row justify-between">
              <span>
                Email
              </span>
              <span className="font-chakra font-normal">
                {data?.email}
              </span>
            </div>
            <div className="flex flex-row justify-between">
              <span>
                Login
              </span>
              <span className="font-chakra font-normal">
                {data?.username}
              </span>
            </div>
            <div className="flex flex-row justify-between">
              <span>
                Password
              </span>
              <span className="font-chakra font-normal">
                **************
              </span>
            </div>
          </div>

          <div className="flex flex-col p-8 bg-lightGray rounded-3xl text-white font-orbitron gap-5 w-1/3">
            <div className="flex flex-row justify-between">
              <h2 className="text-yellow text-3xl">
                2FA
              </h2>

            </div>
            <div className="flex flex-row justify-between text-2xl">
              <span>
                Status
              </span>
              <span className="font-chakra font-normal">
                Enabled
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default User
