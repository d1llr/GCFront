// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import IGames from "./Games.type";
import authHeader from '../../services/accessHeaders';

// Define a service using a base URL and expected endpoints
export const GetAllGames = createApi({
  reducerPath: 'GetAllGames',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://back.pacgc.pw' }),
  endpoints: (builder) => ({
    GetAllGames: builder.query<IGames[], void>({
      query: () => ({
        url: `/api/games/all`,
        headers: authHeader()
      }),
    }),
  }),
  tagTypes: ['games'],
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetAllGamesQuery } = GetAllGames