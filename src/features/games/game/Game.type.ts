export default interface IGames {
    game: {
        image: string,
        name: string,
        description: string,
        scr_dir: string,
        short_desc: string,
        id: string,
        code: string,
        links: {
            windows?: string
            android?: string
            web?: string
            apple?: string
        }

    },
    screenshots: string[]
}


export default interface IHistory {
    title: string,
    isWinner: boolean,
    match_cost: number,
    createdAt: string
}