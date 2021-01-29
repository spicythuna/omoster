require('dotenv').config();

// const schedule =  require("node-schedule");

const Discord = require("discord.js");
const client = new Discord.Client();

const AWS = require("aws-sdk");
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const docClient = new AWS.DynamoDB.DocumentClient();

const prefix = "?";

// schedule.scheduleJob('0 4 * * *', () => {
//     const params = {
//         TableName: process.env.TABLE_NAME,
//         KeyConditionExpression: "id = :id",
//         ExpressionAttributeValues: {
//             ":id": id
//         }
//     };

//     docClient.query(params, (error, data) => {
//         if (data.Count == 0) {
//             message.reply("you have not registered yet.")
//         }
//         else {
//             message.reply(`you currently have ${data.Items[0].omopoints} omopoints.`)
//         }
//     });
// })

client.on("message", async message => {
    if (message.content.startsWith("hi")) {
        message.reply("shut up");
    }

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`this message had a latency of ${timeTaken}ms.`)
    }

    const id = message.author.id;

    if (command === "register") {
        const params = {
            TableName: process.env.TABLE_NAME,
            Item: {
                id: id,
                omopoints: 0,
                redeemedDaily: false
            },
            ConditionExpression: "attribute_not_exists(id)"
        };
    
        docClient.put(params, (error) => {
            if (error) {
                message.reply("unable to register. You are already registered, idiot.");
            }
            else {
                message.reply("you have successfully registered.");
            }
        });
    }

    if (command === "points") {
        const params = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: {
                ":id": id
            }
        };

        docClient.query(params, (error, data) => {
            if (data.Count == 0) {
                message.reply("you have not registered yet.");
            }
            else {
                message.reply(`you currently have ${data.Items[0].omopoints} omopoints.`);
            }
        });
    }

    if (command === "daily") {
        let params = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: {
                ":id": id
            }
        }

        docClient.query(params, (error, data) => {
            if (data.Count == 0) {
                message.reply("you have not registered yet.")
            }
            else {
                params = {
                    TableName: process.env.TABLE_NAME,
                    Key: {
                        id: id
                    },
                    ConditionExpression: "redeemedDaily = :c",
                    UpdateExpression: "set omopoints = omopoints + :o, redeemedDaily = :rd",
                    ExpressionAttributeValues: {
                        ":c": false,
                        ":o": 1,
                        ":rd": true
                    },
                    ReturnValues: "UPDATED_NEW"
                };
        
                docClient.update(params, (error, data) => {
                    if (error) {
                        message.reply("don't get ahead of yourself. You've already redeemed it.");
                    }
                    else {
                        message.reply(`daily redeemed! You currently have ${data.Attributes.omopoints} omopoints.`);
                    }
                })
            }
        });
    }
});

client.login(process.env.BOT_TOKEN);