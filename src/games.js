headsOrTails = (message, side, bet) => {
    enoughPoints(message.author.id)
        .then(data => {
            const currentPoints = parseInt(data.Item.omopoints);
            if (currentPoints >= parseInt(bet) && currentPoints !== 0) {
                return headsOrTailsUtil(message, side, bet);
            }
            else if (currentPoints <= 0) {
                message.reply("you must bet at least 1 omopoint.");
            }
            else {
                message.reply("you do not have enough omopoints.");
            }
        })
        .catch(error => {
            message.reply("i broken");
            console.log("HT ERROR: " + JSON.stringify(error, null, 2));
        });
};

headsOrTailsUtil = (message, side, bet) => {
    const id = message.author.id;
    const rand = Math.floor(Math.random() * (2 - 0) + 0);

    if ((rand === 0 && side === "heads") || (rand == 1 && side === "tails")) {
        const points = bet * 2;
        updatePoints(id, points)
            .then(() => {
                message.reply(`you guessed correctly! You won ${points} omopoints.`);
            })
            .catch(error => {
                console.log("HEADSORTAILS_WIN ERROR: " + JSON.stringify(error, null, 2));
            });
    }
    else {
        const points = -bet;
        updatePoints(id, points)
            .then (() => {
                message.reply(`wrong! You lost ${Math.abs(points)} omopoints.`)
            })
            .catch (error => {
                console.log("HEADSORTAILS_LOSE ERROR: " + JSON.stringify(error, null, 2));
            });
    }
}

module.exports = {
    headsOrTails
};