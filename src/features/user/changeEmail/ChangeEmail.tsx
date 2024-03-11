import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Logo from '../../../images/logo-game-center.svg'
import { setUser, useChangeEmailMutation, useChangePasswordMutation, useLoginRequestMutation, useSendCodeMutation } from '../User.slice';
import { useEffect, useState } from 'react';
import Code from '../../../helpers/Code';
import SuccessAction from '../../../helpers/SuccessAction';
import { preview } from 'vite';
import tokenService from '../../../services/token.service';
import { useAppDispatch } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';


export type email = {
    email: string,
    password?: string
};




const ChangeEmail = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const [SendCode, { isLoading: SendCodeLoading, isSuccess: SendCodeSuccess, isError: SendCodeIsError, isUninitialized: SendCodeUninitialized, error: SendCodeError }] = useSendCodeMutation()
    const [changePassword, { isLoading: changePasswordLoading, isSuccess: changePasswordSuccess, isError: changePasswordIsError, isUninitialized: changePasswordIsUninitialized, error: changePasswordError }] = useChangePasswordMutation()
    const [changeEmail, { isLoading: changeEmailLoading, isSuccess: changeEmailSuccess, isError: changeEmailIsError, isUninitialized: changeEmailIsUninitialized, error: changeEmailError }] = useChangeEmailMutation()

    const [loginUser, { isLoading: LoginUserLoading, isSuccess: LoginUserSuccess, isError: LoginUserIsError, isUninitialized: LoginUserIsUninitialized, error: LoginUserError },] = useLoginRequestMutation()

    const [user, setUserData] = useState<email>()
    const [checkingResultOld, setCheckingResultOld] = useState<boolean>()
    const [checkingResultNew, setCheckingResultNew] = useState<boolean>()
    const [stage, setStage] = useState<number>(1)

    useEffect(() => {
        if (checkingResultOld) {
            setStage(2)
        }
    }, [checkingResultOld])

    useEffect(() => {
        if (checkingResultNew) {
            changeEmail({
                email: user?.email,
                id: tokenService?.getUser()?.id
            })
                .unwrap()
                .then((responce) => {
                    setStage(4)
                    tokenService.setEmail(user?.email)
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [checkingResultNew])


    useEffect(() => {
        if (SendCodeUninitialized) {
            if (tokenService?.getUser()) {
                setUserData({ email: tokenService?.getUser()?.email })
                SendCode({
                    email: tokenService?.getUser()?.email,
                })
                    .unwrap()
                    .then(responce => {
                        console.log(responce);
                        setStage(1)
                    })
                    .catch(err => {
                        console.log(err);

                    })
            }
            else {
                navigate("/user")
            }
        }
    }, [])

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .email('Email is invalid'),
    });



    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<email>({
        resolver: yupResolver(validationSchema)
    });



    const onSubmit = async (data: email) => {
        setUserData({ email: data.email })
        await SendCode({
            email: data.email,
        })
            .unwrap()
            .then(responce => {
                console.log(responce);
                setStage(3)
            })
            .catch(err => {
                console.log(err);

            })

    };




    const onButtonLogIn = async () => {
        navigate('/user')
    }



    const getStage = (id: number) => {
        switch (id) {
            case 1:
                return <>
                    <span className={`w-10 h-10 flex items-center ${stage >= id ? 'bg-yellow' : 'bg-lightGray'}  rounded-full justify-center text-2xl font-bold p-5`}>{id}</span>
                    <span className={`w-2/4 h-[2px] bg-lightGray  ${stage == id && 'bg-gradient-to-r from-20%'} ${stage > id && 'bg-gradient-to-r from-100%'} from-yellow to-lightGray to-60%`}></span>
                </>
            case 2:
                return <>
                    <span className={`w-10 h-10 flex items-center ${stage >= id ? 'bg-yellow' : 'bg-lightGray'}  rounded-full justify-center text-2xl font-bold p-5`}>{id}</span>
                    <span className={`w-2/4 h-[2px] bg-lightGray ${stage == id && 'bg-gradient-to-r from-20%'} ${stage > id && 'bg-gradient-to-r from-100%'} from-yellow to-lightGray to-60%`}></span>
                </>
            case 3:
                return <>
                    <span className={`w-10 h-10 flex items-center ${stage >= id ? 'bg-yellow' : 'bg-lightGray'}  rounded-full justify-center text-2xl font-bold p-5`}>{id}</span>
                    <span className={`w-2/4 h-[2px] bg-lightGray ${stage == id && 'bg-gradient-to-r from-20%'} ${stage > id && 'bg-gradient-to-r from-100%'} from-yellow to-lightGray to-60%`}></span>
                </>
            case 4:
                return <>
                    <span className={`w-10 h-10 flex items-center ${stage >= id ? 'bg-yellow' : 'bg-lightGray'}  rounded-full justify-center text-2xl font-bold p-5`}>{id}</span>
                </>
        }
    }


    const switcher = () => {
        switch (stage) {
            case 1:
                return (
                    user && <Code userProps={user} setCheckingResult={setCheckingResultOld} h1='The code has been sent to you by current email. If It’s been mising for a long time, check your spam folder.' />
                )
            case 2:
                return (
                    <>
                        <div>
                            <h1 className="text-2xl font-bold text-center font-orbitron mb-2">
                                Your email address
                            </h1>
                            <h2 className='text-sm font-bold text-center font-orbitron'>
                                Specify your email address to which the account is registered
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col p-7 gap-4 border-none text-white mx-auto my-auto w-full`}>

                            <div className="form-group flex flex-col">
                                <label className="text-md after:content-['*'] after:inline after:text-yellow after:font-beausans mb-1">Email</label>
                                <div className="invalid-feedback text-red-500 text-sm mb-2">{errors.email?.message}</div>
                                <input
                                    type="text"
                                    {...register('email')}
                                    className={` ${errors.email ? 'is-invalid border border-rose-500' : 'border-none'} form-control  focus:outline-0  focus:ring-transparent focus:border-rose-500 text-lg rounded-lg bg-lightGray p-2 px-3 font-chakra `}
                                    placeholder='Email'
                                />
                            </div>
                            <button type="submit" className={`text-center bg-yellow ${SendCodeLoading && 'button_loading'} text-black w-full p-1 text-xl font-bold h-11 border-none rounded-lg font-orbiton hover:bg-hoverYellow transition-al`}>
                                Continue
                            </button>
                        </form>
                    </>
                )

            case 3:
                return (
                    user && <Code userProps={user} setCheckingResult={setCheckingResultNew} h1='The code has been sent to you by new email. If It’s been mising for a long time, check your spam folder.' />
                )

            case 4:
                return (
                    <SuccessAction h1='The email has been updated' button='Accept' buttonAction={onButtonLogIn} />
                )

            default:
                break;
        }
    }
    return (
        <div className="w-full flex flex-col gap-4 justify-center items-center">
            <div className='w-fit p-3'>
                <img src={Logo} alt="Logotype" />
            </div>
            <div className='flex flex-col gap-4 items-center max-w-md w-full text-white'>

                <div className='flex flex-row items-center w-full text-black'>
                    {getStage(1)}
                    {getStage(2)}
                    {getStage(3)}
                    {getStage(4)}
                </div>

                {switcher()}

            </div>
        </div >
    )

}

export default ChangeEmail