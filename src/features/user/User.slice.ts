import { PayloadAction } from '@reduxjs/toolkit';
// Need to use the React-specific entry point to allow generating React hooks
import { FetchBaseQueryError, createApi, fetchBaseQuery, } from '@reduxjs/toolkit/query/react'
import { createSlice } from '@reduxjs/toolkit'
import IUser from "./User.type";
import authHeader from '../../services/accessHeaders';
import tokenService from '../../services/token.service';
type ILogin = {
    username: string,
    password: string
}
type IReg = {
    name:string,
    username: string,
    email: string,
    password: string
}

type IUserState = {
    isLogged: boolean
    wallet: null | string
    balance: number
}


type ITokens = {
    accessToken: string
    refreshToken: string
}

const initialState: IUserState = {
    isLogged: false,
    wallet: tokenService.getWallet() ?? null,
    balance: tokenService.getBalance() ?? 0
}

export const UserSlice = createSlice({
    name: 'UserSlice',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<boolean>) => {
            state.isLogged = action.payload
        },
        logOut: (state) => {
            state = initialState
        },
        setWallet: (state, action: PayloadAction<string>) => {
            state.wallet = action.payload
        },
        removeWallet: (state) => {
            state.wallet = null
        },
        setBalance: (state, action: PayloadAction<number>) => {
            state.balance = action.payload
        },
    },
})

export const { setUser, logOut, setWallet, setBalance, removeWallet } = UserSlice.actions
//--------------------------------------------------------------------//
export const UsersActions = createApi({
    reducerPath: 'UsersActions',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://back.pacgc.pw' }),
    endpoints: (builder) => ({
        LoginRequest: builder.mutation<IUser, ILogin>({
            query: (body) => ({
                url: 'api/auth/signin',
                method: "POST",
                body: body,
            }),
        }),
        RefreshToken: builder.mutation<ITokens, string | undefined>({
            query: (refreshtoken) => ({
                url: '/api/auth/refreshtoken',
                method: "POST",
                body: { refreshToken: refreshtoken },
            }),
            extraOptions: { maxRetries: 2 },
        }),
        RegisterRequest: builder.mutation<string, IReg>({
            query: (body) => ({
                url: 'api/auth/signup',
                method: "POST",
                body: body,
            }),
            transformErrorResponse: (response: FetchBaseQueryError, error) => response.data,
        }),
        getUserInfo: builder.query<IUser, string | undefined>({
            query: (id) => ({
                url: `api/user/getInfoById/${id}`,
                method: "GET",
                headers: authHeader()
            }),
        }),
    }),
})

export const { useRegisterRequestMutation, useLoginRequestMutation, useRefreshTokenMutation, useGetUserInfoQuery } = UsersActions