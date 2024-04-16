import { Carousel } from 'flowbite-react';
import { Children, ReactElement, ReactHTMLElement } from 'react';


interface IProps {
    Children: ReactElement
}

export default function Slider(props: IProps) {
    const { Children } = props
    return (
        <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
            <Carousel slide={false}>
                {Children}
            </Carousel>
        </div>
    );
}