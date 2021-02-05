pick = async (message, args) => {
    try {
        if (args.length === 1) {
            throw { code: "NotEnoughOptionsError"};
        }
        const chosen = args[Math.floor(Math.random() * args.length)];
        message.reply(`i pick ${chosen}`);
    }
    catch (error) {
        if (error.code === "NotEnoughOptionsError") {
            message.reply("must list at least 2 choices. Sacrifice cancelled.");
        }
        else {
            console.log("sacrifice error: " + error, null, 2);
            message.reply("i broken - sacrifice");
        }
    }
};

module.exports = {
    pick
};