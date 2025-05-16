export class Shop {
    constructor(game, onPurchase) {
        this.game = game;
        this.shopElement = null;
        this.onPurchase = onPurchase;

        // Améliorations
        this.cursorCount = 0;
        this.cursorBasePrice = 10;
        this.cursorInterval = null;
    }

    getCursorPrice() {
        return this.cursorBasePrice + this.cursorCount * 3;
    }

    render() {
        this.shopElement = document.createElement("section");
        this.shopElement.id = "game-shop";
        this.shopElement.style.position = "absolute";
        this.shopElement.style.right = "2rem";
        this.shopElement.style.top = "5rem";
        this.shopElement.style.background = "#333";
        this.shopElement.style.padding = "1rem";
        this.shopElement.style.borderRadius = "8px";
        this.shopElement.style.color = "white";
        this.shopElement.innerHTML = `
            <h2>Shop</h2>
            <div id="cursor-upgrade">
                <p><strong>Cursor</strong><br>
                +0.1 cookie/sec<br>
                <span id="cursor-price">Price: ${this.getCursorPrice()}</span><br>
                Owned: <span id="cursor-count">${this.cursorCount}</span></p>
                <button id="buy-cursor">Buy Cursor</button>
            </div>
        `;

        document.body.appendChild(this.shopElement);

        document.querySelector("#buy-cursor").addEventListener("click", () => {
            const price = this.getCursorPrice();
            if (this.game.cookies >= price) {
                this.onPurchase(price, 0.1);
                this.cursorCount++;
                this.updateDisplay();
                this.startPassiveGeneration();
                this.game.updateScore();
            }
        });
    }

    updateDisplay() {
        document.querySelector("#cursor-count").innerText = this.cursorCount;
        document.querySelector("#cursor-price").innerText = `Price: ${this.getCursorPrice()}`;
    }

    startPassiveGeneration() {
        if (!this.cursorInterval) {
            this.cursorInterval = () => {
                const increment = 0.1 * this.cursorCount;
                this.game.cookies += increment;
                this.game.updateScore();
            };
        }
    }
}