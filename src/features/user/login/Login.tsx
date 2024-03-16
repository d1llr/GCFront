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
import video from '../../../images/video.mp4'
import close from '../../../images/icons/close.svg'
import play_icon from '../../../images/icons/play.svg'
import Button from '../../../helpers/Button';



const Login = () => {

    type UserSubmitForm = {
        login: string;
        password: string;
    };
    console.log(process.env.NODE_ENV);

    const dispatch = useAppDispatch()

    const [showVideo, setShowVideo] = useState<boolean>(true)

    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {
        setPasswordShown(prev => !prev);
    };
    const [loginUser, { isLoading, isSuccess, isError, isUninitialized, error },] = useLoginRequestMutation()


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
        <div className="w-full flex flex-col gap-4 justify-center items-center">
            <div className='w-fit p-3'>
                <img src={Logo} alt="Logotype" />
            </div>
            <div className='flex  lg:flex-row justify-evenly w-full max-[1000px]:flex-col-reverse max-[1000px]:items-center max-[1000px]:gap-4 '>
                <div className={`${!showVideo && 'hidden'} relative w-1/2 max-[1000px]:w-2/3 max-sm:w-5/6 `}>
                    <video className={`w-full rounded-lg`} controls>
                        <source src={video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    <button className='absolute -top-3 -right-3 flex items-center justify-center bg-yellow hover:bg-hoverYellow p-3 rounded-full max-[1000px]:hidden' onClick={() => setShowVideo(false)}>
                        <img src={close} alt='close' />

                    </button>
                </div>
                <div className={`absolute min-[1000px]:top-50 min-[1000px]:left-10 max-[1000px]:bottom-10 max-[1000px]:left-50 cursor-pointer ${showVideo && 'hidden'}`} onClick={() => setShowVideo(true)}>
                    <div className='relative w-20 h-20'>
                        <img src={play_icon} alt="Return the video" className='w-inherit h-inherit' />
                        <svg width="89" className='absolute top-5 -right-6 w-inherit h-inherit fill-white hover:fill-yellow' height="86" viewBox="0 0 89 86" fill="" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.98868 68.6766L4.2196 69.2735L2.34499 76.6463L2.39357 76.6699L7.58846 70.907L8.7546 71.4724L7.2687 79.0338L7.31729 79.0573L12.0749 73.0824L13.3058 73.6793L7.35404 80.7555L6.05833 80.1273L7.50448 72.6067L7.45589 72.5831L2.28457 78.2974L0.972656 77.6613L2.98868 68.6766Z" />
                            <path d="M12.9096 81.2135L13.4325 78.9881L15.2029 77.9064L19.864 79.0016L20.2551 77.3369L19.5807 76.2724L16.6018 75.5725L15.5239 76.2253L15.3551 76.9437L14.0584 76.639L14.3137 75.5526L16.3046 74.3193L20.3874 75.2786L21.6207 77.2695L19.9491 84.3837L18.705 84.0914L19.0673 82.5494L17.0929 83.7126L14.0089 82.988L12.9096 81.2135ZM17.0936 82.5294L19.3493 81.1919L19.6005 80.123L15.5001 79.1596L14.6386 79.6783L14.2928 81.1502L14.8331 81.9983L17.0936 82.5294Z" />
                            <path d="M25.0069 83.239L25.3718 77.1119L23.7547 77.0156L23.8242 75.8477L25.4773 75.9461L25.6506 73.0353L26.9444 73.1123L26.771 76.0231L29.574 76.1901L29.5045 77.358L26.7015 77.1911L26.3612 82.905L27.2061 83.8569L29.1107 83.9703L29.0412 85.1382L26.5616 84.9906L25.0069 83.239Z" />
                            <path d="M32.5154 83.4517L31.8802 77.8355L33.3396 76.0039L37.6322 75.5183L39.4638 76.9777L39.5872 78.0687L38.2637 78.2185L38.1868 77.5388L37.1934 76.7635L34.0454 77.1196L33.2503 78.0972L33.7925 82.8906L34.7859 83.6659L37.9338 83.3098L38.729 82.3322L38.6521 81.6526L39.9757 81.5029L40.0991 82.5939L38.6397 84.4255L34.3471 84.9111L32.5154 83.4517Z" />
                            <path d="M40.2107 71.1366L41.4781 70.727L43.2496 76.2078L44.4551 73.8508L47.1099 72.9928L49.1949 74.0592L51.4424 81.0131L50.175 81.4227L48.0548 74.8628L46.9272 74.3003L45.163 74.8705L43.7256 77.6808L45.4306 82.9561L44.1632 83.3657L40.2107 71.1366Z" />
                            <path d="M60.2216 74.5411L56.8143 69.4357L55.4668 70.335L54.8174 69.3618L56.1948 68.4425L54.5761 66.0171L55.6541 65.2976L57.2728 67.7231L59.6084 66.1643L60.2579 67.1375L57.9222 68.6963L61.0997 73.4573L62.3479 73.7063L63.9349 72.6472L64.5844 73.6204L62.5183 74.9993L60.2216 74.5411Z" />
                            <path d="M58.8178 61.9129L59.7746 60.9863L63.7818 65.1238L63.8242 62.4768L65.8283 60.5357L68.17 60.5732L73.2542 65.8227L72.2974 66.7494L67.5012 61.7973L66.2411 61.7898L64.9093 63.0797L64.8588 66.2358L68.7158 70.2182L67.759 71.1449L58.8178 61.9129Z" />
                            <path d="M74.7745 61.392L70.0789 58.2463L69.6247 55.9488L72.1394 52.1953L74.4469 51.7262L77.1237 53.5195L73.497 58.9329L75.1719 60.055L76.4056 59.7982L78.279 57.0017L78.0472 55.7631L77.4789 55.3824L78.2203 54.2758L79.1325 54.8869L79.5866 57.1844L77.072 60.9379L74.7745 61.392ZM75.4253 53.9849L74.0495 53.0632L72.8158 53.32L70.9323 56.1315L71.1642 57.3701L72.54 58.2918L75.4253 53.9849Z" />
                            <path d="M75.8105 45.0882L76.2181 43.7824L84.2972 43.5132L84.3187 43.4444L77.827 38.6276L78.2345 37.3217L85.8101 43.1368L85.3488 44.6145L75.8105 45.0882Z" />
                            <path d="M76.369 35.3694L75.588 35.2377L75.1453 34.6154L75.277 33.8344L75.8993 33.3917L76.6803 33.5235L77.123 34.1457L76.9912 34.9267L76.369 35.3694ZM78.4373 35.4444L78.6588 34.1309L87.498 35.6217L87.2765 36.9351L78.4373 35.4444Z" />
                            <path d="M86.4688 31.4477L80.8174 31.3612L79.187 29.68L79.2399 26.2244L80.5583 24.7684L75.3749 24.689L75.3953 23.3572L88.2458 23.554L88.226 24.8498L86.5882 24.8247L88.2009 26.4876L88.1499 29.8172L86.4688 31.4477ZM87.0086 26.7574L85.1478 24.8387L81.9622 24.7899L80.4239 26.4946L80.3836 29.1223L81.2518 30.0357L86.0752 30.1095L86.9709 29.2231L87.0086 26.7574Z" />
                            <path d="M86.202 19.3911L80.6545 20.4732L78.7121 19.1649L77.8471 14.7305L79.152 12.7704L82.3144 12.1535L83.5619 18.549L85.5406 18.163L86.234 17.1108L85.5896 13.8071L84.5516 13.0926L83.8802 13.2235L83.6252 11.9162L84.7029 11.706L86.6453 13.0143L87.5103 17.4487L86.202 19.3911ZM81.4387 13.6814L79.8134 13.9985L79.12 15.0507L79.7679 18.3721L80.8058 19.0866L82.4312 18.7695L81.4387 13.6814Z" />
                            <path d="M83.5265 7.92311L78.3211 10.1251L76.1508 9.24514L74.3555 5.00124L75.2355 2.83092L80.4409 0.628906L82.6112 1.50888L84.4065 5.75278L83.5265 7.92311ZM81.7415 2.50221L80.5786 2.01695L76.1357 3.89637L75.6741 5.06889L77.0205 8.25181L78.1835 8.73707L82.6263 6.85765L83.088 5.68514L81.7415 2.50221Z" />
                        </svg>

                    </div>

                </div>
                <div className='flex flex-col gap-4 items-center max-w-md w-full'>

                    <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col p-2 gap-4 text-white mx-auto my-auto w-full`}>
                        <h1 className="text-2xl font-bold text-center font-orbitron mb-2">
                            Log in to the system
                        </h1>

                        <div className="form-group flex flex-col">
                            <label className="
                                text-md 
                                after:content-['*']
                                after:inline
                                after:text-yellow
                                after:font-beausans
                                mb-1
                            ">
                                Login or Email
                            </label>
                            
                            <div className={`${errors.login?.message ? '' : 'hidden'} invalid-feedback text-red-500 text-sm mb-1`}>{errors.login?.message}</div>

                            <input
                                type="text"
                                {...register('login')}
                                className={`
                                form-control 
                                focus:outline-0 
                                focus:ring-transparent
                                focus:border-rose-500
                                ${errors.login || isError ? 'is-invalid border border-rose-500' : 'border-none'}
                                text-lg
                                rounded-lg
                                bg-lightGray
                                p-2 px-3
                                font-chakra
                            `}
                                placeholder='Login or Email'
                            />

                        </div>

                        <div className="form-group flex flex-col">
                            <label className="
                                text-md 
                                after:content-['*']
                                after:inline
                                after:text-yellow
                                after:font-beausans
                                mb-1
                            ">
                                Password
                            </label>

                            <div className={`${errors.password?.message ? '' : 'hidden'} invalid-feedback text-red-500 text-sm mb-1`}>{errors.password?.message}</div>

                            <div className={`
                            form-control 
                            ${(errors.password || isError) ? 'is-invalid border border-rose-500' : 'border-none'} 
                            rounded-lg
                            bg-lightGray
                            flex flex-row 
                            items-center 
                            justify-between
                            overflow-hidden
                        `}>

                                <input
                                    type={passwordShown ? "text" : "password"}
                                    {...register('password')}
                                    className={`
                                    form-control 
                                    focus:outline-0 
                                    focus:ring-transparent
                                    ${errors.password ?? 'is-invalid'} 
                                    text-lg
                                    bg-inherit
                                    border-none 
                                    p-2 px-3
                                    w-full
                                    font-chakra
                                `}
                                    placeholder='Password'
                                />
                                <i onClick={togglePasswordVisiblity} className='cursor-pointer w-1/6 text-center flex justify-center items-center'>
                                    {
                                        passwordShown
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
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7627 3.76705C12.5208 4.49736 13.1744 5.44111 13.7237 6.5983C13.7831 6.72411 13.8139 6.86151 13.8139 7.00065C13.8139 7.13978 13.7831 7.27719 13.7237 7.40299C12.2456 10.5311 10.0049 12.0952 7.0018 12.0952C5.91847 12.0952 4.93409 11.8908 4.04867 11.4819L4.91008 10.6205C5.54758 10.8536 6.24482 10.9702 7.0018 10.9702C9.52367 10.9702 11.369 9.69205 12.669 7.00143C12.1807 5.99205 11.616 5.18158 10.9677 4.56205L11.7627 3.76705ZM12.0643 0.921426L12.7304 1.5883C12.742 1.59991 12.7512 1.6137 12.7575 1.62887C12.7638 1.64405 12.7671 1.66031 12.7671 1.67674C12.7671 1.69317 12.7638 1.70943 12.7575 1.72461C12.7512 1.73978 12.742 1.75357 12.7304 1.76518L1.60305 12.8921C1.57961 12.9155 1.54783 12.9286 1.51469 12.9286C1.48155 12.9286 1.44977 12.9155 1.42633 12.8921L0.759299 12.225C0.735875 12.2016 0.722717 12.1698 0.722717 12.1367C0.722717 12.1035 0.735875 12.0717 0.759299 12.0483L2.41274 10.3953C1.58138 9.64523 0.870445 8.6483 0.279924 7.40455C0.220511 7.27874 0.189697 7.14134 0.189697 7.00221C0.189697 6.86308 0.220511 6.72567 0.279924 6.59986C1.75805 3.47174 3.99867 1.90768 7.0018 1.90768C8.17742 1.90768 9.23633 2.1483 10.1785 2.62955L11.8874 0.921426C11.899 0.909804 11.9128 0.900585 11.928 0.894294C11.9432 0.888003 11.9594 0.884766 11.9759 0.884766C11.9923 0.884766 12.0086 0.888003 12.0237 0.894294C12.0389 0.900585 12.0527 0.909804 12.0643 0.921426ZM7.0018 3.03268C4.48149 3.03268 2.63617 4.3108 1.33461 7.00143C1.86586 8.09955 2.48774 8.96221 3.20914 9.59893L4.51258 8.29549C4.23502 7.77528 4.13201 7.17964 4.21875 6.59644C4.30548 6.01323 4.57736 5.47334 4.99429 5.05641C5.41121 4.63949 5.9511 4.36761 6.53431 4.28087C7.11751 4.19414 7.71316 4.29715 8.23336 4.57471L9.3318 3.47627C8.62883 3.17893 7.85399 3.03268 7.0018 3.03268ZM5.37978 6.20877C5.25484 6.45433 5.18957 6.7259 5.1893 7.00143C5.1891 7.18278 5.21709 7.36305 5.27227 7.5358L7.47367 5.3344C7.2112 5.25062 6.93266 5.22993 6.66068 5.27402C6.38871 5.31812 6.13097 5.42574 5.90841 5.58816C5.68585 5.75058 5.50473 5.9632 5.37978 6.20877ZM6.77941 8.74661C6.83222 8.75145 6.8855 8.75395 6.93956 8.75395C7.16941 8.75407 7.39703 8.70889 7.6094 8.62099C7.82178 8.53309 8.01475 8.40419 8.17727 8.24166C8.3398 8.07914 8.4687 7.88617 8.5566 7.67379C8.6445 7.46142 8.68969 7.2338 8.68956 7.00395C8.68956 6.94989 8.68706 6.89661 8.68222 6.84379L9.50753 6.01848C9.69763 6.51487 9.73988 7.0557 9.62916 7.57559C9.51844 8.09548 9.2595 8.57217 8.88364 8.94803C8.50778 9.32389 8.03109 9.58283 7.5112 9.69355C6.99131 9.80427 6.45048 9.76202 5.95409 9.57192L6.77941 8.74661Z" fill="#FFF100" />
                                            </svg>

                                    }
                                </i>
                            </div>

                        </div>


                        <div className="form-group mt-2">

                            <Button 
                                content="Log in" 
                                buttonStyle="yellow"
                                type="submit"

                                fontSize="text-[18px] leading-[22px] max-[920px]:text-[16px] max-[920px]:leading-[20px]" 
                                padding="py-2"
                                textColor="text-customBlack" 
                                rounded="rounded-[8px]" 
                                
                                loading={`${isLoading && 'true'}`}//true 
                                // loading="true"//true 
                                disabled="" //disabled
                                >
                            </Button>
                           
                            {/* <button type="submit" className={`text-center bg-yellow ${isLoading && 'button_loading'}  text-black w-full p-1 text-xl font-bold h-11 border-none rounded-lg lowercase font-orbiton hover:bg-hoverYellow transition-al`}>
                                Log in
                            </button> */}
                        </div>

                    </form>
                    <div>
                        <h2 className='text-white text-xl hover:opacity-70 transition-all'>
                            <NavLink to='/register'>Create an Account</NavLink>
                        </h2>
                        <h3 className='text-base text-center text-urlGray  hover:text-yellow transition-all'>
                            <NavLink to='/recover'>Recover password</NavLink>
                        </h3>
                    </div>
                </div>
            </div>
        </div >);




}

export default Login;