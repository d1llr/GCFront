import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Logo from '../../../images/logo-game-center.svg'
import { setUser, useLoginRequestMutation } from '../User.slice';
import { NavLink, useNavigate } from 'react-router-dom';
import tokenService from '../../../services/token.service';
import { useAppDispatch } from '../../../app/hooks';
import { isApiResponse } from '../../../helpers/isApiResponse';
import Loader from '../../../helpers/Loader';



const Code = () => {

    type UserSubmitForm = {
        login: string;
        password: string;
    };
    console.log(process.env.NODE_ENV);

    const dispatch = useAppDispatch()

    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {
        setPasswordShown(prev => !prev);
    };
    const [
        loginUser, // This is the mutation trigger
        { isLoading, isSuccess, isError, isUninitialized, error }, // This is the destructured mutation result
    ] = useLoginRequestMutation()

    const validationSchema = Yup.object().shape({
        login: Yup.string()
            .required('Email is required')
            .min(6, 'Login must be at least 6 characters'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
            .max(40, 'Password must not exceed 40 characters'),
    });

    const validationSchemaCode = Yup.object().shape({
        code: Yup.string()
            .required('Code is required'),
    });

    const {
        register: registerCode,
        handleSubmit: handleSubmitCode
    } = useForm<{ code: string }>({
        resolver: yupResolver(validationSchemaCode)
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
        console.log(JSON.stringify(data, null, 2));
        await loginUser({
            username: data.login,
            password: data.password
        })
            .unwrap()
            .then(response => {
                tokenService.setUser(response)
                dispatch(setUser(true))
                navigate('/')
            })
    };

    return (
        <div className="w-full flex flex-col gap-4 justify-center items-center">
            <div className='w-fit p-3'>
                <img src={Logo} alt="Logotype" />
            </div>
            <div className='flex flex-col gap-4 items-center max-w-md w-full'>

                <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col p-2 gap-4 text-white mx-auto my-auto w-full`}>
                    <h1 className="text-2xl font-bold text-center font-orbitron mb-2">
                        Email confirmation code
                    </h1>

                    <div className="form-group flex flex-col">
                        <label className="text-center pb-6">
                            The code has been sent to you by email. If It’s been mising for a long time, check your spam folder.
                        </label>

                        <div className="invalid-feedback text-red-500 text-sm mb-2 mt-1.5">{errors.login?.message}</div>

                        <div className="flex flex-row justify-center items-center gap-[16px]">
                            {[...Array(4)].map(index => {
                                return <input
                                    key={index}
                                    maxLength={1}
                                    onKeyDown={(event) => {
                                        if (/[0-9]/.test(event.key)) {
                                            event.currentTarget.value = event.key
                                                (event?.currentTarget?.nextElementSibling as HTMLElement)?.focus()

                                        } else {
                                            event.preventDefault();
                                        }
                                    }}

                                    type="text"
                                    {...registerCode('code')}
                                    className={`
                                    form-control 
                                    focus:outline-0 
                                    focus:ring-transparent
                                    focus:border-rose-500
                                    ${errors.code ? 'is-invalid border border-rose-500' : 'border-none'}
                                    text-lg
                                    rounded-lg
                                    bg-inputGray
                                    p-2 px-3
                                    font-chakra
                                    w-[42px]
                                    h-[56px]
                                    text-center
                                `} />
                            })}

                        </div>

                    </div>

                    <div className="form-group flex flex-col pt-[16px]">
                        <label className="
                        text-center
                        ">
                            59 seconds left to get new code
                        </label>
                        <div className="invalid-feedback text-red-500 text-sm mb-2 mt-1.5" >{errors.password?.message}</div>
                    </div>


                    <div className="form-group mt-2">
                        <button type="submit" className="
                            text-center 
                            bg-yellow 
                            text-black 
                            w-full 
                            p-1 text-xl 
                            font-bold 
                            h-11 
                            border-none 
                            rounded-lg
                            lowercase
                            font-orbiton

                            hover:bg-hoverYellow
                            transition-all
                        ">
                            {isUninitialized && "Log in"}
                            {isLoading && <Loader />}
                            {isSuccess && 'Success'}
                            {isError && (isApiResponse(error) && [401, 402].includes(error.status) ? "Invalid login or password" : 'Server error, retry later')}
                        </button>
                    </div>
                </form>
                <div>
                    <h2 className='text-white text-xl hover:opacity-70 transition-all'>
                    </h2>
                    <h3 className='text-sm text-center text-urlGray hover:text-yellow transition-all'>
                    </h3>
                </div>
            </div>
        </div>);




}

export default Code;