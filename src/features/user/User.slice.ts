// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import IUser from "./User.type";
type ILogin = { 
    login: string, 
    password: string 
}
// Define a service using a base URL and expected endpoints
export const UsersActions = createApi({
    reducerPath: 'UsersActions',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
    endpoints: (builder) => ({
        LoginRequest: builder.mutation<IUser, ILogin>({
            query: ({login, password}) => `user?login=${login}&password=${password}`,
        }),
        AutoLoginRequest: builder.query<IUser, string | undefined>({
            query: (token) => `user?token=${token}`,
        }),
        RegisterRequest: builder.mutation<IUser, string | undefined>({
            query: (id) => `user/${id}`,
        })
    }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {useRegisterRequestMutation, useLoginRequestMutation, useAutoLoginRequestQuery } = UsersActions