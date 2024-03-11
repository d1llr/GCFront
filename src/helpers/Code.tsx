import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, createRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Logo from '../../../images/logo-game-center.svg'
import { setUser, useCheckCodeMutation, useLoginRequestMutation, useRegisterRequestMutation, useSendCodeMutation } from '../features/user/User.slice';
import { NavLink, useNavigate } from 'react-router-dom';
import tokenService from '../services/token.service';
import { useAppDispatch } from '../app/hooks';
import { isApiResponse } from './isApiResponse';
import Loader from './Loader';
import { UserSubmitForm } from '../features/user/register/Register';
import SucessRegister from '../../../images/icons/SucessRegister.svg'
import { Spinner } from 'flowbite-react';

export type IUniversalCode = {
    email: string
}

const Code = (props: { userProps: IUniversalCode, setCheckingResult: Dispatch<SetStateAction<boolean | undefined>>, h1?: string }) => {


    // api requests
    const [CheckCode, { isLoading, isSuccess: CheckCodeSuccess, isError, isUninitialized, error },] = useCheckCodeMutation()
    const [SendCode, { isLoading: SendCodeLoading, isSuccess: SendCodeSuccess, isError: SendCodeIsError, isUninitialized: SendCodeUninitialized, error: SendCodeError }] = useSendCodeMutation()
    const [user] = useState<IUniversalCode>(props.userProps)


    // input logic
    const [timer, setTimer] = useState<number>(60)
    const [fetchable, setFetchable] = useState<boolean>(false)
    useEffect(() => {
        const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
        setTimeout(() => {
            setFetchable(true)
            clearInterval(interval)
        }, 60000)
    }, [])


    const numerOfInputs = 4;

    const [inputRefsArray] = useState(() =>
        Array.from({ length: numerOfInputs }, () => createRef<HTMLInputElement>())
    );

    const [currentIndex, setCurrentIndex] = useState(0);

    const [letters, setLetters] = useState(() =>
        Array.from({ length: numerOfInputs }, () => "")
    );

    const handleKeyPress = () => {
        setCurrentIndex((prevIndex) => {
            // calculate the next input index, next input after the final input will be again the first input. you can change the logic here as per your needs
            const nextIndex = prevIndex < numerOfInputs - 1 ? prevIndex + 1 : 0;
            const nextInput: any = inputRefsArray?.[nextIndex]?.current;
            nextInput.focus();
            nextInput.select();
            return nextIndex;
        });
    };

    useEffect(() => {
        // focus the firs iput initially
        if (inputRefsArray?.[0]?.current) {
            inputRefsArray?.[0]?.current?.focus();
        }

        // add the event listener for keyup keyboard event
        window.addEventListener("keyup", handleKeyPress, false);

        // remove the event listener when the component unmounts
        return () => {
            window.removeEventListener("keyup", handleKeyPress);
        };
    }, []);



    // submits func 
    const onSubmit = async () => {
        let code = inputRefsArray.map(ref => ref?.current?.value).join('')
        console.log(code);
        await CheckCode({
            userCode: code,
            email: user.email
        })
            .unwrap()
            .then(async (responce: any) => {
                console.log(responce);
                props.setCheckingResult(true)
            })
            .catch((error: any) => {
                console.log(error);
            })
    };

    const handleResendACode = async () => {
        if (fetchable) {
            await SendCode({
                email: user.email
            })
                .unwrap()
                .then(() => {
                    setTimer(60)
                    setFetchable(false)
                    const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
                    setTimeout(() => {
                        setFetchable(true)
                        clearInterval(interval)
                    }, 60000)
                })
                .catch((error: any) => {
                    console.log(error);
                })

        }
        else {
            console.log('Too many requests');
        }
    }


    return (
        <div className="w-full flex flex-col gap-4 justify-center items-center">
            <div className='flex flex-col gap-4 items-center max-w-md w-full'>

                <form onSubmit={onSubmit} className={`flex flex-col p-2 gap-4 text-white mx-auto my-auto w-full`}>
                    <h1 className="text-2xl font-bold text-center font-orbitron mb-2">
                        Email confirmation code
                    </h1>

                    <div className="form-group flex flex-col">
                        <label className="text-center pb-6">
                            {props.h1 ?  props.h1 : 'The code has been sent to you by email. If It’s been mising for a long time, check your spam folder.'}
                        </label>

                        <div className="flex flex-row justify-center items-center gap-[16px]">

                            {inputRefsArray.map((ref, index) => {
                                return (
                                    <input
                                        ref={ref}
                                        key={index}
                                        maxLength={1}
                                        onChange={(e) => {
                                            const { value } = e.target;
                                            setLetters((letters) =>
                                                letters.map((letter, letterIndex) =>
                                                    letterIndex === index ? value : letter
                                                )
                                            );
                                        }}
                                        onClick={(e) => {
                                            setCurrentIndex(index);
                                            e.currentTarget.select();
                                        }}
                                        value={letters[index]}
                                        max={"1"}
                                        type="text"
                                        className={`form-control focus:outline-0 focus:ring-transparent focus:border-none text-lg rounded-lg bg-lightGray p-2 px-3 font-chakra w-[42px] h-[56px] text-center ${isError ? 'border-red-500 border-2' : 'border-0'}`}
                                    />)
                            })}
                        </div>

                    </div>

                    <div className="form-group flex flex-col pt-[16px]">
                        {timer ?
                            <span className="text-center">
                                {timer} seconds left to get new code
                            </span>
                            :
                            <span onClick={() => handleResendACode()} className='underline text-center cursor-pointer'>
                                resend a code {SendCodeLoading && <span className='p-2'><Spinner size="sm" /></span>}
                            </span>
                        }
                        {
                            SendCodeIsError && <span className='text-red-500'>Error with resending code</span>
                        }
                    </div>


                    <div className="form-group mt-2">
                        <button type="button" className={`text-center bg-yellow ${isLoading && 'button_loading'}  text-black w-full p-1 text-xl font-bold h-11 border-none rounded-lg font-orbiton hover:bg-hoverYellow transition-al`}
                            onClick={() => onSubmit()}>
                            Continue
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