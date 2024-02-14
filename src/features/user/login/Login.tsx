import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Logo from '../../../images/logo.svg'
import { setUser, useLoginRequestMutation } from '../User.slice';
import { NavLink, useNavigate } from 'react-router-dom';
import tokenService from '../../../services/token.service';
import { useAppDispatch } from '../../../app/hooks';
import { isApiResponse } from '../../../helpers/isApiResponse';
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import Loader from '../../../helpers/Loader';



const Login = () => {

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
        <div className="w-full flex flex-col gap-20 justify-center items-center">
            <div className='w-fit p-3'>
                <img src={Logo} alt="Logotype" />
            </div>
            <div className='flex flex-col items-center gap-5'>

                <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col p-7 gap-4 border-2 ${isError ? 'border-red-500' : 'border-yellow'} text-white mx-auto my-auto w-96`}>
                    <h1 className="text-3xl text-center">
                        Log in to the system
                    </h1>

                    <div className="form-group flex flex-col">
                        <label className='text-sm'>Login<b className='text-yellow'>*</b></label>
                        <input
                            type="text"
                            {...register('login')}
                            className={`form-control focus:outline-none ${errors.login ? 'is-invalid border-red-500' : ''} border-2 border-yellow bg-inherit p-2 px-3`}
                            placeholder='Login'
                        />
                        <div className="invalid-feedback text-red-500 text-sm">{errors.login?.message}</div>
                    </div>

                    <div className="form-group flex flex-col">
                        <label className='text-sm'>Password<b className='text-yellow'>*</b></label>
                        <div className={`form-control ${errors.password ? 'is-invalid border-red-500' : ''} border-2 border-yellow bg-inherit flex flex-row items-center justify-between`}>
                            <input
                                type={passwordShown ? "text" : "password"}
                                {...register('password')}
                                className={`form-control focus:outline-none ${errors.password ? 'is-invalid' : ''} bg-inherit border-none focus:outline-none w-full`}
                                placeholder='Password'
                            />
                            <i onClick={togglePasswordVisiblity} className='cursor-pointer w-1/6 text-center flex justify-center items-center'>
                                {
                                    passwordShown ?
                                        <IoEyeSharp /> :
                                        <BsEyeSlashFill />
                                }
                            </i>
                        </div>
                        <div className="invalid-feedback text-red-500 text-sm" >{errors.password?.message}</div>
                    </div>


                    <div className="form-group">
                        <button type="submit" className="text-center bg-yellow text-black w-full p-1 text-xl font-bold h-11">
                            {isUninitialized && "Log in"}
                            {isLoading && <Loader />}
                            {isSuccess && 'Success'}
                            {isError && (isApiResponse(error) && [401, 402].includes(error.status) ? "Invalid login or password" : 'Server error, retry later')}
                        </button>
                    </div>
                </form>
                <div>
                    <h1 className='text-white text-xl'>
                        <NavLink to='/register'>Create an Account</NavLink>
                    </h1>
                </div>
            </div>
        </div>);
}

export default Login;