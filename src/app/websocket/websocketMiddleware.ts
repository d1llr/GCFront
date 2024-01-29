import { Socket } from "./Socket";

export const socketMiddleware = (socket: Socket) => (params) => (next) => (action: string) => {
  const { dispatch, getState } = params
  const { type } = action

  switch (type) {
    case 'socket/connect':
      socket.connect('wss://back.pacgc.pw/wss')
      console.log('opened connection');

      // socket.on('open', () => {
      // })
      // socket.on('message', (data: any) => {
      //   console.log(data);

      // })
      // socket.on('close', () => { })
      break

    case 'socket/disconnect':
      socket.disconnect()
      break
    case 'socket/sendMessage':
      socket.disconnect()
      break

    default:
      break
  }

  return next(action)
}