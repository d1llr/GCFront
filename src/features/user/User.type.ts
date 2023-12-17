export default interface IUser {
    id: number | string
    username: string
    name?:string
    email: string
    roles?: string[]
    accessToken?: string
    refreshToken?: string
    isLogged?: boolean
}
