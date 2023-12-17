// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import INFT from "./Nft.type";
import authHeader from '../../services/accessHeaders';

// Define a service using a base URL and expected endpoints
export const GetNFTS = createApi({
    reducerPath: 'GetNFTS',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
    endpoints: (builder) => ({
        GetNFTS: builder.query<INFT[], void>({
            query: () => ({
                url: `/api/nft/all`,
                headers: authHeader()
            }),
        }),
    }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetNFTSQuery } = GetNFTS