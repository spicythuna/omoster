const { Collection } = require("discord.js");
const { Card } = require("../models/Card");

function Deck() {
    this.count = 52;
    // Deck is currently valued for blackjack
    this.cards = [
        new Card("♥️", "A", 11),
        new Card("♦️", "A", 11),
        new Card("♣️", "A", 11),
        new Card("♠️", "A", 11),

        new Card("♥️", "2", 2),
        new Card("♦️", "2", 2),
        new Card("♣️", "2", 2),
        new Card("♠️", "2", 2),

        new Card("♥️", "3", 3),
        new Card("♦️", "3", 3),
        new Card("♣️", "3", 3),
        new Card("♠️", "3", 3),

        new Card("♥️", "4", 4),
        new Card("♦️", "4", 4),
        new Card("♣️", "4", 4),
        new Card("♠️", "4", 4),

        new Card("♥️", "5", 5),
        new Card("♦️", "5", 5),
        new Card("♣️", "5", 5),
        new Card("♠️", "5", 5),

        new Card("♥️", "6", 6),
        new Card("♦️", "6", 6),
        new Card("♣️", "6", 6),
        new Card("♠️", "6", 6),

        new Card("♥️", "7", 7),
        new Card("♦️", "7", 7),
        new Card("♣️", "7", 7),
        new Card("♠️", "7", 7),

        new Card("♥️", "8", 8),
        new Card("♦️", "8", 8),
        new Card("♣️", "8", 8),
        new Card("♠️", "8", 8),

        new Card("♥️", "9", 9),
        new Card("♦️", "9", 9),
        new Card("♣️", "9", 9),
        new Card("♠️", "9", 9),

        new Card("♥️", "10", 10),
        new Card("♦️", "10", 10),
        new Card("♣️", "10", 10),
        new Card("♠️", "10", 10),

        new Card("♥️", "J", 10),
        new Card("♦️", "J", 10),
        new Card("♣️", "J", 10),
        new Card("♠️", "J", 10),

        new Card("♥️", "Q", 10),
        new Card("♦️", "Q", 10),
        new Card("♣️", "Q", 10),
        new Card("♠️", "Q", 10),

        new Card("♥️", "K", 10),
        new Card("♦️", "K", 10),
        new Card("♣️", "K", 10),
        new Card("♠️", "K", 10)
    ];
    this.init = function () {
        let currentIndex = this.cards.length, tempValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            tempValue = this.cards[currentIndex];
            this.cards[currentIndex] = this.cards[randomIndex];
            this.cards[randomIndex] = tempValue;
        }
    }
    this.init();
};

module.exports = {
    Deck
};