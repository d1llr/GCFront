import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Logo from '../../../images/logo.svg'
import { useRegisterRequestMutation, useSendEmailMutation } from '../User.slice';
import { NavLink, useNavigate } from 'react-router-dom';
import Loader from '../../../helpers/Loader';
import { isApiResponse } from '../../../helpers/isApiResponse';
import { Modal, Button, CustomFlowbiteTheme, Flowbite } from 'flowbite-react';
import { useState } from 'react';

const Register = () => {

  type UserSubmitForm = {
    name: string,
    email: string,
    login: string;
    password: string;
    confirmPassword: string
  };
  const [openModal, setOpenModal] = useState(true);
  const navigate = useNavigate();
  const [
    registerUser, // This is the mutation trigger
    { isLoading: RegisterLoading, isSuccess: RegisterSuccess, isUninitialized: RegisterUninitialized }] = useRegisterRequestMutation()

  const [
    SendEmail, // This is the mutation trigger
    { isLoading, isSuccess, isError, isUninitialized, error }, // This is the destructured mutation result
  ] = useSendEmailMutation()

  const [timer, setTimer] = useState<number>(60)
  const [fetchable, setFetchable] = useState<boolean>(true)



  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required'),
    login: Yup.string()
      .required('Login is required')
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

  const validationSchemaCode = Yup.object().shape({
    code: Yup.string()
      .required('Code is required'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(validationSchema)
  });

  const {
    register: registerCode,
    handleSubmit: handleSubmitCode
  } = useForm<{ code: string }>({
    resolver: yupResolver(validationSchemaCode)
  });


  const onSubmit = async (data: UserSubmitForm) => {
    setOpenModal(true)
    console.log(data);
    if (fetchable)
      await SendEmail({
        type: 'SendCode',
        email: data.email,
        username: data.login,
        name: data.name,
        password: data.password
      }).then(async responce => {
        await setTimer(60)
        await setFetchable(false)
        const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
        setTimeout(() => {
          setFetchable(true)
          clearInterval(interval)
        }, 60000)
        console.log(responce);
      }).catch(err => {
        console.log(err);
      })
    else {
      console.log('Too many requests');

    }
    // await registerUser({
    //   name: data.name,
    //   username: data.login,
    //   email: data.email,
    //   password: data.password
    // })
    //   .then(response => {
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
  };

  const onSubmitCode = async (data: { code: string }) => {
    console.log(data);

  }

  RegisterSuccess && navigate('/login')

  const theme: CustomFlowbiteTheme['modal'] = {
    "root": {
      "base": "p-5 fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
      "show": {
        "on": "flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80 p-3",
        "off": "hidden"
      },
    },
    header: {
      title: 'text-center',
      "close": {
        "base": "hidden",
        "icon": "h-5 w-5"
      }
    },
    body: {
      "base": "flex-1 overflow-auto ",
      "popup": "pt-5"
    },
    content: {
      base: 'p-3'
    }
  }
  const customButton: CustomFlowbiteTheme['button'] = {
    size: {
      primary: '',
    },

  };

  return (
    <div className="w-full flex flex-col gap-20 justify-center items-center">
      <Modal size='xl' theme={theme} show={openModal} onClose={() => setOpenModal(false)} popup>
        <Modal.Header className="bg-[#0D0D0D] font-semibold pt-6  flex flex-col items-center text-3xl border-2 border-yellow text-white border-b-0">
          Email confirmation code
        </Modal.Header>
        <Modal.Body className="bg-[#0D0D0D] border-2 border-yellow text-white border-t-0 border-b-0  text-center px-6">
          <div className="">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The code has been sent to you by email. If it's been missing for a long time, check your spam folder.
            </p>
            <form onSubmit={handleSubmitCode(onSubmitCode)}>
              <div className="w-auto h-32 pt-8 form-group border-yellow flex flex-row gap-5 justify-center items-center">
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
                    className={`form-control focus:outline-none ${errors.name ? 'is-invalid border-red-500' : 'border-yellow'} text-center text-6xl w-16 border-2  bg-inherit p-1`}
                  />
                })}
               
              </div>
              <div className="invalid-feedback text-red-500 text-sm">{errors.name?.message}</div>
            </form>
          </div>
          <div className="py-8">
            59 seconds left to get the new code
          </div>
        </Modal.Body>
        <Modal.Footer className='pb-6 pt-0 bg-black border-2 border-yellow text-white border-t-0 '>

          <div className="w-full flex flex-col justify-center items-center">
            <button onClick={() => setOpenModal(false)} className=' rounded-none text-xl  bg-yellow text-black w-80 py-1 font-semibold '>I accept</button>
          </div>

        </Modal.Footer>
      </Modal>
      <div className='w-fit p-3'>
        <img src={Logo} alt="Logotype" />
      </div>
      <div className='flex flex-col items-center gap-5'>
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col p-7 gap-4 border-2 ${isError ? 'border-red-500' : 'border-yellow'} text-white mx-auto my-auto w-96`}>
          <h1 className="text-3xl text-center">
            Create an Account
          </h1>
          <div className="form-group flex flex-col">
            <label className='text-sm'>Your name<b className='text-yellow'>*</b></label>
            <input
              type="text"
              {...register('name')}
              className={`form-control focus:outline-none ${errors.name ? 'is-invalid border-red-500' : 'border-yellow'} border-2  bg-inherit p-1 px-3`}
              placeholder='Lavin Sava'
            />
            <div className="invalid-feedback text-red-500 text-sm">{errors.name?.message}</div>
          </div>
          <div className="form-group flex flex-col">
            <label className='text-sm'>Email<b className='text-yellow'>*</b></label>
            <input
              type="text"
              {...register('email')}
              className={`form-control focus:outline-none ${errors.email ? 'is-invalid border-red-500' : 'border-yellow'} border-2  bg-inherit p-1 px-3`}
              placeholder='lavasava@mail.ru'
            />
            <div className="invalid-feedback text-red-500 text-sm">{errors.email?.message}</div>
          </div>
          <div className="form-group flex flex-col">
            <label className='text-sm'>Login<b className='text-yellow'>*</b></label>
            <input
              type="text"
              {...register('login')}
              className={`form-control focus:outline-none ${errors.login ? 'is-invalid border-red-500' : 'border-yellow'} border-2  bg-inherit p-1 px-3`}
              placeholder='Login'
            />
            <div className="invalid-feedback text-red-500 text-sm">{errors.login?.message}</div>
          </div>

          <div className="form-group flex flex-col">
            <label className='text-sm'>Password<b className='text-yellow'>*</b></label>
            <input
              type="password"
              {...register('password')}
              className={`form-control focus:outline-none ${errors.password ? 'is-invalid border-red-500' : 'border-yellow'} border-2  bg-inherit p-1 px-3`}
              placeholder='Password'
            />
            <div className="invalid-feedback text-red-500 text-sm">{errors.password?.message}</div>
          </div>
          <div className="form-group flex flex-col">
            <label className='text-sm'>Repeat the password<b className='text-yellow'>*</b></label>
            <input
              type="password"
              {...register('confirmPassword')}
              className={`form-control focus:outline-none ${errors.confirmPassword ? 'is-invalid border-red-500' : 'border-yellow'} border-2  bg-inherit p-1 px-3`}
              placeholder='Password'
            />
            <div className="invalid-feedback text-red-500 text-sm">{errors.confirmPassword?.message}</div>
          </div>


          <div className="form-group">
            <button
              type="submit"
              className="text-center bg-yellow text-black w-full p-1 text-xl font-bold h-11"
            >
              {RegisterUninitialized && "Sign up"}
              {RegisterLoading && <Loader />}
              {isError && (isApiResponse(error) && [405].includes(error.status) && "Server error, retry later")}
            </button>
          </div>
        </form>
        <div>
          <h1 className='text-white text-xl'>
            <NavLink to='/login'>Log in</NavLink>
          </h1>
        </div>

      </div>
    </div>);
}

export default Register;