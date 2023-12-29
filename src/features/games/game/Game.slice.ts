// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import IGames from "./Game.type";
import IHistory from "./Game.type";
import authHeader from '../../../services/accessHeaders';

// Define a service using a base URL and expected endpoints
export const GetGameById = createApi({
  reducerPath: 'GetGameById',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://back.pacgc.pw' }),
  endpoints: (builder) => ({
    GetGameById: builder.query<IGames, string | undefined>({
      query: (id) => ({
        url: `/api/games/${id}`,
        headers: authHeader()
      }),
    }),
    GetUserGameHistory: builder.mutation<IHistory, { id: string, game: string | undefined }>({
      query: (body) => ({
        url: `/api/user/getUserHistory`,
        body: body,
        method: 'POST',
        headers: authHeader()
      }),
    }),
  }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetGameByIdQuery, useGetUserGameHistoryMutation } = GetGameById