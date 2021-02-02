require('dotenv').config();
const database = require("./database");
const util = require("./util");
const games = require("./games/headsortails");
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "?";

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift().toLowerCase();

    const id = message.author.id;

    if (message.content.startsWith("hi")) {
        message.reply("shut up");
    }
    else if (command === "register" && args.length === 0) {
        register(id)
            .then(data => {
                message.reply("you have successfully registered.");
            })
            .catch(error => {
                message.reply("you are ALREADY registered, idiot.");
            });
    }
    else if (command === "points" && args.length === 0) {
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
    else if (command === "daily" && args.length === 0) {
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
    else if ((command === "heads" || command === "tails") && args.length === 1) {
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
    // else if (command === "prediction" && args.length === 0) {
    //     const filter = (message) => !message.author.bot;
    //     const options = {
    //         max: 1,
    //         time: 60000
    //     };
    //     const reactions = [
    //         "1️⃣",
    //         "2️⃣",
    //         "3️⃣",
    //         "4️⃣"
    //     ];
    //     let prediction = {};
    //     message.reply("what is the prediction?")
    //         .then(() => {
    //             return message.channel.awaitMessages(filter, options);
    //         })
    //         .then(collected => {
    //             prediction.question = collected.array()[0].content;
    //             return message.reply("what is the wager?")
    //         })
    //         .then(() => {
    //             return message.channel.awaitMessages(filter, options);
    //         })
    //         .then(collected => {
    //             const bet = collected.array()[0].content;;
    //             if (isAPositiveInteger(bet)) {
    //                 prediction.bet = bet;
    //                 return message.reply("list at most four options seperated by spaces (e.g. \"nej ando pinkdoge azuredragon013\").");
    //             }
    //             else {
    //                 throw { code : "InvalidBetError" };
    //             }
    //         })
    //         .then(() => {
    //             return message.channel.awaitMessages(filter, options);
    //         })
    //         .then(collected => {
    //             prediction.options = collected.array()[0].content.split(" ");

    //             let predictionDescription = "";
    //             prediction.options.forEach((option, index) => {
    //                 predictionDescription += `${reactions[index]}: ${option}\n`;
    //             });

    //             let predictionEmbed = new Discord.MessageEmbed()
    //                 .setTitle(`${prediction.question}`)
    //                 .setDescription(predictionDescription);
    //             return message.channel.send(predictionEmbed);
    //         })
    //         .then(predEmbed => {
    //             for (let i = 0; i < prediction.options.length; i++) {
    //                 predEmbed.react(reactions[i]);
    //             }

    //             const filter = (reaction, user) => {
    //                 return reactions.includes(reaction.emoji.name) && !user.bot
    //             };
    //             const options = {
    //                 time: 600000
    //             };
    //             return predEmbed.awaitReactions(filter, options);
    //         })
    //         .catch(error => {
    //             if (error.code === "InvalidBetError") {
    //                 message.reply("could not create prediction. Must bet at least 1 omopoint.")
    //             }
    //             else {
    //                 message.reply("i broken - prediction");
    //                 console.log("error: " + error);
    //             }
    //         });
    // }
});

client.login(process.env.BOT_TOKEN);