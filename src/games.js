headsOrTails = (message, side, bet) => {
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
};

module.exports = {
    headsOrTails
};