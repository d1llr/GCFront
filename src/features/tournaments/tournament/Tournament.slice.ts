// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import ITournaments from "../Tournaments.type";
import authHeader from '../../../services/accessHeaders';
import IRating from '../Tournaments.type'
// Define a service using a base URL and expected endpoints
export const GetTournamentById = createApi({
    reducerPath: 'GetTournamentById',
    baseQuery: fetchBaseQuery({ baseUrl:  import.meta.env.VITE_BACKEND_URL }),
    endpoints: (builder) => ({
        GetTournamentById: builder.query<ITournaments, string | undefined>({
            query: (id) => ({
                url: `/api/tournaments/${id}`,
                headers: authHeader()
            }),
        }),
        GetTournamentByIdFromHistory: builder.query<ITournaments, string | undefined>({
            query: (id) => ({
                url: `/api/tournaments/history/${id}`,
                headers: authHeader()
            }),
        }),
        GetRating: builder.query<IRating[], { tournament_id: string | undefined, type: string }>({
            query: (body) => ({
                url: `/api/tournaments/getRating`,
                method: 'POST',
                body: body,
                headers: authHeader()
            }),
        }),
        GetCurrentDay: builder.mutation<void, void>({
            query: () => ({
                url: `/api/time/getCurrentDay`,
                method: 'GET',
                headers: authHeader()
            }),
        }),
        getParticipate: builder.mutation<void, { user_id: string, tournament_id: string }>({
            query: (body) => ({
                url: `/api/tournaments/getParticipate`,
                method: 'POST',
                body: body,
                headers: authHeader()
            }),
        }),
    }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetTournamentByIdQuery, useGetCurrentDayMutation, useGetParticipateMutation, useGetRatingQuery, useGetTournamentByIdFromHistoryQuery } = GetTournamentById