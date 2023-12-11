// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import INFT from "./Nft.type";

// Define a service using a base URL and expected endpoints
export const GetNFTS = createApi({
    reducerPath: 'GetNFTS',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://185.76.14.193:88/' }),
    endpoints: (builder) => ({
        GetNFTS: builder.query<INFT[], null>({
            query: () => `nft`,
        }),
    }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetNFTSQuery } = GetNFTS