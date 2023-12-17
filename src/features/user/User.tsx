import { useNavigate } from "react-router-dom";
import { useGetUserInfoQuery, useRefreshTokenMutation } from "./User.slice";
import tokenService from "../../services/token.service";
import { useEffect } from "react";

const User = () => {
    const { data, isLoading, isError, error, refetch } = useGetUserInfoQuery(tokenService.getUser().id)
    const navigate = useNavigate();
    const [refreshToken] = useRefreshTokenMutation()
    useEffect(() => {
        refreshToken(tokenService.getLocalRefreshToken())
            .unwrap()
            .then(response => {
                tokenService.updateLocalAccessToken(response.accessToken)
                tokenService.updateLocalRefreshToken(response.refreshToken)
                refetch()
            })
            .catch(err => {
                switch (err.status) {
                    case (422 && 421):
                        navigate('/login')
                        break;
                    case 421:
                        alert(err.message)
                        break;
                }
            })
    }, [isError])
    console.log(data);

    return (
        <div className="flex flex-col gap-9">
            <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
                My account
            </h2>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col text-white w-1/3">
                    <h3 className="text-sm">
                        Your name
                    </h3>
                    <span className="px-3  py-2 border-yellow border-2">
                        {data?.name}
                    </span>
                </div>
                <div className="flex flex-col text-white w-1/3">
                    <h3 className="text-sm">
                        Email
                    </h3>
                    <span className="px-3  py-2 border-yellow border-2">
                        {data?.email}
                    </span>
                </div>
                <div className="flex flex-col text-white w-1/3">
                    <h3 className="text-sm">
                        Login
                    </h3>
                    <span className="px-3  py-2 border-yellow border-2">
                        {data?.username}
                    </span>
                </div>
                <div className="flex flex-col text-white w-1/3">
                    <h3 className="text-sm">
                        Wallet
                    </h3>
                    <span className="px-3 py-2 border-yellow border-2">
                        dnadkvnape39w73akinvp;anxaf2 (Пока тестовый)
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="bg-yellow p-3 flex-col flex gap-5 w-1/3">
                    <span className='text-black text-xl font-bold'>
                        Your game balance
                    </span>
                    <span className='text-black self-end font-bold text-xl'>
                        100 000 PAC
                    </span>
                    <div className='w-full flex flex-row justify-between gap-2'>
                        <button className='bg-black p-1 w-full border-black text-sm text-yellow'>
                            Replenish
                        </button>
                        <button className='bg-inherit p-1 w-full border-2 border-black text-black'>
                            Withdraw
                        </button>
                    </div>
                </div>
                <button className="w-1/3 text-black text-center bg-yellow p-4 font-bold">
                    Disconnect wallet
                </button>
            </div>
        </div>
    );
}

export default User;