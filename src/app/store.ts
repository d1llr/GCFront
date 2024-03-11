import { GetAllGames } from './../features/games/Games.slice';
import { GetTournamentById } from './../features/tournaments/tournament/Tournament.slice';
import { GetTournaments } from './../features/tournaments/Tournaments.slice';
import { GetNFTS } from './../features/nft/Nft.slice';
import { UsersActions, UserSlice } from './../features/user/User.slice';
import { GameSlice } from './../features/games/game/Game.slice';
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import counterReducer from "../features/counter/counterSlice"
import { WalletActions } from '../features/header/wallet/wallet.slice';
import websocketReducer from './websocket/websocketSlice';
import { socketMiddleware } from './websocket/websocketMiddleware';
import { Socket } from './websocket/Socket';
import { mobBurger } from '../features/header/Header.slice';

const websocketMiddleware = socketMiddleware(new Socket());

export const store = configureStore({
  reducer: {
    UserSlice: UserSlice.reducer,
    GameSlice: GameSlice.reducer,
    GetAllGames: GetAllGames.reducer,
    UsersActions: UsersActions.reducer,
    GetNFTS: GetNFTS.reducer,
    GetTournaments: GetTournaments.reducer,
    GetTournamentById: GetTournamentById.reducer,
    WalletActions: WalletActions.reducer,
    websocket: websocketReducer,
    mobBurger:mobBurger.reducer 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      GameSlice.middleware,
      GetAllGames.middleware,
      UsersActions.middleware,
      GetNFTS.middleware,
      GetTournaments.middleware,
      GetTournamentById.middleware,
      WalletActions.middleware
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
