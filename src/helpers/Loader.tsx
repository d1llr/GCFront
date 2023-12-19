import gif from '../images/git/loader.gif'
const Loader = () => {
    return (
        <div className="w-full flex justify-center items-center">
            <img className="w-8" src={gif} alt="gif" />
        </div>);
}

export default Loader;