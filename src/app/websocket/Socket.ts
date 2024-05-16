
export enum MessageType {
    balance = "balance",
    auth = 'auth'
}


export interface IMessage {
    type: MessageType,
    message: string
}

class Socket {
    socket: WebSocket | null

    constructor() {
        this.socket = null
    }

    connect(url: string) {
        if (!this.socket) {
            this.socket = new WebSocket(url)
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close()
            this.socket = null
        }
    }

    send(message: IMessage) {
        if (this.socket) {
            this.socket.send(JSON.stringify(message))
        }
    }

    on(eventName: any, callback: any) {
        if (this.socket) {
            this.socket.addEventListener(eventName, callback)
        }
    }
}

export { Socket }


// socket.on('close', (event: any) => {
//     console.log('...and I say goodbye!')
// })

// socket.disconnect()