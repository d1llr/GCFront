import { Spinner } from 'flowbite-react';
import gif from '../images/git/loader.gif'
const Loader = () => {
    return (
        <div className="w-full flex justify-center items-center">
            <Spinner size="lg" light={false} color="warning" aria-label="Warning spinner example" />
        </div>);
}

export default Loader;