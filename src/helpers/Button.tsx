interface IButtonProps {
    style: 'yellow' | 'gray' | 'black'
    fontSize?: string
    type: "submit" | "reset" | "button" | undefined
    textColor?: string
    rounded?: string
}




const Button = (props: IButtonProps) => {

    const yellow = ''

    return (
        <div>
            <button className="" type={props.type}>

            </button>
        </div>

    )
}