import { m } from 'framer-motion'
import React, { useState } from 'react'
import Button from '../../../helpers/Button'
import { useChangeSubscriptionMutation, useGetSubscriptionQuery } from '../User.slice'
import { ISubs } from '../User.slice'
import tokenService from '../../../services/token.service'
import { Modal, ModalFooter } from 'flowbite-react';
import { current } from '@reduxjs/toolkit'
import Loader from '../../../helpers/Loader'

const Subscriptions = () => {
    const { data, isLoading } = useGetSubscriptionQuery()
    const [changeUserSubscription, { isError, isLoading: SubsIsLoading, isSuccess, isUninitialized, error,reset },] = useChangeSubscriptionMutation()
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [currentSub, setCurrentSub] = useState<ISubs>()
    const onSubmit = async (subId: number) => {
        await changeUserSubscription({
            userId: tokenService.getUser().id,
            newsubscribe: subId
        })
            .unwrap()
            .then((responce) => {
                console.log(responce);
                tokenService.setUserSubscribe(subId)
                reset()
            })
            
            .catch(err => {
                console.log(err);

            })
            
    }
    console.log(data);


    // const SubscriptionArray: ISubs[] = [
    //     {
    //         name: 'Started',
    //         price: 'FREE',
    //         info: [
    //             'Withdrawal fee - 90%', 'Daily withdrawal limit - 100 PAC', '10 levels in each game', 'Participation in general tournaments',
    //             'Min. withdrawal amount - 50 PAC'
    //         ]
    //     },
    //     {
    //         name: 'Silver',
    //         price: 700,
    //         info: [
    //             'Withdrawal fee - 40%', 'Daily withdrawal limit - 100 PAC', 'No level limits', 'Additional private tournaments', 'Exclusive badge next to username', 'Min. withdrawal amount - 50 PAC'
    //         ],
    //         desc: 'Even more features with a Silver subscription',
    //         badge: "src/images/icons/silver_badge.svg"

    //     },
    //     {
    //         name: 'Gold',
    //         price: 1500,
    //         info: [
    //             'Withdrawal fee - 25%',
    //             'Daily withdrawal limit - 200 PAC',
    //             'No level limits',
    //             'Additional private tournaments',
    //             'Exclusive badge next to username',
    //             'Min. withdrawal amount - 50 PAC'
    //         ],
    //         desc: 'Even more features with a Golden subscription ',
    //         badge: "src/images/icons/golden_badge.svg"
    //     }
    // ]

    const userSub = tokenService.getUser().subscribe
    const Theme = {
        "root": {
            "base": "fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
            "show": {
                "on": "flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80",
                "off": "hidden"
            },
            "sizes": {
                "sm": "max-w-sm",
                "md": "max-w-md",
                "lg": "max-w-lg",
                "xl": "max-w-xl",
                "2xl": "max-w-2xl",
                "3xl": "max-w-3xl",
                "4xl": "max-w-4xl",
                "5xl": "max-w-5xl",
                "6xl": "max-w-6xl",
                "7xl": "max-w-7xl"
            },
            "positions": {
                "top-left": "items-start justify-start",
                "top-center": "items-start justify-center",
                "top-right": "items-start justify-end",
                "center-left": "items-center justify-start",
                "center": "items-center justify-center",
                "center-right": "items-center justify-end",
                "bottom-right": "items-end justify-end",
                "bottom-center": "items-end justify-center",
                "bottom-left": "items-end justify-start"
            }
        },
        "content": {
            "base": "relative h-full w-full p-4 h-auto",
            "inner": "relative rounded-3xl bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh]"
        },
        "body": {
            "base": "p-6 flex-1 overflow-auto rounded-2xl",
            "popup": ""
        },
        "header": {
            "base": "flex hidden items-start justify-between rounded-t dark:border-gray-600 border-b p-5",
            "popup": "p-2 border-b-0",
            "title": "text-xl font-medium text-gray-900 dark:text-white",
            "close": {
                "base": "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
                "icon": "h-5 w-5 d-none"
            }
        },
        "footer": {
            "base": "flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600",
            "popup": "border-t"
        }
    }

    return (
        <div className="background-image-black">
            <h1 className="mt-7 font-orbitron w-fit text-yellow lg:text-8xl md:text-6xl text-4xl font-extrabold">Subscription</h1>
            <div className="flex flex-col gap-14 mt-8">
                {/* <div className='text-white'>button</div> */}
                <div className='grid min-[320px]:grid-cols-1 max-[1024px]  lg:grid-cols-3 gap-8'>

                    {data?.map((item: ISubs, index: number) => {
                        return (
                            <div className=''>
                                <div className='bg-[#272727] rounded-3xl  min-[320px]:p-4 max-[1024px] lg:p-8'>
                                    <div className='flex flex-col min-[320px]:gap-4 max-[620px] md:gap-8' key={index}>
                                        <div className='text-yellow min-[320px]:text-2xl max-[620px] md:text-4xl font-bold font-orbitron flex flex-row justify-between items-center gap-4'>
                                            {item.name}
                                            {item.id == userSub &&
                                                <div className='px-4 py-3 flex flex-col text-white min-[320px]:py-1 px-2 text-xs max-[620px] md:text-base bg-[#007E3D] justify-center rounded-3xl'>Your current plan</div>
                                            }

                                        </div>
                                        <div className='text-white sm-[320px]:text-2xl max-[620px] md:text-4xl font-bold font-orbitron flex flex-row gap-2 items-baseline'>
                                            {/* <span>
                                                {item.price && item.price}
                                            </span> */}

                                            {item.price > 0 ? (<span className='sm-[320px]:text-md max-[620px] md:text-3xl'>{item.price} PAC / per month</span>) :
                                            (<span className='sm-[320px]:text-md max-[620px] md:text-3xl'>FREE</span>)}
                                        </div>
                                        {item.description &&
                                            <div className='text-white'>{item.description}</div>
                                        }
                                        <ul className='text-white flex flex-col gap-4'>
                                            {item.textinfo?.map((value: string, index: number) => {
                                                return (
                                                    <li
                                                        key={index}
                                                        className={`min-[320px]:text-base max-[620px] md:text-xl before:mt-[5px] before:block before:min-w-[16px] before:rounded-full before:h-[16px] before:content-[""] before:bg-yellow flex flex-row items-start gap-4 font-normal ${item.badge && 'after:content-[""] after:block'
                                                            }`}>
                                                        {value}
                                                        {item.badge && value.includes('badge') && <img src={item.badge} alt="" />}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                        {item.id == userSub ?
                                            (<div className='flex flex-col gap-4 '>
                                                <Button buttonStyle='gray' type='button' textColor='text-black' padding='p-3' rounded='rounded-xl' fontSize='lg:md:text-xl sm:text-base'>
                                                    Delete subscription
                                                </Button>
                                                <span className='flex flex-row items-center  justify-between'>
                                                    <p className='text-2xl text-white font-bold font-orbitron'>Auto-renewal</p>
                                                    <input id="default-checkbox" type="checkbox" value="" className="w-6 h-6 bg-[rgb(39,39,39)] border-yellow rounded-sm focus:bg-[rgb(39,39,39)] dark:ring-offset-gray-800 focus:ring-0 focus:outline-none dark:bg-gray-700 dark:border-gray-600 checked:bg-transparent shadow-none checked:text-yellow-500 checked:border-yellow checked:outline-none focus:shadow-none"></input>
                                                </span>
                                            </div>
                                            ) :
                                            (<Button onClick={() => {
                                                setCurrentSub(item)
                                                setOpenModal(true)
                                                reset()
                                            }} buttonStyle='black' type='button' textColor='text-yellow' padding='p-3' rounded='rounded-xl' fontSize='lg:md:text-xl sm:text-base' >
                                                Select
                                            </Button>)
                                        }

                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <Modal show={openModal} dismissible theme={Theme} size="md" onClose={() => setOpenModal(false)} popup className="bg-black opacity-1 bg-opacity-1 rounded-2xl" >
                        <Modal.Header className=" bg-lightGray" />
                        <Modal.Body className=" bg-lightGray text-white font-orbitron ">
                            {isUninitialized &&
                            <div className="text-center bg-lightGray flex flex-col gap-5">
                                <h2 className='text-3xl text-yellow font-orbitron font-bold'>Plan update</h2>
                                <div className='flex justify-between text-2xl text-white font-orbitron font-bold'>
                                    <span>Plan</span>
                                    <span>{currentSub?.name}</span>
                                </div>
                                <div className='flex justify-between text-2xl text-white font-orbitron font-bold'>
                                    <span>Price</span>
                                    <span>{currentSub?.price}</span>
                                </div>
                                <div className='flex justify-between text-2xl text-white font-orbitron font-bold'>
                                    <span>Auto-renewal</span>
                                    <input id="default-checkbox" type="checkbox" value="" className="w-6 h-6 bg-[rgb(39,39,39)] border-yellow rounded-sm focus:bg-[rgb(39,39,39)] dark:ring-offset-gray-800 focus:ring-0 focus:outline-none dark:bg-gray-700 dark:border-gray-600 checked:bg-transparent shadow-none checked:text-yellow-500 checked:border-yellow checked:outline-none focus:shadow-none"></input>
                                </div>
                                <div className="w-full">
                                    {
                                        currentSub &&
                                        <Button onClick={() => {
                                            onSubmit(currentSub?.id)
                                        }} buttonStyle='yellow' type='button' textColor='text-black' padding='p-3' rounded='rounded-xl' fontSize='lg:md:text-xl sm:text-xl '>
                                            Confirm & Pay
                                        </Button>}
                                </div>
                            </div>
                             }
                             {SubsIsLoading && <Loader gap='4' lgtext='base' text='Processing payment' reverse={true} width='1/2' lgheight='2' padding='1' fontweight='bold'/>}
                             {isSuccess &&    
                                                     
                             <div  className='flex flex-col text-center justify-center gap-4'> 
                                <span className='flex justify-center'><img src={currentSub?.badge} className='h-28'></img></span>
                                <span className='text-yellow font-bold'>Payment was successfull</span>
                             </div>
                             }
                        </Modal.Body>
                    </Modal>
                </div>

            </div>
        </div>
    )
}

export default Subscriptions
