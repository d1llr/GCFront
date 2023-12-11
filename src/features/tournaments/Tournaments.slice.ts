// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import ITournaments from "./Tournaments.type";

// Define a service using a base URL and expected endpoints
export const GetTournaments = createApi({
    reducerPath: 'GetTournaments',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
    endpoints: (builder) => ({
        GetTournaments: builder.query<ITournaments[], null>({
            query: () => `tournaments`,
        }),
    }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetTournamentsQuery } = GetTournaments