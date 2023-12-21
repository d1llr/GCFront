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
import { useDisconnect } from "wagmi"

const User = () => {
  const { disconnectAsync } = useDisconnect()
  const { data, isLoading, isError, error, refetch } = useGetUserInfoQuery(
    tokenService.getUser().id,
  )
  const [
    removeWalletApi,
    {
      isError: isErrorRemoveWallet,
      isLoading: isLoadingRemoveWallet,
      isSuccess,
      isUninitialized,
    },
  ] = useRemoveWalletMutation()
  const wallet = useAppSelector((state) => state.UserSlice.wallet)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [refreshToken] = useRefreshTokenMutation()
  useEffect(() => {
    refreshToken(tokenService.getLocalRefreshToken())
      .unwrap()
      .then((response) => {
        tokenService.updateLocalAccessToken(response.accessToken)
        tokenService.updateLocalRefreshToken(response.refreshToken)
        refetch()
      })
      .catch((err) => {
        switch (err.status) {
          case 422 && 421:
            navigate("/login")
            break
        }
      })
  }, [isError])
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
    <div className="flex flex-col gap-9">
      <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
        My account
      </h2>
      <div className="flex flex-col gap-2 max-w-lg">
        <div className="flex flex-col text-white w-full">
          <h3 className="text-sm">Your name</h3>
          <span className="px-3  py-2 border-yellow border-2">
            {data?.name}
          </span>
        </div>
        <div className="flex flex-col text-white w-full">
          <h3 className="text-sm">Email</h3>
          <span className="px-3  py-2 border-yellow border-2">
            {data?.email}
          </span>
        </div>
        <div className="flex flex-col text-white w-full">
          <h3 className="text-sm">Login</h3>
          <span className="px-3  py-2 border-yellow border-2">
            {data?.username}
          </span>
        </div>
        <div className="flex flex-col text-white w-full">
          <h3 className="text-sm">Wallet</h3>
          <span className="px-3 py-2 border-yellow border-2">
            {tokenService.getWallet() ?? "Wallet isnt connected"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-5 max-w-lg">
        <div className="bg-yellow p-3 flex-col flex gap-5 w-full">
          <Wallet />
        </div>
        <button
          className={`w-full text-black text-center bg-yellow p-4 font-bold ${
            !wallet && "d-none"
          }`}
          onClick={() => handleRemoveWallet()}
        >
          {wallet && "Disconnect wallet"}
          {isLoadingRemoveWallet && <Loader />}
        </button>
      </div>
    </div>
  )
}

export default User
