// Need to use the React-specific entry point to allow generating React hooks
import { FetchBaseQueryError, createApi, fetchBaseQuery, } from '@reduxjs/toolkit/query/react'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import IUser from "./User.type";
import authHeader from '../../services/accessHeaders';
type ILogin = {
    username: string,
    password: string
}
type IReg = {
    username: string,
    email: string,
    password: string
}

type IisLog = {
    isLogged: boolean
}


type ITokens = {
    accessToken: string
    refreshToken: string
}

const initialState: IisLog = {
    isLogged: false
}

export const UserSlice = createSlice({
    name: 'UserSlice',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IisLog>) => {
            state.isLogged = action.payload.isLogged
        },
        logOut: (state) => {
            state = initialState
        },
    },
})

export const { setUser, logOut } = UserSlice.actions
//--------------------------------------------------------------------//
export const UsersActions = createApi({
    reducerPath: 'UsersActions',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
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