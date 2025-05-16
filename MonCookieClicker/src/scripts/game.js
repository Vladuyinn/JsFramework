import { ClickableArea } from "./clickable-area";
import { Shop } from "./shop";
import "../styles/game.css"

export class Game {
  // Game Properties
  cookies = 0;
  shop = null;

  passiveGain = 0;
  passiveInterval = null;

  // Game Elements
  gameElement = null;
  scoreElement = null;

  // Game Components
  clickableArea = null;

  constructor(config) {
    // Récupère le nombre de cookie de base via la configuration.
    this.cookies = config.cookies;
    // Récupère l'élément avec l'id game.
    this.gameElement = document.querySelector("#game");
    // Crée le composant ClickableArea qui gère la logique de la zone cliquable.
    // On passe en argument l'élément Game pour permettre l'ajout d'HTML à l'intérieur.
    // Et une fonction Callback pour réagir à l'événement de clique.
    this.clickableArea = new ClickableArea(
      this.gameElement,
      this.onClickableAreaClick
    );
    this.shop = new Shop(this, this.onShopPurchase);
  }

  onShopPurchase = (price, passiveGainBoost) => {
    this.cookies -= price;
    this.passiveGain += passiveGainBoost;
    this.updateScore();
  }

  // Lance le jeu
  start() {
    this.render();
    this.passiveInterval = setInterval(() => {
      this.cookies += this.passiveGain;
      this.updateScore();
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
    // On ajoute 1 point aux cookies pour chaque click.
    this.cookies += 1;
    // Par soucis de performance car les changements au DOM sont très lourd,
    // On demande à la Window d'attendre la prochaine frame d'animation
    // pour réaliser les changements.
    window.requestAnimationFrame(() => {
      this.updateScore();
    });
  };


}
