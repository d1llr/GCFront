import { yupResolver } from '@hookform/resolvers/yup';
import { createRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Logo from '../../../images/logo-game-center.svg'
import { setUser, useCheckCodeMutation, useLoginRequestMutation, useRegisterRequestMutation, useSendCodeUponRegisterMutation } from '../User.slice';
import { NavLink, useNavigate } from 'react-router-dom';
import tokenService from '../../../services/token.service';
import { useAppDispatch } from '../../../app/hooks';
import { isApiResponse } from '../../../helpers/isApiResponse';
import Loader from '../../../helpers/Loader';
import { UserSubmitForm } from './Register';
import SucessRegister from '../../../images/icons/SucessRegister.svg'
import { Spinner } from 'flowbite-react';
import Button from '../../../helpers/Button';



const Code = (props: { userProps: UserSubmitForm }) => {

    const dispatch = useAppDispatch()
    const [CheckCode, { isLoading: CheckCodeLoading, isSuccess: CheckCodeSuccess, isError, isUninitialized, error, reset },] = useCheckCodeMutation()
    const [SendCode, { isLoading: SendCodeLoading, isSuccess: SendCodeSuccess, isError: SendCodeIsError, isUninitialized: SendCodeUninitialized, error: SendCodeError }] = useSendCodeUponRegisterMutation()
    const [registerUser, { isLoading: RegisterLoading, isSuccess: RegisterSuccess, isUninitialized: RegisterUninitialized }] = useRegisterRequestMutation()
    const [loginUser, { isLoading: loginUserLoading, isSuccess: loginUserSuccess, isError: loginUserIsError, isUninitialized: loginUserIsUninitialized, error: loginUserError },] = useLoginRequestMutation()

    const [user] = useState<UserSubmitForm>(props.userProps)

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

    const handleKeyPress = (e: any) => {
        console.log(e);
        if (e.key == 'Backspace') {
            if (e.target.value == '') {
                setCurrentIndex((prevIndex) => {
                    // calculate the next input index, next input after the final input will be again the first input. you can change the logic here as per your needs
                    console.log(prevIndex);
                    if (prevIndex != 0) {
                        const nextIndex = prevIndex < numerOfInputs ? prevIndex - 1 : 0;
                        console.log('nextindex:', nextIndex);

                        const prevInput: any = inputRefsArray?.[nextIndex]?.current;
                        prevInput.focus();
                        prevInput.select();
                        return nextIndex;
                    }
                    return 0
                });
            }
            else {
                setLetters((letters) =>
                    letters.map((letter, letterIndex) =>
                        letterIndex == e.target.dataset.id ? '' : letter
                    )
                );

            }

        }

        if (/^\d+$/.test(e.key)) {
            setCurrentIndex((prevIndex) => {
                // calculate the next input index, next input after the final input will be again the first input. you can change the logic here as per your needs
                const nextIndex = prevIndex < numerOfInputs - 1 ? prevIndex + 1 : 0;
                const nextInput: any = inputRefsArray?.[nextIndex]?.current;
                nextInput.focus();
                nextInput.select();
                return nextIndex;
            });
            setLetters((letters) =>
                letters.map((letter, letterIndex) =>
                    letterIndex == e.target.dataset.id ? e.key : letter
                )
            );

        }

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



    const navigate = useNavigate();
    const onSubmit = async () => {
        let code = inputRefsArray.map(ref => ref?.current?.value).join('')
        console.log(code);
        await CheckCode({
            userCode: code,
            email: user.email
        })
            .unwrap()
            .then(async (responce: any) => {
                await registerUser({
                    name: user.name,
                    username: user.login,
                    email: user.email,
                    password: user.password
                }).then((responce) => {
                    console.log(responce);

                })
            })
            .catch((error: any) => {
                console.log(error);
            })
    };


    const handleResendACode = async () => {
        if (fetchable) {
            await SendCode({
                email: user.email,
                username: user.login,
                name: user.name,
                password: user.password
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


    const handleLogin = async () => {
        await loginUser({
            username: user.login,
            password: user.password
        })
            .unwrap()
            .then((response: any) => {
                if (response) {
                    tokenService.setUser(response)
                    dispatch(setUser(true))
                    navigate('/')
                }
            })
            .catch((error: any) => {
                console.log(error);

            })
    }

    return (
        <div className="w-full flex flex-col gap-4 justify-center items-center">
            {!CheckCodeSuccess &&
                <div className='flex flex-col gap-4 items-center max-w-md w-full'>

                    <form onSubmit={onSubmit} className={`flex flex-col p-2 gap-4 text-white mx-auto my-auto w-full`}>
                        <h1 className="text-2xl font-bold text-center font-orbitron mb-2">
                            Email confirmation code
                        </h1>

                        <div className="form-group flex flex-col">
                            <label className="text-center pb-6">
                                The code has been sent to you by email. If It’s been mising for a long time, check your spam folder.
                            </label>

                            <div className="flex flex-row justify-center items-center gap-[16px]">

                                {inputRefsArray.map((ref, index) => {
                                    return (
                                        <input
                                            ref={ref}
                                            key={index}
                                            data-id={index}
                                            // onChange={(e) => {
                                            //     const { value } = e.target;
                                            //     console.log(e.target);

                                            //     if (/^\d+$/.test(value))
                                            //         setLetters((letters) =>
                                            //             letters.map((letter, letterIndex) =>
                                            //                 letterIndex === index ? value : letter
                                            //             )
                                            //         );
                                            // }}
                                            onClick={(e) => {
                                                setCurrentIndex(index);
                                                reset()
                                                e.currentTarget.select();
                                            }}
                                            onPaste={(e) => {
                                                let text = e.clipboardData.getData('text/plain');
                                                console.log(text.length);

                                                setLetters((letters) =>
                                                    letters.map((letter, letterIndex) =>
                                                        /^\d+$/.test(text[letterIndex]) && text[letterIndex] ? text[letterIndex] : ''
                                                    )
                                                );
                                            }}
                                            value={letters[index]}
                                            max='1'

                                            type="text"
                                            // {...registerCode(CodesEnum.code1)}
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
                                <span onClick={() => handleResendACode()} className=' text-center cursor-pointer hover:text-yellow'>
                                    Send the code again {SendCodeLoading && <span className='p-2'><Spinner size="sm" /></span>}
                                </span>
                            }
                            {
                                SendCodeIsError && <span className='text-red-500'>Error with resending code</span>
                            }
                        </div>


                        <div className="form-group mt-2">
                        <Button 
                                content="Check code" 
                                buttonStyle="yellow"
                                type="button"
                                onClick={() => onSubmit()}
                                fontSize="text-[18px] leading-[22px] max-[920px]:text-[16px] max-[920px]:leading-[20px]" 
                                padding="py-2"
                                textColor="text-customBlack" 
                                rounded="rounded-[8px]" 
                                
                                loading={`${CheckCodeLoading && 'true'}`}//true 
                                // loading="true"//true 
                                disabled="" //disabled
                                >
                            </Button>
                        </div>
                    </form>
                    <div>
                        <h2 className='text-white text-xl hover:opacity-70 transition-all'>
                        </h2>
                        <h3 className='text-sm text-center text-urlGray hover:text-yellow transition-all'>
                        </h3>
                    </div>
                </div>}
            {CheckCodeSuccess &&
                <div className="w-full flex flex-col gap-4 justify-center items-center">
                    <div className="rounded-3xl max-w-[386px] w-full flex flex-col gap-7 p-6 items-center bg-[#272727]">

                        <h1 className="text-center text-white text-2xl font-orbitron font-bold">
                            You are registred
                        </h1>

                        <img src={SucessRegister} alt="Sucess register" />

                        <button onClick={() => handleLogin()} className='p-2 font-orbitron text-xl font-bold text-black rounded-xl bg-yellow w-full hover:bg-hoverYellow'>log in</button>

                    </div>


                </div>}
        </div>);




}

export default Code;