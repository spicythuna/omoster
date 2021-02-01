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

    const data = await docClient.put(params).promise();
    return data;
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
            ":op": 1,
            ":rdt": true
        },
        ReturnValues: "UPDATED_NEW"
    };

    const data = await docClient.update(updateParams).promise();
    return data;
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

    const data = await docClient.update(params).promise();
    return data;
}

getUser = async id => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            id: id
        }
    };

    const data = await docClient.get(params).promise();
    return data;
};

module.exports = {
    register,
    redeemDaily,
    updatePoints,
    getUser
};