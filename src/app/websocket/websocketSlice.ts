// src/features/websocketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch } from '../hooks';

interface WebsocketState {
    connected: boolean;
    message: string | null;
}

const initialState: WebsocketState = {
    connected: false,
    message: null,
};


const socket = new WebSocket('wss://back.pacgc.pw/wss');
// socket.onopen = function (e) {
//     alert("[open] Connection established");
//     alert("Sending to server");
//     socket.send(JSON.stringify({type:'message', message: 'PRIVET'}));
// };

const websocketSlice = createSlice({
    name: 'websocket',
    initialState,
    reducers: {
        messageReceived(state, action: PayloadAction<string>) {
            state.message = action.payload;
        },
        setConnected(state, action: PayloadAction<boolean>) {
            state.connected = action.payload;
        },
        connect(state, action: PayloadAction<void>) {
            socket.onopen = function (e) {
                alert("[open] Connection established");
                alert("Sending to server");
            };
        }
    },
});

export const { messageReceived, setConnected, connect } = websocketSlice.actions;
export default websocketSlice.reducer;
