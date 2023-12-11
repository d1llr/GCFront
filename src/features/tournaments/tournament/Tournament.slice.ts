// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import ITournaments from "../Tournaments.type";

// Define a service using a base URL and expected endpoints
export const GetTournamentById = createApi({
    reducerPath: 'GetTournamentById',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
    endpoints: (builder) => ({
        GetTournamentById: builder.query<ITournaments, string | undefined>({
            query: (id) => `tournaments/${id}`,
        }),
    }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetTournamentByIdQuery } = GetTournamentById