const AWS = require("aws-sdk");
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const docClient = new AWS.DynamoDB.DocumentClient();

createUser = async id => {
    const params = {
        TableName: process.env.OMOPOINTS_TABLE_NAME,
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
        TableName: process.env.OMOPOINTS_TABLE_NAME,
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
        TableName: process.env.OMOPOINTS_TABLE_NAME,
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
        TableName: process.env.OMOPOINTS_TABLE_NAME,
        Key: {
            id: id
        }
    };

    const response = await docClient.get(params).promise();
    return response;
};

createPrediction = async p => {
    const params = {
        TableName: process.env.PREDICTIONS_TABLE_NAME,
        Item: {
            id: p.id,
            prediction: p.question,
            numOfOptions: p.numOfOptions,
            option1: p.options[0],
            option2: p.options[1],
            option3: p.options[2],
            option4: p.options[3]
        }
    }

    await docClient.put(params).promise();
};

deletePrediction = async id => {
    const params = {
        TableName: process.env.PREDICTIONS_TABLE_NAME,
        Key: {
            id: id
        }
    };

    await docClient.delete(params).promise();
};

module.exports = {
    createUser,
    redeemDaily,
    updatePoints,
    getUser,
    createPrediction,
    deletePrediction
};