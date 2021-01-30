require('dotenv').config();
const Discord = require("discord.js");
const AWS = require("aws-sdk");
const schedule =  require("node-schedule");

const client = new Discord.Client();

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const docClient = new AWS.DynamoDB.DocumentClient();

const prefix = "?";

schedule.scheduleJob("57 17 * * *", async () => {
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
})

client.on("message", async message => {
    // Just for funsies
    if (message.content.startsWith("hi")) {
        message.reply("shut up");
    }

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift().toLowerCase();

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
                message.reply("you are ALREADY registered, idiot.");
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
            if (error) {
                message.reply("i broken 1");
            }
            else {
                if (data.Count == 0) {
                    message.reply("HELLO? DID YOU EVEN REGISTER YET?");
                }
                else {
                    message.reply(`you currently have ${data.Items[0].omopoints} omopoints.`);
                }
            }
        });
    }

    if (command === "daily") {
        try {
            const queryParams = {
                TableName: process.env.TABLE_NAME,
                KeyConditionExpression: "id = :id",
                ExpressionAttributeValues: {
                    ":id": id
                }
            };

            const data = await docClient.query(queryParams).promise();
            if (data.Count == 0) {
                message.reply("HELLO? DID YOU EVEN REGISTER YET?");
            }
            else {
                const updateParams = {
                    TableName: process.env.TABLE_NAME,
                    Key: {
                        id: id
                    },
                    ConditionExpression: "redeemedDaily = :rdf",
                    UpdateExpression: "set omopoints = omopoints + :op, redeemedDaily = :rdt",
                    ExpressionAttributeValues: {
                        ":rdf": false,
                        ":op": 1,
                        ":rdt": true
                    },
                    ReturnValues: "UPDATED_NEW"
                };

                const data = await docClient.update(updateParams).promise()
                message.reply(`daily redeemed! You currently have ${data.Attributes.omopoints} omopoints.`);
            }
        }
        catch (error) {
            if (error.code == "ConditionalCheckFailedException") {
                message.reply("don't get ahead of yourself. You've already redeemed it.");
            }
            else {
                message.reply("i broken 2");
            }
        }
    }
});

client.login(process.env.BOT_TOKEN);