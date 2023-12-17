import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Logo from '../../../images/logo.svg'
import { useRegisterRequestMutation } from '../User.slice';
import { Oval } from 'react-loader-spinner';
import { isApiResponse } from '../../../helpers/isApiResponse';

const Register = () => {

  type UserSubmitForm = {
    name: string,
    email: string,
    login: string;
    password: string;
    confirmPassword: string
  };

  const [
    registerUser, // This is the mutation trigger
    { isLoading, isSuccess, isError, isUninitialized, error }, // This is the destructured mutation result
  ] = useRegisterRequestMutation()

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Email is required'),
    login: Yup.string()
      .required('Email is required')
      .min(6, 'Login must be at least 6 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Confirm Password does not match'),
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
    console.log(data);
    registerUser({
      username: data.login,
      email: data.email,
      password: data.password
    })
    isError && console.log(error)
  };
  return (
    <div className="w-full flex flex-col gap-20 justify-center items-center">
      <div className='w-fit p-3'>
        <img src={Logo} alt="Logotype" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-7 gap-4 border-2 border-yellow text-white mx-auto my-auto w-96'>
        <h1 className="text-3xl text-center">
          Create an Account
        </h1>
        <div className="form-group flex flex-col">
          <label className='text-sm'>Your name<b className='text-yellow'>*</b></label>
          <input
            type="text"
            {...register('name')}
            className={`form-control ${errors.name ? 'is-invalid' : ''} border-2 border-yellow bg-inherit p-1 px-3`}
            placeholder='Lavin Sava'
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>
        <div className="form-group flex flex-col">
          <label className='text-sm'>Email<b className='text-yellow'>*</b></label>
          <input
            type="text"
            {...register('email')}
            className={`form-control ${errors.email ? 'is-invalid' : ''} border-2 border-yellow bg-inherit p-1 px-3`}
            placeholder='lavasava@mail.ru'
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>
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
        <div className="form-group flex flex-col">
          <label className='text-sm'>Repeat the password<b className='text-yellow'>*</b></label>
          <input
            type="password"
            {...register('confirmPassword')}
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''} border-2 border-yellow bg-inherit p-1 px-3`}
            placeholder='Password'
          />
          <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
        </div>


        <div className="form-group">
          <button type="submit" className="text-center bg-yellow text-black w-full p-1 text-xl font-bold">
            {isUninitialized && "Sign up"}
            {isLoading && <Oval
              height={80}
              width={80}
              color="#FFF100"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}

            />}
            {isSuccess && 'Вы успешно зарегистрировались'}
            {isError && isApiResponse(error) && error.data.message}
          </button>
        </div>
      </form>
      <div>
        <h1 className='text-white text-xl'>
          <a href="/login">Log in</a>
        </h1>
      </div>
    </div>);
}

export default Register;