import '../styles/style.css'
import { Game } from "./game";
 
document.querySelector("#app").innerHTML = `
    <h1>Welcome to my Cookie Clicker!</h1>
    <main id="game">
    </main>
`;
 
const game = new Game({
  cookies: 0,
});
 
game.start();