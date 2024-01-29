export default interface ITournaments {
    id: string,
    disabled: boolean,
    image: string,
    name: string,
    description: string,
    daysLeft: string,
    cost: number,
    goal: string,
    participants: string,
    bank: string,
    players: string
}


export default interface IRating { username: string, earned: number }