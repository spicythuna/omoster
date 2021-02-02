require('dotenv').config();
const database = require("./database");
const logic = require("./logic");
const Discord = require("discord.js");
const { isAPositiveInteger } = require('./util');
const client = new Discord.Client();
const prefix = "?";
const codebase = "https://github.com/spicythuna/omoster";

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift().toLowerCase();

    const id = message.author.id;

    if (message.content.startsWith("hi")) {
        message.reply("shut up");
    }

    else if (command === "code" && args.length === 0) {
        message.channel.send(`check out the codebase at ${codebase}`);
    }

    else if (command === "register" && args.length === 0) {
        try {
            await register(id);
            message.reply("you have successfully registered.");
        }
        catch (error) {
            if (error.code === "ConditionalCheckFailedException") {
                message.reply("you have ALREADY registered.");
            }
            else {
                message.reply("i broken - register");
            }
        };
    }

    else if (command === "points" && args.length === 0) {
        try {
            const response = await getUser(id);
            if (response && response.Item) {
                message.reply(`you currently have ${response.Item.omopoints} omopoints.`);
            }
            else {
                message.reply("please ?register for omoster.");
            }
        }
        catch (error) {
            message.reply("i broken - points");
        }
    }

    else if (command === "daily" && args.length === 0) {
        try {
            const response = await daily(id);
            message.reply(`daily redeemed! You currently have ${response.Attributes.omopoints} omopoints.`);
        }
        catch (error) {
            if (error.code === "ConditionalCheckFailedException") {
                message.reply("you've already redeemed it.");
            }
            else if (error.code === "NotRegisteredError") {
                message.reply("please ?register for omoster.");
            }
            else {
                message.reply("i broken - daily");
            }
        };
    }

    else if ((command === "heads" || command === "tails") && args.length === 1) {
        try {
            const response = await headsOrTails(id, command, args[0]);
            if (response.win) {
                message.reply(`CORRECT! It was ${response.flipped.toUpperCase()}. You won ${response.earnings} omopoints.`);
            }
            else {
                message.reply(`WRONG! It was ${response.flipped.toUpperCase()}. You lost ${Math.abs(response.earnings)} omopoints.`);
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
                message.reply("i broken - ht");
            }
        };
    }

    else if (command === "prediction" && args.length === 0) {
        try {
            let filter = (message) => (message.author.id === id);
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
                message.reply("i broken - prediction");
            }
        }
    }
});

client.login(process.env.BOT_TOKEN);