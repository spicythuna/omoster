sacrifice = async message => {
    try {
        message.reply("who are you sacrificing? (e.g. nej ando pinkdoge azuredragon013");

        let filter = (msg) => (msg.author.id === message.author.id);
        let options = {
            max: 1,
            time: 10000
        };
        const collected = await message.channel.awaitMessages(filter, options);
        if (collected.size === 0) {
            throw { code: "NoResponseError" };
        }

        const choices = collected.array()[0].content.split(" ");
        if (choices.length === 1) {
            throw { code: "NotEnoughOptionsError"};
        }
        const chosen = choices[Math.floor(Math.random() * choices.length)];
        message.reply(`${chosen} has been chosen as sacrifice.`);
    }
    catch (error) {
        if (error.code === "NoResponseError") {
            message.reply("no response collected. Sacrifice cancelled.");
        }
        else if (error.code === "NotEnoughOptionsError") {
            message.reply("must list at least 2 choices. Sacrifice cancelled.");
        }
        else {
            console.log("sacrifice error: " + error, null, 2);
            message.reply("i broken - sacrifice");
        }
    }
};

module.exports = {
    sacrifice
};