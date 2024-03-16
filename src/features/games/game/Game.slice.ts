// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IGame, IHistory, ITournamentsActiveAndHistory } from "./Game.type";
import authHeader from '../../../services/accessHeaders';
import { ITournaments } from '../../tournaments/Tournaments.type';

// Define a service using a base URL and expected endpoints
export const GameSlice = createApi({
  reducerPath: 'GameSlice',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  endpoints: (builder) => ({
    GetGameById: builder.query<IGame, string | undefined>({
      query: (id) => ({
        url: `/api/games/${id}`,
        headers: authHeader()
      }),
    }),
    GetUserGameHistory: builder.mutation<IHistory[], { id: string, game: string | undefined, offset: number, limit: number }>({
      query: (body) => ({
        url: `/api/user/getUserHistory`,
        body: body,
        method: 'POST',
        headers: authHeader()
      }),
    }),
    GetUserGamesCount: builder.mutation<number, { id: string, game: string | undefined }>({
      query: (body) => ({
        url: `/api/user/GetUserGamesCount`,
        body: body,
        method: 'POST',
        headers: authHeader()
      }),
    }),
    getTournaments: builder.mutation<ITournamentsActiveAndHistory, string | undefined>({
      query: (code) => ({
        url: `/api/tournaments/activeAndHistory/all/${code}`,
        headers: authHeader()
      }),
    }),
  }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetGameByIdQuery, useGetUserGameHistoryMutation, useGetTournamentsMutation, useGetUserGamesCountMutation } = GameSlice