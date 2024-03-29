// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IFilters, ITournaments } from "./Tournaments.type";
import authHeader from '../../services/accessHeaders';

// Define a service using a base URL and expected endpoints
export const GetTournaments = createApi({
    reducerPath: 'GetTournaments',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
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
        GetFilters: builder.query<IFilters[], void>({
            query: () => ({
                url: `/api/tournaments/getFilters`,
                headers: authHeader()
            }),
        }),
        GetTournamentsCount: builder.query<number, void>({
            query: () => ({
                url: `/api/tournaments/GetTournamentsCount`,
                headers: authHeader()
            }),
        }),
    }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetActiveTournamentsQuery, useGetHistoryTournamentsQuery, useGetFiltersQuery, useGetTournamentsCountQuery } = GetTournaments