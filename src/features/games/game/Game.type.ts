export interface IGame {
    name: string,
    short_desc: string,
    id: string,
    code: string,
    links: {
        windows?: string
        android?: string
        web?: string
        apple?: string
    },
    instruction: string
}


export interface IHistory {
    title: string,
    isWinner: boolean,
    match_cost: number,
    createdAt: string
}

export interface ITournamentsActiveAndHistory {
    active: {
        name: string,
        goal: string,
        daysLeft: string,
        cost: string,
        id: string,
        game_name: string
    }[],
    history: {
        name: string,
        id: string,
        createdAt: string,
        game_name: string
    }[],
}