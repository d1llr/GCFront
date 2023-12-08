import IGames from "./Games.type";

const Games = () => {
    const data:IGames[] = [
        {
            image:'../../src/images/games/testPhoto.png',
            name: 'Name',
            description: 'Description of the game Description of the game Description of the game Description of the game Description of',
            id: '1'
        },
        {
            image:'../../src/images/games/testPhoto.png',
            name: 'Name',
            description: 'Description of the game Description of the game Description of the game Description of the game Description of',
            id: '2'
        },
        {
            image:'../../src/images/games/testPhoto.png',
            name: 'Name',
            description: 'Description of the game Description of the game Description of the game Description of the game Description of',
            id: '3'
        },
        {
            image:'../../src/images/games/testPhoto.png',
            name: 'Name',
            description: 'Description of the game Description of the game Description of the game Description of the game Description of',
            id: '4'
        },
    ]
    return (
        <div>
            <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
                Games
            </h2>
            <div className="flex flex-row gap-6 mt-10">
                {data.map((item:IGames, index: number)=>{
                    return (
                    <div key={index} className="border-yellow border-2 p-3 flex flex-col gap-2">
                        <img src={item.image} alt="Фото игры" />
                        <span className="text-yellow text-2xl">
                            {item.name}
                        </span>
                        <span className="text-white text-xl">
                            {item.description}
                        </span>
                        <a href={`games/${item.id}`}className="w-full bg-yellow text-xl font-bold p-3 text-center cursor-pointer">
                            More datailed
                        </a>
                    </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Games;