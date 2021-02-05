require('dotenv').config();
const modules = require("./commands/modules");
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "?";
const codebase = "https://github.com/spicythuna/omoster";

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift().toLowerCase();

    if (message.content.startsWith("hi")) {
        message.reply("shut up");
    }

    else if (command === "code" && args.length === 0) {
        message.channel.send(`check out the codebase at ${codebase}`);
    }

    else if (command === "register" && args.length === 0) {
        register(message);
    }

    else if (command === "points" && args.length === 0) {
        points(message);
    }

    else if (command === "daily" && args.length === 0) {
        daily(message);
    }

    else if ((command === "heads" || command === "tails") && args.length === 1) {
        headsOrTails(message, command, args[0]);
    }

    else if (command === "blackjack" && args.length === 1) {
        blackjack(message, args[0]);
    }

    else if (command === "prediction" && args.length === 0) {
        prediction(message);
    }

    else if (command === "endprediction" && args.length === 1) {
        endPrediction(message, args[0]);
    }

    else if (command === "sacrifice" && args.length === 0) {
        sacrifice(message);
    }

    else if (command === "decide" && args.length === 0) {
        decide(message);
    }
});

client.login(process.env.BOT_TOKEN);