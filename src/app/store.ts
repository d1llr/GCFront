import { GetAllGames } from './../features/games/Games.slice';
import { GetTournamentById } from './../features/tournaments/tournament/Tournament.slice';
import { GetTournaments } from './../features/tournaments/Tournaments.slice';
import { GetNFTS } from './../features/nft/Nft.slice';
import { UsersActions, UserSlice } from './../features/user/User.slice';
import { GetGameById } from './../features/games/game/Game.slice';
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import counterReducer from "../features/counter/counterSlice"

export const store = configureStore({
  reducer: {
    UserSlice: UserSlice.reducer,
    GetGameById: GetGameById.reducer,
    GetAllGames: GetAllGames.reducer,
    UsersActions: UsersActions.reducer,
    GetNFTS: GetNFTS.reducer,
    GetTournaments: GetTournaments.reducer,
    GetTournamentById: GetTournamentById.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      GetGameById.middleware,
      GetAllGames.middleware,
      UsersActions.middleware,
      GetNFTS.middleware,
      GetTournaments.middleware,
      GetTournamentById.middleware
    ),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
