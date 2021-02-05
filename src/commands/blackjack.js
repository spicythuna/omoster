const { Deck } = require("../models/Deck");
const { isValidBet } = require("../util");

blackjack = async (message, bet) => {
    try {
        const validBet = await isAValidBet(message.author.id, bet);
        const result = startBlackjackGame(message);
    }
    catch (error) {
        console.log("error: " + error);
        message.reply("i broken - blackjack");
    }
};

startBlackjackGame = () => {
    var deck = new Deck();
};

module.exports = {
    blackjack
};