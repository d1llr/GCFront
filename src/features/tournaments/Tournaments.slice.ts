// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import ITournaments from "./Tournaments.type";
import authHeader from '../../services/accessHeaders';

// Define a service using a base URL and expected endpoints
export const GetTournaments = createApi({
    reducerPath: 'GetTournaments',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://back.pacgc.pw' }),
    endpoints: (builder) => ({
        GetActiveTournaments: builder.query<ITournaments[], void>({
            query: () => ({
                url: `/api/tournaments/all`,
                headers: authHeader()
            }),
        }),
        GetHistoryTournaments: builder.query<ITournaments[], void>({
            query: () => ({
                url: `/api/tournaments/history`,
                headers: authHeader()
            }),
        }),
    }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetActiveTournamentsQuery, useGetHistoryTournamentsQuery } = GetTournaments