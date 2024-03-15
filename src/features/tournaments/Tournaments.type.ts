export interface ITournaments {
    id: string,
    disabled: boolean,
    image: string,
    name: string,
    description: string,
    daysLeft: string,
    cost: number,
    awards: string,
    goal: string,
    game: string,
    game_name: string,
    participants: string,
    bank: string,
    address: `0x${string}`,
    chainID: string,
    players: string,
    createdAt: string
}


export interface ITournament {
    id: string,
    disabled: boolean,
    image: string,
    name: string,
    description: string,
    daysLeft: string,
    cost: number,
    awards: string,
    game: string,
    game_name: string,
    goal: string,
    participants: string,
    bank: string,
    address: `0x${string}`,
    chainID: string,
    players: string
}



export interface IRating { username: string, earned: number, games_count: number }


export type IFilters = {
    [index: string]: {
        chainID: string,
        game_name: string
    }
} & {
    type: string
}