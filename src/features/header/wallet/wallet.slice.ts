// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import IWallet from "./wallet.type";
import authHeader from '../../../services/accessHeaders';


type IReq = {
    wallet?: string,
    id: string,
    amount?: number
}



// Define a service using a base URL and expected endpoints
export const WalletActions = createApi({
    reducerPath: 'WalletActions',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://back.pacgc.pw'}),
    endpoints: (builder) => ({
        ConnectWallet: builder.mutation<IWallet, IReq>({
            query: (body) => ({
                url: `/api/user/setWallet`,
                method: 'POST',
                body: body,
                headers: authHeader()
            }),
        }),
        removeWallet: builder.mutation<IWallet, IReq>({
            query: (body) => ({
                url: `/api/user/removeWallet`,
                method: 'POST',
                body: body,
                headers: authHeader()
            }),
        }),
        rechargeBalance: builder.mutation<IWallet, IReq>({
            query: (body) => ({
                url: `/api/user/rechargeBalance`,
                method: 'POST',
                body: body,
                headers: authHeader()
            }),
        }),
        withdrawBalance: builder.mutation<IWallet, IReq>({
            query: (body) => ({
                url: `/api/user/withdrawBalance`,
                method: 'POST',
                body: body,
                headers: authHeader()
            }),
        }),
    }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useConnectWalletMutation, useRemoveWalletMutation, useRechargeBalanceMutation, useWithdrawBalanceMutation } = WalletActions