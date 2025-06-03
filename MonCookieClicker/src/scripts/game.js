import { ClickableArea } from "./clickable-area";
import { Shop } from "./shop";
import { RandomSpawner } from "./random-spawn"; 
import "../styles/game.css"

export class Game {
  // Game Properties
  cookies = 0;
  shop = null;
  spawner = null;

  passiveGain = 0;
  passiveInterval = null;

  // Game Elements
  gameElement = null;
  scoreElement = null;

  // Game Components
  clickableArea = null;

  constructor(config) {
    // Récupération de l’état sauvegardé ou de la config initiale
    const saved = this.load();
    this.cookies = saved?.cookies ?? config.cookies ?? 0;
    this.passiveGain = saved?.passiveGain ?? config.passiveGain ?? 0;
    this.cursorCount = saved?.cursorCount ?? config.cursorCount ?? 0;
  
    this.gameElement = document.querySelector("#game");
    this.clickableArea = new ClickableArea(
      this.gameElement,
      this.onClickableAreaClick
    );
    this.shop = new Shop(this, this.onShopPurchase);
    this.spawner = new RandomSpawner(this);
  }

  save() {
    const state = {
      cookies: this.cookies,
      passiveGain: this.passiveGain,
      cursorCount: this.cursorCount
    };
    localStorage.setItem("gameState", JSON.stringify(state));
  }
  
  load() {
    const data = localStorage.getItem("gameState");
    if (!data) return null;
    return JSON.parse(data);
  }

  onShopPurchase = (price, passiveGainBoost) => {
    this.cookies -= price;
    this.passiveGain += passiveGainBoost;
    this.cursorCount++;
    this.updateScore();
    this.save();
  };

  // Lance le jeu
  start() {
    this.render();
    this.spawner.start();
    this.passiveInterval = setInterval(() => {
      this.cookies += this.passiveGain;
      this.updateScore();
      this.save();
    }, 1000);
  }

  // Génère les éléments à afficher.
  render() {
    this.renderScore();
    this.clickableArea.render();
    this.shop.render();
  }

  // Génère l'affichage du score.
  renderScore() {
    this.scoreElement = document.createElement("section");
    this.scoreElement.id = "game-score";
    this.gameElement.append(this.scoreElement);
    this.updateScore();
    this.scoreElement.innerHTML = `
      <span>${this.cookies.toFixed(1)} cookies</span><br>
      <span>Gain passif : ${this.passiveGain.toFixed(1)} / sec</span>
    `;
  }

  // Met à jour l'affichage du score.
  updateScore() {
    this.scoreElement.innerHTML = `
      <span>${this.cookies.toFixed(1)} cookies</span><br>
      <span>Gain passif : ${this.passiveGain.toFixed(1)} / sec</span>
    `;
  }

  // Ici on utilise une fonction fléchée pour avoir encore accès au this de Game.
  // Sans fonction fléchée, le this serait celui de l'élément lié au click.
  onClickableAreaClick = () => {
    this.cookies += 1;
    this.updateScore();
    this.save();
  };


}
