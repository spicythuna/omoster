const { HTResponse } = require("../models/HTResponse.js")
const { isAValidBet } = require("../util");
const { updatePoints } = require("../database");

headsOrTails = async (message, call, bet) => {
    const id = message.author.id;
    try {
        const validBet = await isAValidBet(id, bet);
        const result = headsOrTailsGame(call, validBet);
        await updatePoints(id, result.earnings);
        if (result.win) {
            message.reply(`CORRECT! It was ${result.flipped.toUpperCase()}. You won ${result.earnings * 2} omopoints.`);
        }
        else {
            message.reply(`WRONG! It was ${result.flipped.toUpperCase()}. You lost ${Math.abs(result.earnings)} omopoints.`);
        }
    }
    catch (error) {
        if (error.code === "NotEnoughPointsError") {
            message.reply("you do not have enough omopoints.");
        }
        else if (error.code === "NotRegisteredError") {
            message.reply("please ?register for omoster.");
        }
        else if (error.code === "InvalidNumberError") {
            message.reply("must bet at least 1 omopoint.");
        }
        else {
            console.log("ht error: " + error);
            message.reply("i broken - ht");
        }
    };
};

headsOrTailsGame = (call, bet) => {
    if (call === "h") {
        call = "heads";
    }
    else {
        call = "tails";
    }

    const rand = Math.floor(Math.random() * (2 - 0) + 0);
    const flipped = rand === 0 ? "heads" : "tails";

    let earnings, win;
    if (flipped === call) {
        earnings = bet;
        win = true;
    }
    else {
        earnings = -bet;
        win = false;
    }
    
    const response = new HTResponse(win, flipped, earnings);
    return response;
};

module.exports = {
    headsOrTails
};