require('dotenv').config();
const database = require("./database");
const logic = require("./logic");
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
        const filter = (message) => !message.author.bot;
        const options = {
            max: 1,
            time: 60000
        };
        const reactions = [
            "1️⃣",
            "2️⃣",
            "3️⃣",
            "4️⃣"
        ];
        let prediction = {};
        message.reply("what is the prediction?")
            .then(() => {
                return message.channel.awaitMessages(filter, options);
            })
            .then(collected => {
                prediction.question = collected.array()[0].content;
                return message.reply("what is the wager?")
            })
            .then(() => {
                return message.channel.awaitMessages(filter, options);
            })
            .then(collected => {
                const bet = collected.array()[0].content;;
                if (isAPositiveInteger(bet)) {
                    prediction.bet = bet;
                    return message.reply("list at most four options seperated by spaces (e.g. \"nej ando pinkdoge azuredragon013\").");
                }
                else {
                    throw { code : "InvalidBetError" };
                }
            })
            .then(() => {
                return message.channel.awaitMessages(filter, options);
            })
            .then(collected => {
                prediction.options = collected.array()[0].content.split(" ");

                let predictionDescription = "";
                prediction.options.forEach((option, index) => {
                    predictionDescription += `${reactions[index]}: ${option}\n`;
                });

                let predictionEmbed = new Discord.MessageEmbed()
                    .setTitle(`${prediction.question}`)
                    .setDescription(predictionDescription);
                return message.channel.send(predictionEmbed);
            })
            .then(predEmbed => {
                for (let i = 0; i < prediction.options.length; i++) {
                    predEmbed.react(reactions[i]);
                }

                const filter = (reaction, user) => {
                    return reactions.includes(reaction.emoji.name) && !user.bot
                };
                const options = {
                    time: 600000
                };
                return predEmbed.awaitReactions(filter, options);
            })
            .catch(error => {
                if (error.code === "InvalidBetError") {
                    message.reply("could not create prediction. Must bet at least 1 omopoint.")
                }
                else {
                    message.reply("i broken - prediction");
                    console.log("error: " + error);
                }
            });
    }
});

client.login(process.env.BOT_TOKEN);