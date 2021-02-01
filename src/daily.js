const schedule =  require("node-schedule");

const AWS = require("aws-sdk");
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const docClient = new AWS.DynamoDB.DocumentClient();

resetDaily = async () => {
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
        // console.log("dailies reset.")
    }
    catch (error) {
        //Log that dailies are unable to reset
        // console.log("DAILYRESET ERROR: " + JSON.stringify(error, null, 2));
    }
};

resetDaily();