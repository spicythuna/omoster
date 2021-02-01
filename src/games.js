// prediction = (message) => {
    
// };

headsOrTails = (message, side, bet) => {
    if (!isNaN(bet) && Number.isInteger(parseFloat(bet)) && (parseInt(bet) > 0)) {
        enoughPoints(message.author.id)
            .then(data => {
                const check = parseInt(bet);
                const availablePoints = parseInt(data.Item.omopoints);
                if ((check <= availablePoints) && (check > 0)) {
                    return headsOrTailsUtil(message, side, check);
                }
                else {
                    message.reply(`not enough omopoints. You have ${availablePoints} omopoints available.`);
                }
            })
            .catch(error => {
                message.reply("i broken 3");
                console.log("HEADSORTAILS_MAIN ERROR: " + JSON.stringify(error, null, 2));
            });
    }
    else {
        message.reply("must bet at least 1 omopoint.")
    }
};

headsOrTailsUtil = (message, side, bet) => {
    const id = message.author.id;
    const rand = Math.floor(Math.random() * (2 - 0) + 0);
    const flipped = rand === 0 ? "heads" : "tails";

    if (flipped === side) {
        const points = bet * 2;
        updatePoints(id, points)
            .then(() => {
                message.reply(`CORRECT! It was ${flipped.toUpperCase()}. You won ${points} omopoints.`);
            })
            .catch(error => {
                message.reply("i broken 4");
                // console.log("HEADSORTAILS_WIN ERROR: " + JSON.stringify(error, null, 2));
            });
    }
    else {
        const points = -bet;
        updatePoints(id, points)
            .then (() => {
                message.reply(`WRONG! It was ${flipped.toUpperCase()}. You lost ${Math.abs(points)} omopoints.`)
            })
            .catch (error => {
                message.reply("i broken 5");
                // console.log("HEADSORTAILS_LOSE ERROR: " + JSON.stringify(error, null, 2));
            });
    }
}

module.exports = {
    headsOrTails
};