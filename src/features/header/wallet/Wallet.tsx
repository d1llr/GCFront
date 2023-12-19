import { useState } from "react";
import Loader from "../../../helpers/Loader";
import tokenService from "../../../services/token.service";
import { setBalance, setWallet, useRefreshTokenMutation } from "../../user/User.slice";
import { useConnectWalletMutation, useRechargeBalanceMutation, useWithdrawBalanceMutation } from "./wallet.slice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import IWallet from "./wallet.type";
import { isApiResponse } from "../../../helpers/isApiResponse";


enum Mode {
    recharge = "Recharge",
    withdraw = "Withdraw",
}

const Wallet = () => {
    const wallet = useAppSelector(state => state.UserSlice.wallet)
    const balance = useAppSelector(state => state.UserSlice.balance)
    const [mode, setMode] = useState<Mode>()
    const dispatch = useAppDispatch()
    const [connectWallet, { isError, isLoading, isSuccess, isUninitialized }] = useConnectWalletMutation()
    type UserSubmitForm = {
        amount: number
    };

    const [
        RechargeBalance, // This is the mutation trigger
        { isLoading: LoadingBalance, isSuccess: SuccessBalance, isError: isErrorBalance, isUninitialized: UninitializedBalance, error }, // This is the destructured mutation result
    ] = useRechargeBalanceMutation()
    const [
        WithdrawBalance, // This is the mutation trigger
        { isLoading: LoadingWithdrawBalance, isSuccess: SuccessWithdrawBalance, isError: isErrorWithdrawBalance, error: errorWithdrawBalance, isUninitialized: UninitializedWithdrawBalance }, // This is the destructured mutation result
    ] = useWithdrawBalanceMutation()

    const validationSchema = Yup.object().shape({
        amount: Yup.number()
            .required('Email is required')
            .moreThan(0, 'Cant be 0')
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UserSubmitForm>({
        resolver: yupResolver(validationSchema)
    });

    const navigate = useNavigate();
    const onSubmit = async (data: UserSubmitForm) => {
        switch (mode) {
            case Mode.recharge:
                await RechargeBalance({
                    id: tokenService.getUser().id,
                    amount: data.amount
                })
                    .unwrap()
                    .then((response: IWallet) => {
                        dispatch(setBalance(response.balance))
                        tokenService.setBalance(response.balance)
                    })

                break;

            case Mode.withdraw:
                await WithdrawBalance({
                    id: tokenService.getUser().id,
                    amount: data.amount
                })
                    .unwrap()
                    .then((response: IWallet) => {
                        dispatch(setBalance(response.balance))
                        tokenService.setBalance(response.balance)
                    })
                    .catch(err => {

                    })

                break;
        }
    };




    async function handleConnectWallet(): Promise<void> {
        await connectWallet({
            id: tokenService.getUser().id,
            wallet: 'TESTWALLETTESTWALLETTESTWALLETTESTWALLET'
        })
            .then(response => {
                tokenService.setWallet('TESTWALLETTESTWALLETTESTWALLETTESTWALLET')
                dispatch(setWallet('TESTWALLETTESTWALLETTESTWALLETTESTWALLET'))
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        wallet ?
            <>
                <span className='text-black text-xl font-bold'>
                    Your game balance
                </span>
                <span className='text-black self-end font-bold text-xl'>
                    {balance}
                </span>
                <form onSubmit={handleSubmit(onSubmit)} className={` flex-col text-white ${mode ? 'flex' : "d-none"} mx-auto my-auto w-full gap-2`}>
                    <div className="form-group flex flex-col">
                        <label className='text-sm text-black'>Amount<b className='text-black'>*</b></label>
                        <div className={`form-control ${errors.amount ? 'is-invalid border-red-500' : ''} border-2 border-black bg-inherit p-1 px-3 flex flex-row items-center justify-between`}>
                            <input
                                {...register('amount')}
                                className={`form-control focus:outline-none ${errors.amount ? 'is-invalid' : ''} bg-inherit border-none focus:outline-none`}
                                placeholder='Amount'
                            />
                            <i className='cursor-pointer text-black'>
                                pac
                            </i>
                        </div>
                        <div className="invalid-feedback text-red-500 text-sm" >{errors.amount?.message}</div>
                    </div>
                    <div className='form-group w-full flex flex-row justify-between gap-2'>
                        {
                            mode === Mode.recharge && <>
                                <button className='bg-black p-1 w-full border-black text-sm text-white font-bold' onClick={() => setMode(undefined)}>
                                    Cancel
                                </button>
                                <button type='submit' className='bg-inherit p-1 w-full border-2 border-black text-black font-bold'>
                                    {Mode.recharge}
                                </button>
                            </>
                        }
                        {
                            mode === Mode.withdraw && <>
                                <button className='bg-black p-1 w-full border-black text-sm text-white font-bold' onClick={() => setMode(undefined)}>
                                    Cancel
                                </button>
                                <button type='submit' className='bg-inherit p-1 w-full border-2 border-black text-black font-bold'>
                                    {Mode.withdraw}
                                </button>
                            </>
                        }
                    </div >
                </form>
                <div className="invalid-feedback text-red-500 text-sm" >{isErrorWithdrawBalance && isApiResponse(errorWithdrawBalance) && errorWithdrawBalance.data.message}</div>

                <div className={`form-group w-full ${mode ? 'd-none' : 'flex'} flex-row justify-between gap-2`}>
                    <button className='bg-black p-1 w-full border-black text-sm text-white font-bold' onClick={() => setMode(Mode.recharge)}>
                        {Mode.recharge}
                    </button>
                    <button className='bg-inherit p-1 w-full border-2 border-black text-black font-bold' onClick={() => setMode(Mode.withdraw)}>
                        {Mode.withdraw}
                    </button>
                </div>
            </> : <>
                <button className="text-xl text-black font-bold" onClick={() => handleConnectWallet()}>
                    {isLoading && <Loader />}
                    {!wallet && 'Connect wallet'}
                </button>
            </>
    );
}

export default Wallet;