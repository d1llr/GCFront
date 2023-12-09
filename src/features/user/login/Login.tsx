import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Logo from '../../../images/logo.svg'

const Login = () => {

    type UserSubmitForm = {
        login: string;
        password: string;
    };
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


    const onSubmit = (data: UserSubmitForm) => {
        console.log(JSON.stringify(data, null, 2));
    };
    return (
        <div className="w-full flex flex-col gap-20 justify-center items-center">
            <div className='w-fit p-3'>
                <img src={Logo} alt="Logotype" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-7 gap-4 border-2 border-yellow text-white mx-auto my-auto w-96'>
                <h1 className="text-3xl text-center">
                    Log in to the system
                </h1>

                <div className="form-group flex flex-col">
                    <label className='text-sm'>Login<b className='text-yellow'>*</b></label>
                    <input
                        type="text"
                        {...register('login')}
                        className={`form-control ${errors.login ? 'is-invalid' : ''} border-2 border-yellow bg-inherit p-1 px-3`}
                        placeholder='Login'
                    />
                    <div className="invalid-feedback">{errors.login?.message}</div>
                </div>

                <div className="form-group flex flex-col">
                    <label className='text-sm'>Password<b className='text-yellow'>*</b></label>
                    <input
                        type="password"
                        {...register('password')}
                        className={`form-control ${errors.password ? 'is-invalid' : ''} border-2 border-yellow bg-inherit p-1 px-3`}
                        placeholder='Password'
                    />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                </div>


                <div className="form-group">
                    <button type="submit" className="text-center bg-yellow text-black w-full p-1 text-xl font-bold">
                        Log in
                    </button>
                </div>
            </form>
            <div>
                <h1 className='text-white text-xl'>
                    <a href="/register">Create an Account</a>
                </h1>
            </div>
        </div>);
}

export default Login;