// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IFilters, ITournaments } from "./Tournaments.type";
import authHeader from '../../services/accessHeaders';

// Define a service using a base URL and expected endpoints
export const GetTournaments = createApi({
    reducerPath: 'GetTournaments',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
    endpoints: (builder) => ({
        GetTournaments: builder.query<any, { offset: number, limit: number }>({
            query: (body) => ({
                url: `/api/tournaments/all`,
                headers: authHeader(),
                method: "POST",
                body: body
            }),
        }),
        GetFilters: builder.query<IFilters[], void>({
            query: () => ({
                url: `/api/tournaments/getFilters`,
                headers: authHeader()
            }),
        }),
        GetTournamentsByFilters: builder.mutation<any, IFilters>({
            query: (body) => ({
                url: `/api/tournaments/getTournamentsByFilters`,
                headers: authHeader(),
                method: "POST",
                body: body
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
export const { useGetTournamentsQuery, useGetFiltersQuery, useGetTournamentsByFiltersMutation, useGetTournamentsCountQuery } = GetTournaments