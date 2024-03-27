import { m } from 'framer-motion'
import React from 'react'
import Button from '../../../helpers/Button'


interface ISubs {
    name: string,
    price: number | 'FREE',
    desc?: string,
    info: string[],
    badge?: string
}


const Subscriptions = () => {
    const SubscriptionArray: ISubs[] = [
        {
            name: 'Started',
            price: 'FREE',
            info: [
                'Withdrawal fee - 90%', 'Daily withdrawal limit - 100 PAC', '10 levels in each game', 'Participation in general tournaments',
                'Min. withdrawal amount - 50 PAC'
            ]
        },
        {
            name: 'Silver',
            price: 700,
            info: [
                'Withdrawal fee - 40%', 'Daily withdrawal limit - 100 PAC', 'No level limits', 'Additional private tournaments', 'Exclusive badge next to username', 'Min. withdrawal amount - 50 PAC'
            ],
            desc: 'Even more features with a Silver subscription',
            badge: "src/images/icons/silver_badge.svg"

        },
        {
            name: 'Gold',
            price: 1500,
            info: [
                'Withdrawal fee - 25%',
                'Daily withdrawal limit - 200 PAC',
                'No level limits',
                'Additional private tournaments',
                'Exclusive badge next to username',
                'Min. withdrawal amount - 50 PAC'
            ],
            desc: 'Even more features with a Golden subscription ',
            badge: "src/images/icons/golden_badge.svg"
        }
    ]

    return (
        <div className="background-image-black">
            <div className="wrapper-content flex flex-col gap-14">
                <div className='min-[320px]:text-4xl max-[620px] md:text-8xl  text-yellow font-orbitron font-extrabold'>Subscription</div>
                {/* <div className='text-white'>button</div> */}
                <div className='grid min-[320px]:grid-cols-1 max-[1024px]  lg:grid-cols-3 gap-8'>

                    {SubscriptionArray?.map((item: ISubs, index: number) => {
                        return (
                            <div className=''>
                                <div className='bg-[#272727] rounded-3xl  min-[320px]:p-4 max-[1024px] lg:p-8'>
                                    <div className='flex flex-col min-[320px]:gap-4 max-[620px] md:gap-8' key={index}>
                                        <div className='text-yellow min-[320px]:text-2xl max-[620px] md:text-4xl font-bold font-orbitron flex flex-row justify-between items-center gap-4'>
                                        {item.name}
                                        {typeof item.price == 'string' &&
                                         <div className='px-4 py-3 flex flex-col text-white min-[320px]:py-1 px-2 text-xs max-[620px] md:text-base bg-[#007E3D] justify-center rounded-3xl'>Your current plan</div>
                                        }   
                                       
                                        </div>
                                        <div className='text-white sm-[320px]:text-2xl max-[620px] md:text-4xl font-bold font-orbitron flex flex-row gap-2 items-baseline'>
                                            <span>
                                                {item.price}
                                            </span>

                                            {typeof item.price == 'number' && <span className='sm-[320px]:text-md max-[620px] md:text-xl'>PAC / per month</span>}
                                        </div>
                                        {item.desc &&
                                            <div className='text-white'>{item.desc}</div>
                                        }
                                        <ul className='text-white flex flex-col gap-4'>
                                            {item.info?.map((value: string, index: number) => {
                                                return (
                                                    <li
                                                        key={index}
                                                        className={`min-[320px]:text-base max-[620px] md:text-xl before:mt-[5px] before:block before:min-w-[16px] before:rounded-full before:h-[16px] before:content-[""] before:bg-yellow flex flex-row items-start gap-4 font-normal ${item.badge && value.includes('icon') && 'after:content-["123"] after:block'
                                                            }`}>
                                                        {value}
                                                        {item.badge && value.includes('badge') && <img src={item.badge ?? ''} alt="" />}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                        {typeof item.price == 'number' &&
                                            <Button buttonStyle='black' type='button' textColor='text-yellow' padding='p-3' rounded='rounded-xl' fontSize='lg:md:text-2xl sm:text-base'>
                                                Select
                                            </Button>
                                        }

                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>

            </div>
        </div>
    )
}

export default Subscriptions
