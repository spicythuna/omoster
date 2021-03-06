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

    else if (command === "help" && args.length === 0) {
        help(message); 
    }

    else if (command === "register" && args.length === 0) {
        register(message);
    }

    else if ((command === "points" || command === "p") && args.length === 0) {
        points(message);
    }

    else if ((command === "daily" || command === "d") && args.length === 0) {
        daily(message);
    }

    else if ((command === "heads" || command === "tails" || command === "h" || command === "t") && args.length === 1) {
        headsOrTails(message, command, args[0]);
    }

    else if ((command === "blackjack" || command === "bj") && args.length === 1) {
        blackjack(message, args[0]);
    }

    else if (command === "poll" && args.length === 0) {
        prediction(message);
    }

    else if (command === "endpoll" && args.length === 1) {
        endPrediction(message, args[0]);
    }

    else if (command === "pick" && args.length > 0) {
        pick(message, args);
    }

    else if (command === "yesno" || command === "yn") {
        decide(message);
    }
});

client.login(process.env.BOT_TOKEN);