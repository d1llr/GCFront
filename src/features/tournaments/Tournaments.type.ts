export default interface ITournaments {
    id: string,
    disabled: boolean,
    image: string,
    name: string,
    description: string,
    daysLeft: string,
    cost: number,
    goal: string,
    game: string,
    participants: string,
    bank: string,
    address: `0x${string}`,
    chainID: string,
    players: string,
    createdAt: string
}


export default interface ITournament {
    id: string,
    disabled: boolean,
    image: string,
    name: string,
    description: string,
    daysLeft: string,
    cost: number,
    game: string,
    goal: string,
    participants: string,
    bank: string,
    address: `0x${string}`,
    chainID: string,
    players: string
}



export default interface IRating { username: string, earned: number, games_count: number }