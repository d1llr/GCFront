import { NavLink, useNavigate } from "react-router-dom"
import {
  removeWallet,
  useChangeUserDataMutation,
  useDeleteAccountMutation,
  useGetUserInfoQuery,
  useRefreshTokenMutation,
} from "./User.slice"
import tokenService from "../../services/token.service"
import Loader from "../../helpers/Loader"
import { useRemoveWalletMutation } from "../header/wallet/wallet.slice"
import Wallet from "../header/wallet/Wallet"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useAccount, useDisconnect } from "wagmi"
import pencil_icon from '../../images/icons/pencil.svg'

import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Modal } from 'flowbite-react';


const User = () => {
  const { isConnected } = useAccount()
  const navigate = useNavigate();
  const { disconnectAsync } = useDisconnect()
  const { data, isLoading, isError, error, refetch } = useGetUserInfoQuery(tokenService.getUser()?.id)
  const [changeUserData, { isError: changeUserDataIsError, isLoading: changeUserDataLoading, isSuccess: changeUserDataIsSuccess, isUninitialized: changeUserDataIsUninitialized, },] = useChangeUserDataMutation()
  const [deleteAccount, { isError: deleteAccountIsError, isLoading: deleteAccountLoading, isSuccess: deleteAccountIsSuccess, isUninitialized: deleteAccountIsUninitialized, },] = useDeleteAccountMutation()

  const [removeWalletApi, { isError: isErrorRemoveWallet, isLoading: isLoadingRemoveWallet, isSuccess, isUninitialized, },] = useRemoveWalletMutation()
  const wallet = useAppSelector((state) => state.UserSlice.wallet)
  const dispatch = useAppDispatch()
  const [mode, setMode] = useState<Mode>()
  const [openModal, setOpenModal] = useState(false);

  type UserSubmitForm = {
    name: string;
    login: string;
  };


  // if (isLoading) {
  //   return <Loader />
  // }

  enum Mode {
    changeEmail = "changeEmail",
    changePassword = "changePassword",
    changeUserData = "changeUserData",
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



  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required'),
    login: Yup.string()
      .required('Login is required')
      .min(6, 'Login must be at least 6 characters')
      .max(40, 'Login must not exceed 40 characters'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (data: UserSubmitForm) => {
    await changeUserData({
      name: data.name,
      username: data.login,
      id: tokenService.getUser()?.id
    })
      .unwrap()
      .then((responce) => {
        console.log(responce);
        setMode(undefined)
        refetch()
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handleDeleteAccount = async () => {
    await deleteAccount({
      email: tokenService.getUser().email
    })
      .unwrap()
      .then((responce) => {
        console.log(responce);
        tokenService.removeUser()
        navigate('/')
      })
      .catch(err => {
        console.log(err);

      })
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
              <button className="w-5 h-5" onClick={() => setMode(Mode.changeUserData)}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="yellow" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.684 3.95095L17.8609 2.75804C18.3244 2.28839 18.8746 1.91587 19.4801 1.66174C20.0857 1.4076 20.7346 1.27684 21.39 1.27692C22.0454 1.27699 22.6944 1.4079 23.2998 1.66217C23.9053 1.91644 24.4554 2.28909 24.9188 2.75885C25.3822 3.2286 25.7497 3.78626 26.0004 4.39998C26.2512 5.01371 26.3802 5.67148 26.3801 6.33574C26.38 6.99999 26.2509 7.65773 26 8.2714C25.7491 8.88507 25.3815 9.44264 24.918 9.91229L23.741 11.102M16.684 3.95095C16.684 3.95095 16.8315 6.48468 19.0363 8.71938C21.2412 10.9541 23.741 11.102 23.741 11.102M16.684 3.95095L5.87077 14.9106C5.13794 15.6534 4.77153 16.0231 4.45746 16.4331C4.08582 16.9159 3.76723 17.4382 3.50731 17.991C3.28683 18.4588 3.12345 18.9572 2.79511 19.9524L1.40717 24.1742L1.06931 25.2047C0.990109 25.445 0.978534 25.7029 1.03588 25.9495C1.09323 26.196 1.21723 26.4216 1.39397 26.6007C1.57072 26.7798 1.79321 26.9055 2.0365 26.9636C2.27979 27.0218 2.53424 27.01 2.77131 26.9298L3.78807 26.5873L7.95346 25.179C8.93533 24.8478 9.42705 24.6822 9.88864 24.4587C10.4343 24.1951 10.9498 23.8719 11.4257 23.4957C11.8302 23.1758 12.195 22.806 12.9278 22.0633L23.741 11.102" stroke="#6A6A6A" stroke-width="2" />

                </svg>
              </button>
            </div>
            {mode != Mode.changeUserData ?
              <>
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
                <div className="flex flex-row justify-between gap-2">
                  <NavLink to='changeEmail' className=" text-center text-white w-1/2 bg-customBlack hover:bg-customBlackHover p-3 rounded-xl text-base">
                    Change email
                  </NavLink>
                  <NavLink to='changePassword' className=" text-center text-base text-black w-1/2 bg-[#898989] hover:bg-lightGrayHover p-3 rounded-xl" >
                    Change password
                  </NavLink>
                </div>
              </> :
              <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-4 text-white mx-auto my-auto w-full`}>
                <div className="form-group flex flex-col">
                  <label className="text-2xl after:inline after:text-yellow after:font-beausans ">
                    Your name
                  </label>
                  <div className="invalid-feedback text-red-500 text-sm mb-1 mt-1">{errors.name?.message}</div>
                  <input
                    type="text"
                    {...register('name')}
                    className={`form-control focus:outline-0 focus:ring-transparent ${errors.name ? 'is-invalid border border-rose-500' : 'border-0 border-b-2 border-white'} text-lg bg-lightGray p-0 py-1 font-chakra`}
                    defaultValue={data?.name}
                  />
                </div>
                <div className="form-group flex flex-col">
                  <label className="text-2xl after:inline after:text-yellow after:font-beausans">
                    Login
                  </label>
                  <div className="invalid-feedback text-red-500 text-sm mb-1 mt-1">{errors.login?.message}</div>
                  <input
                    type="text"
                    {...register('login')}
                    className={`form-control focus:outline-0 focus:ring-transparent ${errors.login ? 'is-invalid border border-rose-500' : 'border-0 border-b-2 border-white'} text-lg bg-lightGray p-0 py-1 font-chakra`}
                    defaultValue={data?.username}
                  />
                </div>
                <div className="flex flex-row justify-between gap-2">
                  <button type='submit' className="text-white w-1/2 bg-customBlack hover:bg-customBlackHover p-3 rounded-xl text-base">
                    Save
                  </button>
                  <button className="text-base text-black w-1/2 bg-[#898989] hover:bg-lightGrayHover p-3 rounded-xl" onClick={() => setMode(undefined)}>
                    Cancel
                  </button>
                </div>
              </form>}
          </div>
          <div className="flex flex-col items-center p-8 bg-lightGray rounded-3xl text-white font-orbitron justify-center gap-5 w-1/3 h-fit">
            <div className="flex flex-row justify-between">
              <h2 className="text-yellow text-3xl">
                Delete an account
              </h2>
            </div>
            <button className=" text-center text-yellow w-1/2 bg-customBlack hover:bg-customBlackHover p-3 rounded-xl text-base" onClick={() => setOpenModal(true)}>
              Delete
            </button>
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup >
              <Modal.Header className=" bg-lightGray" />
              <Modal.Body className=" bg-lightGray text-white">
                <div className="text-center bg-lightGray">
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete your account?
                  </h3>
                  <h2>
                    The deleted account cannot be restored
                  </h2>
                  <div className="flex justify-center gap-4">
                    <button color="failure" onClick={() => handleDeleteAccount()}>
                      Delete
                    </button>
                    <button color="gray" onClick={() => setOpenModal(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
          {/* <div className="flex flex-col p-8 bg-lightGray rounded-3xl text-white font-orbitron gap-5 w-1/3">
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

          </div> */}
        </div>
      </div>
    </div>
  )
}

export default User
