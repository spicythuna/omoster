const AWS = require("aws-sdk");
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const docClient = new AWS.DynamoDB.DocumentClient();

register = async message => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: message.author.id,
            omopoints: 0,
            redeemedDaily: false
        },
        ConditionExpression: "attribute_not_exists(id)"
    };

    await docClient.put(params).promise()
        .then(() => {
            message.reply("you have successfully registered.");
        })
        .catch(error => {
            message.reply("you are ALREADY registered, idiot.");
        });
};

getPoints = message => {
    const params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": message.author.id
        }
    };

    docClient.query(params, (error, data) => {
        if (error) {
            message.reply("i broken 1");
        }
        else {
            if (data.Count === 0) {
                message.reply("HELLO? DID YOU EVEN REGISTER YET?");
            }
            else {
                message.reply(`you currently have ${data.Items[0].omopoints} omopoints.`);
            }
        }
    });
};

redeemDaily = async message => {
    try {
        const queryParams = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: {
                ":id": message.author.id
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
                    id: message.author.id
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

updatePoints = async (id, points) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            id: id
        },
        UpdateExpression: "set omopoints = omopoints + :op",
        ExpressionAttributeValues: {
            ":op": points
        }
    };

    await docClient.update(params).promise();
}

enoughPoints = async (id) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            id: id
        }
    };

    const data = await docClient.get(params).promise();
    return data;
}

module.exports = {
    register,
    getPoints,
    redeemDaily,
    updatePoints,
    enoughPoints
};