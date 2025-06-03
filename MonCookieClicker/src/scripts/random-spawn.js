import goldenCookieIMG from '../assets/golden-cookie.png';

export class RandomSpawner {
  constructor(game) {
    this.game = game;
  }

  start() {
    setInterval(() => {
      this.spawnGoldenCookie();
    }, 15000); // toutes les 15 secondes
  }

  spawnGoldenCookie() {
    const golden = document.createElement('img');
    golden.src = goldenCookieIMG;
    golden.classList.add('golden-cookie');
    golden.style.position = 'absolute';
    golden.style.width = '64px';
    golden.style.height = '64px';

    // Position aléatoire
    const x = Math.random() * (window.innerWidth - 64);
    const y = Math.random() * (window.innerHeight - 64);
    golden.style.left = `${x}px`;
    golden.style.top = `${y}px`;

    // Ajout de l'animation
    golden.classList.add('fade-in-out');

    // Click = gain entre 1 et passiveGain * 1000
    golden.addEventListener('click', () => {
      const bonus = Math.floor(
        1 + Math.random() * this.game.passiveGain * 1000
      );
      this.game.cookies += bonus;
      this.game.updateScore();
      golden.remove();
    });

    document.body.appendChild(golden);

    // Disparition après 5 secondes
    setTimeout(() => {
      golden.remove();
    }, 5000);
  }
}