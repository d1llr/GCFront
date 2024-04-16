interface IButtonProps {
    content?: string
    buttonStyle: 'yellow' | 'gray' | 'black'
    type: "submit" | "reset" | "button" | undefined

    fontSize?: string
    padding?: string
    textColor?: string
    rounded?: string
    maxSizes?: string
    children: string;
    loading?: string
    disabled?: string
    onClick?: () => void
}




const Button = (props: IButtonProps) => {

    var styles = ` ${props.fontSize} ${props.textColor} ${props.rounded} ${props.padding} ${props.maxSizes} `

    switch (props.buttonStyle) {

        case 'yellow':
            styles += `w-full h-full font-semibold border-none font-orbitron text-center bg-yellow transition-all duration-300 hover:bg-hoverYellow hover:transition-all hover:duration-300`
            break;

        case 'gray':
            styles += `w-full h-full font-orbitron font-semibold text-center bg-gray transition-all duration-300 hover:bg-hoverGray hover:transition-all hover:duration-300`
            break;

        case 'black':
            styles += `w-full text-center bg-customBlack font-orbitron font-bold transition-all duration-300 disabled:text-textGray disabled:bg-[rgb(27, 27, 27)] hover:bg-lighterGray hover:transition-all hover:duration-300 `
            break;

    }


    return (
        <div className={`${props.loading == "true" && `${props.rounded} p-[1px] button_loading`}`}>
            <button disabled={Boolean(props.disabled)} onClick={props.onClick}  className={`${styles}`} type={props.type}>
                {props.children}
            </button>
        </div>

    )
}

export default Button;


// <Button 
//     content="Log in" 
//     buttonStyle="yellow"
//     type="submit"

//     fontSize="text-[18px] leading-[22px] max-[920px]:text-[16px] max-[920px]:leading-[20px]" 
//     padding="py-2"
//     textColor="text-customBlack" 
//     rounded="rounded-[8px]" 
    
//     loading="true" //true 
//     disabled="" //disabled
//     >
// </Button>
// <Button 
//     content="Log in" 
//     buttonStyle="gray"
//     type="submit"
    
//     fontSize="text-[18px] leading-[22px] max-[920px]:text-[16px] max-[920px]:leading-[20px]" 
//     padding="py-2"  
//     textColor="text-customBlack" 
//     rounded="rounded-lg" 

//     loading="" 
//     disabled=""

// >
// </Button>
// <Button 

//     content="Log in" 
//     buttonStyle="black"
//     type="submit"
    
//     fontSize="text-[18px] leading-[22px] max-[920px]:text-[16px] max-[920px]:leading-[20px]" 
//     padding="py-2"  
//     textColor="text-yellow" 
//     rounded="rounded-lg" 

//     loading="" 
//     disabled=""
// >

// </Button>