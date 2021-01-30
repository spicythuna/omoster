require('dotenv').config();
const database = require("./database");
const games = require("./games");
const schedule =  require("node-schedule");
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

    if (command === "register") {
        register(message);
    }

    if (command === "points") {
        getPoints(message);
    }

    if (command === "daily") {
        redeemDaily(message);
    }

    if (command === "heads" || command === "tails") {
        headsOrTails(message, command, args[0]);
    }
});

schedule.scheduleJob("11 18 * * *", async () => {
    try {
        const scanParams = {
            TableName: process.env.TABLE_NAME,
            FilterExpression: "#rd = :rd",
            ExpressionAttributeNames: {
                "#rd": "redeemedDaily"
            },
            ExpressionAttributeValues: {
                ":rd": true
            }
        };

        const data = await docClient.scan(scanParams).promise();

        for (const item of data.Items) {
            const updateParams = {
                TableName: process.env.TABLE_NAME,
                Key: {
                    id: item.id
                },
                UpdateExpression: "set redeemedDaily = :rd",
                ExpressionAttributeValues: {
                    ":rd": false,
                }
            };

            await docClient.update(updateParams).promise();
        };

        //Log that dailies reset
        //console.log("dailies reset.")
    }
    catch (error) {
        //Log that dailies are unable to reset
        //console.log("DAILYRESET ERROR: " + JSON.stringify(error, null, 2));
    }
});

client.login(process.env.BOT_TOKEN);