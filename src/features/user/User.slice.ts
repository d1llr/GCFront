import { PayloadAction, isAnyOf } from '@reduxjs/toolkit';
// Need to use the React-specific entry point to allow generating React hooks
import { FetchBaseQueryError, createApi, fetchBaseQuery, } from '@reduxjs/toolkit/query/react'
import { createSlice } from '@reduxjs/toolkit'
import IUser from "./User.type";
import authHeader from '../../services/accessHeaders';
import tokenService from '../../services/token.service';
import { WalletActions } from '../header/wallet/wallet.slice';
type ILogin = {
    username: string,
    password: string
}
type IReg = {
    name: string,
    username: string,
    email: string,
    password: string
}


type IEmailSendCode = {
    name: string,
    username: string,
    email: string,
    password: string
}



type IEmailCheckCode = {
    userCode: string,
    email: string
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

    // extraReducers: (builder) => {
    //     builder.addMatcher(
    //         isAnyOf(WalletActions.endpoints.checkBalance.matchFulfilled), //updated
    //         (state, action) => { state.balance = action.payload }
    //     );
    // },
})

export const { setUser, logOut, setWallet, setBalance, removeWallet } = UserSlice.actions
//--------------------------------------------------------------------//
export const UsersActions = createApi({
    reducerPath: 'UsersActions',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
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
        SendCodeUponRegister: builder.mutation<any, IEmailSendCode>({
            query: (body) => ({
                url: '/api/auth/sendCodeUponRegister',
                method: "POST",
                body: body
            }),
            transformErrorResponse: (response: FetchBaseQueryError, error) => response.data,

        }),
        SendCode: builder.mutation<any, { email: string }>({
            query: (body) => ({
                url: '/api/auth/sendCode',
                method: "POST",
                body: body
            }),
            transformErrorResponse: (response: FetchBaseQueryError, error) => response.data,

        }),
        checkCode: builder.mutation<string, IEmailCheckCode>({
            query: (body) => ({
                url: '/api/auth/checkCode',
                method: "POST",
                body: body
            }),

        }),
        getUserInfo: builder.query<IUser, string | undefined>({
            query: (id) => ({
                url: `api/user/getInfoById/${id}`,
                method: "GET",
                headers: authHeader()
            }),
        }),
        getUserName: builder.mutation<string, string | undefined>({
            query: (id) => ({
                url: `api/user/getUserName/${id}`,
                method: "GET",
                headers: authHeader()
            }),
        }),
        getUserBalance: builder.query<string, string | undefined>({
            query: (id) => ({
                url: `/api/GS/user/getBalance/${id}`,
                method: "GET",
                headers: authHeader()
            }),
        }),

        changePassword: builder.mutation<string, { email: string | undefined, password: string }>({
            query: (body) => ({
                url: `/api/user/changePassword`,
                method: "POST",
                body: body,
                headers: authHeader()
            }),
        }),
        changeEmail: builder.mutation<string, { email: string | undefined, id: string }>({
            query: (body) => ({
                url: `/api/user/changeEmail`,
                method: "POST",
                body: body,
                headers: authHeader()
            }),
        }),
        changeUserData: builder.mutation<string, { name: string, username: string, id: string }>({
            query: (body) => ({
                url: `/api/user/changeUserData`,
                method: "POST",
                body: body,
                headers: authHeader()
            }),
        }),
        checkOldPassword: builder.mutation<string, { email: string, OldPassword: string }>({
            query: (body) => ({
                url: `/api/user/checkOldPassword`,
                method: "POST",
                body: body,
                headers: authHeader()
            }),
        }),
        deleteAccount: builder.mutation<string, { email: string }>({
            query: (body) => ({
                url: `/api/user/deleteAccount`,
                method: "POST",
                body: body,
                headers: authHeader()
            }),
        }),
    }),
})

export const {
    useRegisterRequestMutation,
    useLoginRequestMutation,
    useRefreshTokenMutation,
    useGetUserInfoQuery,
    useGetUserNameMutation,
    useGetUserBalanceQuery,
    useSendCodeMutation,
    useSendCodeUponRegisterMutation,
    useCheckCodeMutation,
    useChangePasswordMutation,
    useChangeUserDataMutation,
    useChangeEmailMutation,
    useCheckOldPasswordMutation,
    useDeleteAccountMutation
} = UsersActions