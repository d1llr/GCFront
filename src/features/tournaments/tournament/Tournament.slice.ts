// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import ITournaments from "../Tournaments.type";
import authHeader from '../../../services/accessHeaders';

// Define a service using a base URL and expected endpoints
export const GetTournamentById = createApi({
    reducerPath: 'GetTournamentById',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
    endpoints: (builder) => ({
        GetTournamentById: builder.query<ITournaments, string | undefined>({
            query: (id) => ({
                url: `/api/tournaments/${id}`,
                headers: authHeader()
            }),
        }),
    }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetTournamentByIdQuery } = GetTournamentById