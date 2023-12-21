export default interface IGames {
    game: {
        image: string,
        name: string,
        description: string,
        scr_dir: string,
        short_desc: string,
        id: string,
        links:{
            windows?:string
            android?:string
            web?:string
            apple?:string
        }
    },
    screenshots: string[]
}