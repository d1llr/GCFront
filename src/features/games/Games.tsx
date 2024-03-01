import { useNavigate } from "react-router-dom"
import IGames from "./Games.type"
import { useGetAllGamesQuery } from "./Games.slice"
import Loader from "../../helpers/Loader"

var t = true
const Games = () => {
  const data = [{ "active": true, "image": "/storage/games/PAC_SHOOT.png", "name": "PAC Shoot", "code": "PAC_SHOOT", "description": "We offer a variety of interesting game modes. Campaign mode allows you to individually fight and evolve in an exciting world, while our zombie mode offers you the chance to face the onslaught of the living dead. And if you want to test your accuracy and patience, our sniper mode is perfect for you.\n\nBut the real thrill and fun begins in our multiplayer mode. Here you can engage in 1x1, 2x2 or 5x5 battles to show off your strategic skills and precision marksmanship. \n\nThanks to our advanced ranking system, you can always measure your skills against other players and compete in tournaments for top honors!\n\nJoin us on this exciting, adrenaline-pumping adventure and spend time challenging your friends and players around the world.\n", "scr_dir": "storage/games/PAC_Shoot", "links": { "web": "http://www.pacshooter.pw/", "android": "https://drive.google.com/file/d/1Ak4APIKhfnUHFT4MtNFsnu9FRAqqXU_9/view?usp=sharing", "windows": "https://drive.google.com/file/d/1tX0wQu1itLW9COPCMS-ai7WE6lbzlZPv/view?usp=sharing" }, "short_desc": "PAC Shoot - a dynamic multiplayer first-person shooter with different game modes. Immerse yourself in the exciting world of PAC Shoot, where your every move and victory can help you achieve the reward! Use your tactics, skill and cool judgment to become the best.  Be ready for an exciting and dynamic gameplay, together with pleasant graphics and sound effects.", "id": "1", "createdAt": "2023-12-17T16:47:42.000Z", "updatedAt": "2023-12-17T16:47:42.000Z" }, { "active": false, "image": "/storage/games/PAC_BALL.png", "name": "PAC&Ball", "code": "", "description": "Immerse yourself in this exciting and dynamic runner game, designed for two-three players engaging in a frenetic competition of strategic encounters. With the main objective to reach the finish line before your opponent, each player is armed with balls to throw at the other and can activate snares along the opponent's path\n\nVictory is depends on a clear strategy, as your adversary could repeatedly activate traps in your path. Additionally, the finite number of balls available presents an intriguing challenge to be judicious in their use, making every throw count in your race to the finish.\n\nTake your gaming experience to new heights with our bonus levels where you can put your skill set to the test. Brilliance in these extra stages offers the opportunity for higher rewards, keeping you engaged and coming back for more!\n\nThe game features such elements as: \n\n- Offline Mode: Play with bots to experience the game and practice your reactions\n- Online Mode: Challenge your friends or players from around the globe in real-time to prove who's the ultimate player.\n- Random Level Generation: Offers variety with each gameplay ensuring each round stays exciting and unpredictable.\n- Captivating Mechanics: Our game mechanics are easy to understand, yet challenging to master, adding an extra layer of interest and fun.\n", "scr_dir": "storage/games/PAC_Ball", "links": { "android": "https://drive.google.com/file/d/13Ury5lkAzhRyRkFcx1eoiut7EQnatfoJ/view?usp=sharing" }, "short_desc": "The aim of the game is to be the first to reach the finish line. The task seems easy at first glance, but throughout the game you will be hindered by other players (or bots), knocking you down or using various traps against you.", "id": "2", "createdAt": "2023-12-17T16:47:42.000Z", "updatedAt": "2023-12-17T16:47:42.000Z" }, { "active": false, "image": "/storage/games/PAC_SQUAD.png", "name": "PAC Squad", "code": "", "description": "Experience the exhilarating journey of law enforcement in our game where you'll need to assemble your special police squad and lead them through numerous trouble-filled tracks in pursuit of notorious criminals. \n\nUnique squad creation mechanics enable you to select individual members of your team freely. You have the option to continuously upgrade and modify your squad, sharpening them into an unstoppable force.\n\nAdd new units, combine them for improvement. Build the most powerful squad to defeat the enemy!\n\nOur game offers an immersive and engaging gameplay with key features such as:\n\n- Squad-based strategy\n- Squad upgrades\n- Coin rewards\n- Squad combining\n- Wide array of units\n", "scr_dir": "storage/games/PAC_Squad", "links": { "android": "https://drive.google.com/file/d/1hYX3yJeADYd6r9SnDGEBxqBRSIvFv44l/view?usp=sharing" }, "short_desc": "Emergency call - bank robbery! Get to the call, avoiding traps, and gather reinforcements for the final battle! The peace and quiet of the citizens is in your hands!", "id": "3", "createdAt": "2023-12-17T16:49:01.000Z", "updatedAt": "2023-12-17T16:49:01.000Z" }, { "active": false, "image": "/storage/games/PAC_WARS.png", "name": "Pacman Wars", "code": "", "description": "Immerse yourself in a simple war game, where your main task is to destroy rival squads defending their base to capture the flag. You, as a squad leader, will have to take on this demanding task and begin an active offensive.\n\nThe game constantly throws you challenges and unexpected surprises, encouraging you to use all your skills and tactical maneuvers to pass all levels. Randomness provides unique gameplay in every confrontation, bringing an extra thrill to every encounter.\n\nThe game contains elements such as:\n\n- Character Level: Advance and improve your character's skills and abilities to defeat the enemy.\n- Squad Leveling: Enhance your squad's firepower and resilience to have a strong battalion behind you.\n- Military Equipment Leveling: Upgrade your arsenal and military equipment to maximize your tactical advantage and dominate the battlefield.\n- Diverse Locations: Enjoy battles in a variety of locations,\n\nCan you trick your enemies, break through their defenses, capture the flag and declare ultimate victory? It's time to find out. Get ready, commander, the battlefield awaits your skill!\n", "scr_dir": "storage/games/Pacman_Wars", "links": { "web": "https://pacmanwars.pw/", "android": "https://drive.google.com/file/d/1hYX3yJeADYd6r9SnDGEBxqBRSIvFv44l/view?usp=sharing" }, "short_desc": "In this game, you have to take on the role of a squad leader and lead him into battle to defeat the enemy! To cope with the task, you have to increase the number of your troops, their strength and endurance, as well as show personal activity on the battlefield!", "id": "4", "createdAt": "2023-12-17T16:49:01.000Z", "updatedAt": "2023-12-17T16:49:01.000Z" }, { "active": true, "image": "/storage/games/3inRow.jpg", "name": "PAC Match 3", "code": "", "description": "Discover a world of colorful puzzles in PAC Match 3, where every level is a new adventure!\n\nCombinations and Strategy:\nConnect cubes with different images, link them according to their meaning and create chains of two or more elements. Plan your moves to reach the level targets!\n\nStory and Adventure: \nEach room of the house opens a new chapter of the story. Pass through locations consisting of multiple levels and learn more and more about this exciting world.\n\nBoosts and Amplifiers:\nUse a variety of boosts to help you through challenging levels. They can help you in the most unexpected situations, but don't rely on them alone!\n\nGraphics and Sound: \nEnjoy beautiful graphics and great soundtrack that make your journey through the house even more colorful and memorable.\n\nPAC Match 3 is not just a game, it's a journey through the world of puzzles, full of exciting challenges and interesting stories. \n\nJoin us and start your adventure today!\n", "scr_dir": "storage/games/3inRow", "links": { "android": "https://drive.google.com/file/d/1WcHjSQYwE3dZKnXG4TspwNSn4ngK2hb2/view" }, "short_desc": "Dive into the world of exciting puzzles with PAC Match 3! In this casual game you have to combine multicolored cubes related to the meaning to pass multiple levels in different rooms of the house. Use boosts to help you pass levels and unlock new chapters of the story!", "id": "5", "createdAt": "2024-01-17T21:29:17.000Z", "updatedAt": "2024-01-17T21:29:17.000Z" }]
  // const { data, isLoading, isError, error, refetch, isSuccess } =
  //   useGetAllGamesQuery()
  const navigate = useNavigate()


  // if (isLoading) {
  //   return <Loader />
  // }
  return (
    <div>
      <h2 className="w-fit decoration-dotted underline text-yellow text-2xl">
        Games
      </h2>
      <div className="grid grid-cols-4 2xl:gap-6 mt-10 md:gap-3">
        {data?.map((item: IGames, index: number) => {
          return (
            <div
              key={index}
              className="border-yellow border-2 p-3 flex flex-col gap-2 justify-between"
            >
              <div className="flex flex-col gap-2">
                <img
                  src={"https://back.pacgc.pw" + item.image}
                  alt="Фото игры"
                />
                <span className="text-yellow 2xl:text-2xl md:text-xl">
                  {item.name}
                </span>
                <span className="text-white 2xl:text-xl md:text-base">
                  {item.short_desc}
                </span>
              </div>
              <button
                onClick={() => {
                  navigate(`/games/${item.id}`)
                }}
                disabled={!item.active}

                className="w-full bg-yellow 2xl:text-xl md:text-base font-bold 2xl:p-3 md:p-2 text-center cursor-pointer disabled:opacity-30"
              >
                More detailed
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Games
