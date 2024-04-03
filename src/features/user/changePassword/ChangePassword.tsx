import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Logo from '../../../images/logo-game-center.svg'
import { setUser, useChangeEmailMutation, useChangePasswordMutation, useCheckOldPasswordMutation, useSendCodeMutation } from '../User.slice';
import { useEffect, useState } from 'react';
import Code from '../../../helpers/Code';
import SuccessAction from '../../../helpers/SuccessAction';
import { preview } from 'vite';
import tokenService from '../../../services/token.service';
import { useAppDispatch } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';
import Button from '../../../helpers/Button';


export type IChangePassword = {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
};

type IUser = {
    email: string,
    password?: string
}




const ChangePassword = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const [SendCode, { isLoading: SendCodeLoading, isSuccess: SendCodeSuccess, isError: SendCodeIsError, isUninitialized: SendCodeUninitialized, error: SendCodeError }] = useSendCodeMutation()
    const [changePassword, { isLoading: changePasswordLoading, isSuccess: changePasswordSuccess, isError: changePasswordIsError, isUninitialized: changePasswordIsUninitialized, error: changePasswordError }] = useChangePasswordMutation()
    const [checkOldPassword, { isLoading: checkOldPasswordLoading, isSuccess: checkOldPasswordSuccess, isError: checkOldPasswordIsError, isUninitialized: checkOldPasswordIsUninitialized, error: checkOldPasswordError }] = useCheckOldPasswordMutation()
    const [changeEmail, { isLoading: changeEmailLoading, isSuccess: changeEmailSuccess, isError: changeEmailIsError, isUninitialized: changeEmailIsUninitialized, error: changeEmailError }] = useChangeEmailMutation()


    const [user, setUserData] = useState<IUser>()
    const [checkingResult, setCheckingResult] = useState<boolean>()
    const [stage, setStage] = useState<number>(1)


    const [oldPasswordShown, setOldPasswordShown] = useState(false);
    const [newPasswordShown, setNewPasswordShown] = useState(false);

    useEffect(() => {
        if (checkingResult) {
            if (user?.password)
                changePassword({
                    email: user?.email,
                    password: user?.password
                })
                    .unwrap()
                    .then(responce => {
                        console.log(responce);
                        setStage(3)
                    })
                    .catch(err => {
                        console.log(err);
                    })
        }
    }, [checkingResult])



    useEffect(() => {
        if (!tokenService?.getUser()) {
            navigate("/login")
        }
    }, [])

    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string()
            .required('Old password is required'),
        newPassword: Yup.string()
            .required('New password is required')
            .min(6, 'Password must be at least 6 characters')
            .max(40, 'Password must not exceed 40 characters'),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('newPassword')], 'Confirm Password does not match'),
    });



    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<IChangePassword>({
        resolver: yupResolver(validationSchema)
    });



    const onSubmit = async (data: IChangePassword) => {
        setUserData({ email: tokenService.getUser().email, password: data.newPassword })

        await checkOldPassword({
            email: tokenService.getUser().email,
            OldPassword: data?.oldPassword
        })
            .unwrap()
            .then(async (reponce) => {
                await SendCode({
                    email: tokenService.getUser().email,
                })
                    .unwrap()
                    .then(responce => {
                        console.log(responce);
                        setStage(2)
                    })
                    .catch(err => {
                        console.log(err);

                    })
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
                </>

        }
    }


    const switcher = () => {
        switch (stage) {
            case 1:
                return (
                    <>
                        <div>
                            <h1 className="text-2xl font-bold text-center font-orbitron mb-2">
                                Change the password
                            </h1>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col p-7 gap-4 border-none text-white mx-auto my-auto w-full`}>

                            <div className="form-group flex flex-col">
                                <label className="text-md after:content-['*'] after:inline after:text-yellow after:font-beausans mb-1">Old password</label>
                                <div className="invalid-feedback text-red-500 text-sm mb-2">{checkOldPasswordIsError && 'The previos password is incorrect'}</div>
                                <div className={` form-control  ${checkOldPasswordIsError ? 'is-invalid border border-rose-500' : 'border-none'} rounded-lg bg-lightGray flex flex-row  items-center justify-between overflow-hidden`}>
                                    <input
                                        type={oldPasswordShown ? "text" : "password"}
                                        {...register('oldPassword')}
                                        className={` ${errors.oldPassword ? 'is-invalid border border-rose-500' : 'border-none'} form-control  focus:outline-0  focus:ring-transparent focus:border-rose-500 text-lg rounded-lg bg-lightGray p-2 px-3 font-chakra `}
                                        placeholder='**********'
                                    />
                                    <i onClick={() => setOldPasswordShown(prev => !prev)} className='cursor-pointer w-1/6 text-center flex justify-center items-center'>
                                        {
                                            oldPasswordShown
                                                ?
                                                <svg className="hover:stroke-eyeBlack transition-all" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_320_656)">
                                                        <path d="M13.722 6.59785C12.2407 3.47754 10.0017 1.90723 7.00009 1.90723C3.99697 1.90723 1.75947 3.47754 0.278215 6.59941C0.218802 6.72522 0.187988 6.86263 0.187988 7.00176C0.187988 7.14089 0.218802 7.27829 0.278215 7.4041C1.75947 10.5244 3.99853 12.0947 7.00009 12.0947C10.0032 12.0947 12.2407 10.5244 13.722 7.40254C13.8423 7.14941 13.8423 6.85566 13.722 6.59785ZM7.00009 10.9697C4.47978 10.9697 2.63447 9.6916 1.3329 7.00098C2.63447 4.31035 4.47978 3.03223 7.00009 3.03223C9.5204 3.03223 11.3657 4.31035 12.6673 7.00098C11.3673 9.6916 9.52197 10.9697 7.00009 10.9697ZM6.93759 4.25098C5.41884 4.25098 4.18759 5.48223 4.18759 7.00098C4.18759 8.51973 5.41884 9.75098 6.93759 9.75098C8.45634 9.75098 9.68759 8.51973 9.68759 7.00098C9.68759 5.48223 8.45634 4.25098 6.93759 4.25098ZM6.93759 8.75098C5.9704 8.75098 5.18759 7.96816 5.18759 7.00098C5.18759 6.03379 5.9704 5.25098 6.93759 5.25098C7.90478 5.25098 8.68759 6.03379 8.68759 7.00098C8.68759 7.96816 7.90478 8.75098 6.93759 8.75098Z" fill="#FFF100" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_320_656">
                                                            <rect width="14" height="14" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                :
                                                <svg className="hover:stroke-eyeBlack transition-all" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.7627 3.76705C12.5208 4.49736 13.1744 5.44111 13.7237 6.5983C13.7831 6.72411 13.8139 6.86151 13.8139 7.00065C13.8139 7.13978 13.7831 7.27719 13.7237 7.40299C12.2456 10.5311 10.0049 12.0952 7.0018 12.0952C5.91847 12.0952 4.93409 11.8908 4.04867 11.4819L4.91008 10.6205C5.54758 10.8536 6.24482 10.9702 7.0018 10.9702C9.52367 10.9702 11.369 9.69205 12.669 7.00143C12.1807 5.99205 11.616 5.18158 10.9677 4.56205L11.7627 3.76705ZM12.0643 0.921426L12.7304 1.5883C12.742 1.59991 12.7512 1.6137 12.7575 1.62887C12.7638 1.64405 12.7671 1.66031 12.7671 1.67674C12.7671 1.69317 12.7638 1.70943 12.7575 1.72461C12.7512 1.73978 12.742 1.75357 12.7304 1.76518L1.60305 12.8921C1.57961 12.9155 1.54783 12.9286 1.51469 12.9286C1.48155 12.9286 1.44977 12.9155 1.42633 12.8921L0.759299 12.225C0.735875 12.2016 0.722717 12.1698 0.722717 12.1367C0.722717 12.1035 0.735875 12.0717 0.759299 12.0483L2.41274 10.3953C1.58138 9.64523 0.870445 8.6483 0.279924 7.40455C0.220511 7.27874 0.189697 7.14134 0.189697 7.00221C0.189697 6.86308 0.220511 6.72567 0.279924 6.59986C1.75805 3.47174 3.99867 1.90768 7.0018 1.90768C8.17742 1.90768 9.23633 2.1483 10.1785 2.62955L11.8874 0.921426C11.899 0.909804 11.9128 0.900585 11.928 0.894294C11.9432 0.888003 11.9594 0.884766 11.9759 0.884766C11.9923 0.884766 12.0086 0.888003 12.0237 0.894294C12.0389 0.900585 12.0527 0.909804 12.0643 0.921426ZM7.0018 3.03268C4.48149 3.03268 2.63617 4.3108 1.33461 7.00143C1.86586 8.09955 2.48774 8.96221 3.20914 9.59893L4.51258 8.29549C4.23502 7.77528 4.13201 7.17964 4.21875 6.59644C4.30548 6.01323 4.57736 5.47334 4.99429 5.05641C5.41121 4.63949 5.9511 4.36761 6.53431 4.28087C7.11751 4.19414 7.71316 4.29715 8.23336 4.57471L9.3318 3.47627C8.62883 3.17893 7.85399 3.03268 7.0018 3.03268ZM5.37978 6.20877C5.25484 6.45433 5.18957 6.7259 5.1893 7.00143C5.1891 7.18278 5.21709 7.36305 5.27227 7.5358L7.47367 5.3344C7.2112 5.25062 6.93266 5.22993 6.66068 5.27402C6.38871 5.31812 6.13097 5.42574 5.90841 5.58816C5.68585 5.75058 5.50473 5.9632 5.37978 6.20877ZM6.77941 8.74661C6.83222 8.75145 6.8855 8.75395 6.93956 8.75395C7.16941 8.75407 7.39703 8.70889 7.6094 8.62099C7.82178 8.53309 8.01475 8.40419 8.17727 8.24166C8.3398 8.07914 8.4687 7.88617 8.5566 7.67379C8.6445 7.46142 8.68969 7.2338 8.68956 7.00395C8.68956 6.94989 8.68706 6.89661 8.68222 6.84379L9.50753 6.01848C9.69763 6.51487 9.73988 7.0557 9.62916 7.57559C9.51844 8.09548 9.2595 8.57217 8.88364 8.94803C8.50778 9.32389 8.03109 9.58283 7.5112 9.69355C6.99131 9.80427 6.45048 9.76202 5.95409 9.57192L6.77941 8.74661Z" fill="#FFF100" />
                                                </svg>

                                        }
                                    </i>
                                </div>
                            </div>
                            <div className="form-group flex flex-col">
                                <label className="text-md after:content-['*'] after:inline after:text-yellow after:font-beausans mb-1">New password</label>
                                <div className={` form-control  ${errors.newPassword ? 'is-invalid border border-rose-500' : 'border-none'} rounded-lg bg-lightGray flex flex-row  items-center justify-between overflow-hidden`}>
                                    <input
                                        type={newPasswordShown ? "text" : "password"}
                                        {...register('newPassword')}
                                        className={`border-0 form-control  focus:outline-0  focus:ring-transparent focus:border-rose-500 text-lg rounded-lg bg-lightGray p-2 px-3 font-chakra `}
                                        placeholder='**********'
                                    />
                                    <i onClick={() => setNewPasswordShown(prev => !prev)} className='cursor-pointer w-1/6 text-center flex justify-center items-center'>
                                        {
                                            newPasswordShown
                                                ?
                                                <svg className="hover:stroke-eyeBlack transition-all" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_320_656)">
                                                        <path d="M13.722 6.59785C12.2407 3.47754 10.0017 1.90723 7.00009 1.90723C3.99697 1.90723 1.75947 3.47754 0.278215 6.59941C0.218802 6.72522 0.187988 6.86263 0.187988 7.00176C0.187988 7.14089 0.218802 7.27829 0.278215 7.4041C1.75947 10.5244 3.99853 12.0947 7.00009 12.0947C10.0032 12.0947 12.2407 10.5244 13.722 7.40254C13.8423 7.14941 13.8423 6.85566 13.722 6.59785ZM7.00009 10.9697C4.47978 10.9697 2.63447 9.6916 1.3329 7.00098C2.63447 4.31035 4.47978 3.03223 7.00009 3.03223C9.5204 3.03223 11.3657 4.31035 12.6673 7.00098C11.3673 9.6916 9.52197 10.9697 7.00009 10.9697ZM6.93759 4.25098C5.41884 4.25098 4.18759 5.48223 4.18759 7.00098C4.18759 8.51973 5.41884 9.75098 6.93759 9.75098C8.45634 9.75098 9.68759 8.51973 9.68759 7.00098C9.68759 5.48223 8.45634 4.25098 6.93759 4.25098ZM6.93759 8.75098C5.9704 8.75098 5.18759 7.96816 5.18759 7.00098C5.18759 6.03379 5.9704 5.25098 6.93759 5.25098C7.90478 5.25098 8.68759 6.03379 8.68759 7.00098C8.68759 7.96816 7.90478 8.75098 6.93759 8.75098Z" fill="#FFF100" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_320_656">
                                                            <rect width="14" height="14" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                :
                                                <svg className="hover:stroke-eyeBlack transition-all" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.7627 3.76705C12.5208 4.49736 13.1744 5.44111 13.7237 6.5983C13.7831 6.72411 13.8139 6.86151 13.8139 7.00065C13.8139 7.13978 13.7831 7.27719 13.7237 7.40299C12.2456 10.5311 10.0049 12.0952 7.0018 12.0952C5.91847 12.0952 4.93409 11.8908 4.04867 11.4819L4.91008 10.6205C5.54758 10.8536 6.24482 10.9702 7.0018 10.9702C9.52367 10.9702 11.369 9.69205 12.669 7.00143C12.1807 5.99205 11.616 5.18158 10.9677 4.56205L11.7627 3.76705ZM12.0643 0.921426L12.7304 1.5883C12.742 1.59991 12.7512 1.6137 12.7575 1.62887C12.7638 1.64405 12.7671 1.66031 12.7671 1.67674C12.7671 1.69317 12.7638 1.70943 12.7575 1.72461C12.7512 1.73978 12.742 1.75357 12.7304 1.76518L1.60305 12.8921C1.57961 12.9155 1.54783 12.9286 1.51469 12.9286C1.48155 12.9286 1.44977 12.9155 1.42633 12.8921L0.759299 12.225C0.735875 12.2016 0.722717 12.1698 0.722717 12.1367C0.722717 12.1035 0.735875 12.0717 0.759299 12.0483L2.41274 10.3953C1.58138 9.64523 0.870445 8.6483 0.279924 7.40455C0.220511 7.27874 0.189697 7.14134 0.189697 7.00221C0.189697 6.86308 0.220511 6.72567 0.279924 6.59986C1.75805 3.47174 3.99867 1.90768 7.0018 1.90768C8.17742 1.90768 9.23633 2.1483 10.1785 2.62955L11.8874 0.921426C11.899 0.909804 11.9128 0.900585 11.928 0.894294C11.9432 0.888003 11.9594 0.884766 11.9759 0.884766C11.9923 0.884766 12.0086 0.888003 12.0237 0.894294C12.0389 0.900585 12.0527 0.909804 12.0643 0.921426ZM7.0018 3.03268C4.48149 3.03268 2.63617 4.3108 1.33461 7.00143C1.86586 8.09955 2.48774 8.96221 3.20914 9.59893L4.51258 8.29549C4.23502 7.77528 4.13201 7.17964 4.21875 6.59644C4.30548 6.01323 4.57736 5.47334 4.99429 5.05641C5.41121 4.63949 5.9511 4.36761 6.53431 4.28087C7.11751 4.19414 7.71316 4.29715 8.23336 4.57471L9.3318 3.47627C8.62883 3.17893 7.85399 3.03268 7.0018 3.03268ZM5.37978 6.20877C5.25484 6.45433 5.18957 6.7259 5.1893 7.00143C5.1891 7.18278 5.21709 7.36305 5.27227 7.5358L7.47367 5.3344C7.2112 5.25062 6.93266 5.22993 6.66068 5.27402C6.38871 5.31812 6.13097 5.42574 5.90841 5.58816C5.68585 5.75058 5.50473 5.9632 5.37978 6.20877ZM6.77941 8.74661C6.83222 8.75145 6.8855 8.75395 6.93956 8.75395C7.16941 8.75407 7.39703 8.70889 7.6094 8.62099C7.82178 8.53309 8.01475 8.40419 8.17727 8.24166C8.3398 8.07914 8.4687 7.88617 8.5566 7.67379C8.6445 7.46142 8.68969 7.2338 8.68956 7.00395C8.68956 6.94989 8.68706 6.89661 8.68222 6.84379L9.50753 6.01848C9.69763 6.51487 9.73988 7.0557 9.62916 7.57559C9.51844 8.09548 9.2595 8.57217 8.88364 8.94803C8.50778 9.32389 8.03109 9.58283 7.5112 9.69355C6.99131 9.80427 6.45048 9.76202 5.95409 9.57192L6.77941 8.74661Z" fill="#FFF100" />
                                                </svg>

                                        }
                                    </i>
                                </div>
                            </div>
                            <div className="form-group flex flex-col">
                                <label className="text-md after:content-['*'] after:inline after:text-yellow after:font-beausans mb-1">Repeat the password</label>
                                <div className="invalid-feedback text-red-500 text-sm mb-2">{errors.confirmPassword?.message}</div>
                                <input
                                    type='text'
                                    {...register('confirmPassword')}
                                    className={` ${errors.confirmPassword ? 'is-invalid border border-rose-500' : 'border-none'} form-control  focus:outline-0  focus:ring-transparent focus:border-rose-500 text-lg rounded-lg bg-lightGray p-2 px-3 font-chakra `}
                                    placeholder='**********'
                                />
                            </div>
                            {/* <button type="submit" className={`text-center bg-yellow ${checkOldPasswordLoading && 'button_loading'} text-black w-full p-1 text-xl font-bold h-11 border-none rounded-lg font-orbiton hover:bg-hoverYellow transition-al`}>
                                Continue
                            </button> */}
                                <Button
                                    content="continue"
                                    buttonStyle="yellow"
                                    type="submit"
                                    // onClick={() => buttonAction()}
                                    fontSize="text-[18px] leading-[22px] max-[920px]:text-[16px] max-[920px]:leading-[20px]"
                                    padding="py-2"
                                    textColor="text-customBlack"
                                    rounded="rounded-[8px]"

                                    loading={`${checkOldPasswordLoading && 'true'}`}//true 
                                    // // loading="true"//true 
                                    disabled="" //disabled
                                >
                                </Button>
                        </form>
                    </>
                )
            case 2:
                return (
                    user && <Code userProps={user} setCheckingResult={setCheckingResult} />
                )

            case 3:
                return (
                    <SuccessAction h1='The password has been updated' button='Accept' buttonAction={onButtonLogIn} />
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
                </div>

                {switcher()}

            </div>
        </div >
    )

}

export default ChangePassword