const { getUser, redeemDaily, updatePoints } = require("./database");
const { headsOrTailsGame } = require("./games/headsortails");
const { startBlackjackGame } = require("./games/blackjack");
const { isAValidBet } = require("./util");
const Discord = require("discord.js");

register = async message => {
    try {
        await createUser(message.author.id);
        message.reply("you have successfully registered.");
    }
    catch (error) {
        if (error.code === "ConditionalCheckFailedException") {
            message.reply("you have ALREADY registered.");
        }
        else {
            console.log("register error: " + error);
            message.reply("i broken - register");
        }
    };
};

points = async message => {
    try {
        const user = await getUser(message.author.id);
        if (user && user.Item) {
            message.reply(`you currently have ${user.Item.omopoints} omopoints.`);
        }
        else {
            message.reply("please ?register for omoster.");
        }
    }
    catch (error) {
        console.log("points error: " + error);
        message.reply("i broken - points");
    };
};

daily = async message => {
    const id = message.author.id;
    try {
        const user = await getUser(id);
        if (user && user.Item) {
            const daily = await redeemDaily(id);
            message.reply(`daily redeemed! You currently have ${daily.Attributes.omopoints} omopoints.`);
        }
        else {
            message.reply("please ?register for omoster.");
        }
    }
    catch (error) {
        if (error.code === "ConditionalCheckFailedException") {
            message.reply("you've already redeemed it.");
        }
        else {
            console.log("daily error: " + error);
            message.reply("i broken - daily");
        }
    };
};

headsOrTails = async (message, call, bet) => {
    const id = message.author.id;
    try {
        const validBet = await isAValidBet(id, bet);
        const result = headsOrTailsGame(call, validBet);
        await updatePoints(id, result.earnings);
        if (result.win) {
            message.reply(`CORRECT! It was ${result.flipped.toUpperCase()}. You won ${result.earnings} omopoints.`);
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

prediction = async message => {
    // Need validation for registered users
    try {
        let filter = (msg) => (msg.author.id === message.author.id);
        let options = {
            max: 1,
            time: 30000
        };
        const reactions = [
            "1️⃣",
            "2️⃣",
            "3️⃣",
            "4️⃣"
        ];
        let prediction = {};
        let collected;

        message.reply("what is the prediction?");
        collected = await message.channel.awaitMessages(filter, options);
        prediction.question = collected.array()[0].content;

        //Need validation for every awaitMessages()

        // message.reply("what is your wager?");
        // collected = await message.channel.awaitMessages(filter, options);
        // const bet = collected.array()[0].content;
        // if (!isAPositiveInteger(bet)) {
        //     throw { code: "InvalidNumberError" };
        // }
        // prediction.bet = bet;

        message.reply("list at most four options seperated by spaces (e.g. \"nej ando pinkdoge azuredragon013\").");
        collected = await message.channel.awaitMessages(filter, options);
        prediction.options = collected.array()[0].content.split(" ");

        let predictionDescription = "";
        prediction.options.forEach((option, index) => {
            predictionDescription += `${reactions[index]}: ${option}\n`;
        });

        let predictionEmbed = new Discord.MessageEmbed()
            .setTitle(`${prediction.question}`)
            .setDescription(predictionDescription);
        const predEmbed = await message.channel.send(predictionEmbed);

        for (let i = 0; i < prediction.options.length; i++) {
            predEmbed.react(reactions[i]);
        }

        filter = (reaction, user) => {
            return reactions.includes(reaction.emoji.name) && !user.bot
        };
        options = {
            time: 600000
        };
        collected = predEmbed.awaitReactions(filter, options);
        message.reply("?prediction is still a WIP. This is as far as the command goes.")
    }
    catch (error) {
        if (error.code === "InvalidNumberError") {
            message.reply("must bet at least 1 omopoint.");
        }
        else {
            console.log("prediction error: " + error);
            message.reply("i broken - prediction");
        }
    }
};

module.exports = {
    register,
    points,
    daily,
    headsOrTails,
    prediction
};