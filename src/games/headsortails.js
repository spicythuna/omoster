const { HTResponse } = require("../models/HTResponse.js")

headsOrTailsGame = (call, bet) => {
    const rand = Math.floor(Math.random() * (2 - 0) + 0);
    const flipped = rand === 0 ? "heads" : "tails";
    let earnings;
    let win;
    if (flipped === call) {
        earnings = parseInt(bet);
        win = true;
    }
    else {
        earnings = parseInt(-bet);
        win = false;
    }
    const response = new HTResponse(win, flipped, earnings);
    return response;
};

module.exports = {
    headsOrTailsGame
};