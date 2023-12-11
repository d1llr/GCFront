// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import IGames from "./Game.type";

// Define a service using a base URL and expected endpoints
export const GetGameById = createApi({
  reducerPath: 'GetGameById',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
  endpoints: (builder) => ({
    GetGameById: builder.query<IGames, string | undefined>({
      query: (id) => `games/${id}`,
    }),
  }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetGameByIdQuery } = GetGameById