require('dotenv').config();
const database = require("./database");
const util = require("./util");
const games = require("./games/headsortails");
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

    const id = message.author.id;

    if (command === "register" && args.length === 0) {
        register(id)
            .then(data => {
                message.reply("you have successfully registered.");
            })
            .catch(error => {
                message.reply("you are ALREADY registered, idiot.");
            });
    }

    if (command === "points" && args.length === 0) {
        getUser(id)
            .then(data => {
                if (data && data.Item) {
                    message.reply(`you currently have ${data.Item.omopoints} omopoints.`);
                }
                else {
                    message.reply("type ?register to register for omoster.");
                }
            })
            .catch(error => {
                message.reply("i broken - points");
            });
    }

    if (command === "daily" && args.length === 0) {
        getUser(id)
            .then(data => {
                if (data && data.Item) {
                    return redeemDaily(id);
                }
                else {
                    throw { code: "NotRegisteredError" };
                }
            })
            .then(data => {
                message.reply(`daily redeemed! You currently have ${data.Attributes.omopoints} omopoints.`);
            })
            .catch(error => {
                if (error.code === "ConditionalCheckFailedException") {
                    message.reply("don't get ahead of yourself. You've already redeemed it.");
                }
                else if (error.code === "NotRegisteredError") {
                    message.reply("type ?register to register for omoster.");
                }
                else {
                    console.log("error: " + error);
                    message.reply("i broken - daily");
                }
            })
    }

    if ((command === "heads" || command === "tails") && args.length === 1) {
        const bet = args[0];
        if (isAPositiveInteger(bet)) {
            getUser(id)
                .then(data => {
                    if (data && data.Item) {
                        const availablePoints = data.Item.omopoints;
                        if (isValidBet(availablePoints, bet)) {
                            const response = headsOrTails(command, bet);
                            if (response.win) {
                                message.reply(`CORRECT! It was ${response.flipped.toUpperCase()}. You won ${response.earnings} omopoints.`);
                            }
                            else {
                                message.reply(`WRONG! It was ${response.flipped.toUpperCase()}. You lost ${Math.abs(response.earnings)} omopoints.`);
                            }
                            return updatePoints(id, response.earnings);
                        }
                    }
                    else {
                        message.reply("type ?register to register for omoster.");
                    }
                })
                .catch(error => {
                    message.reply("i broken - headsortails");
                })
        }
        else {
            message.reply("must bet at least 1 omopoint.");
        }
    }
});

client.login(process.env.BOT_TOKEN);