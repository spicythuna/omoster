const AWS = require("aws-sdk");
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const docClient = new AWS.DynamoDB.DocumentClient();

register = async id => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: id,
            omopoints: 0,
            redeemedDaily: false
        },
        ConditionExpression: "attribute_not_exists(id)"
    };

    await docClient.put(params).promise();
};

redeemDaily = async id => {
    const updateParams = {
        TableName: process.env.TABLE_NAME,
        Key: {
            id: id
        },
        ConditionExpression: "redeemedDaily = :rdf",
        UpdateExpression: "set omopoints = omopoints + :op, redeemedDaily = :rdt",
        ExpressionAttributeValues: {
            ":rdf": false,
            ":op": 100,
            ":rdt": true
        },
        ReturnValues: "UPDATED_NEW"
    };

    const response = await docClient.update(updateParams).promise();
    return response;
};

updatePoints = async (id, points) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            id: id
        },
        UpdateExpression: "set omopoints = omopoints + :op",
        ExpressionAttributeValues: {
            ":op": points
        },
        ReturnValues: "UPDATED_NEW"
    };

    const response = await docClient.update(params).promise();
    return response;
}

getUser = async id => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            id: id
        }
    };

    const response = await docClient.get(params).promise();
    return response;
};

module.exports = {
    register,
    redeemDaily,
    updatePoints,
    getUser
};