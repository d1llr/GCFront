import INFT from "./Nft.type";
import QPhoto from '../../images/nft/que.png'
import { useGetNFTSQuery } from "./Nft.slice";
import { useRefreshTokenMutation } from "../user/User.slice";
import tokenService from "../../services/token.service";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../helpers/Loader";
const Nft = () => {
    const { data, isLoading, isError, error, refetch, isSuccess } = useGetNFTSQuery()
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
                }
            })
    }, [isError])


    if (isLoading) {
        return <Loader />
    }
    return (
        <div>
            <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
                NFT
            </h2>
            <div className="grid grid-cols-4  gap-6 mt-10">
                {data?.map((item: INFT, index: number) => {
                    return (
                        <div key={index} className="border-yellow border-2 p-3 flex flex-col gap-2">
                            <img src={import.meta.env.VITE_BACKEND_URL + item.image} alt="Фото игры" />
                            <span className="text-yellow 2xl:text-2xl md:text-xl">
                                {item.name}
                            </span>
                            <span className="text-white 2xl:text-2xl md:text-base break-normal">
                                {item.description}
                            </span>
                        </div>
                    )
                })}
                <div className="border-yellow border-2 p-3 flex flex-col justify-between">
                    <img src={QPhoto} alt="Go to store" />
                    <a href="https://nftpacman.pw/" target="_blank" className="w-full bg-yellow text-xl font-bold p-3 text-center">
                        Go to store
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Nft;