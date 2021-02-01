require('dotenv').config();
const database = require("./database");
const games = require("./games");
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "?";

client.on("message", async message => {
    if (message.content.startsWith("hi")) {
        message.reply("shut up");
    }

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift().toLowerCase();

    if (command === "register" && args.length === 0) {
        register(message);
    }

    if (command === "points" && args.length === 0) {
        getPoints(message);
    }

    if (command === "daily" && args.length === 0) {
        redeemDaily(message);
    }

    if ((command === "heads" || command === "tails") && args.length === 1) {
        headsOrTails(message, command, args[0]);
    }

    // if (command === "prediction") {
    //     prediction(message);
    // }
});

client.login(process.env.BOT_TOKEN);