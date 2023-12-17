import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta, QueryActionCreatorResult, QueryDefinition } from "@reduxjs/toolkit/query";
import { isApiResponse } from "./isApiResponse";
import { SerializedError } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { useRefreshTokenMutation } from "../features/user/User.slice";
import tokenService from '../services/token.service';
import { useEffect } from "react";
import IGames from "../features/games/Games.type";
// юзлесс хуйня, 7 часов работы и дебага в пизду просто
const redirectFunc = (isError: boolean, error: FetchBaseQueryError | SerializedError | undefined) => {
    const navigate = useNavigate();
    const [
        refreshToken,
        { isLoading, isSuccess, isError: RefreshErrorBool, isUninitialized, error: RefreshError }, // This is the destructured mutation result
    ] = useRefreshTokenMutation()
    if (isError) {
        if (isApiResponse(error)) {
            switch (error.status) {
                // Если срок жизни Access токена кончился посылается запрос на создание новой пары токенов
                case 401:
                    useEffect(() => {
                        refreshToken(tokenService.getLocalRefreshToken())
                            .unwrap()
                            .then(response => {
                                tokenService.updateLocalAccessToken(response.accessToken)
                                tokenService.updateLocalRefreshToken(response.refreshToken)
                                return true
                            })
                            .catch(err => {
                                if (err.status === 422) navigate('/login')
                            })
                    }, [isError])
                    break;

                // Если Access токена нет в LocalStorage
                case 403:
                    navigate('/login')
                    return false

                default:
                    break;
            }
        }
    }
}

export default redirectFunc;