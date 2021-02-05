const Discord = require("discord.js");
const { createPrediction, deletePrediction } = require("../database");

prediction = async message => {
    // Need validation for registered users
    try {
        let filter = (msg) => (msg.author.id === message.author.id);
        let options = {
            max: 1,
            time: 10000
        };
        const reactions = [
            "1️⃣",
            "2️⃣",
            "3️⃣",
            "4️⃣"
        ];
        let prediction = {
            user: message.author.id
        };
        let collected, collectedArray;

        message.reply("what is the prediction?");
        collected = await message.channel.awaitMessages(filter, options);
        if (collected.size === 0) {
            throw { code: "NoResponseError" };
        }
        prediction.question = collected.array()[0].content;

        // message.reply("what is your wager?");
        // collected = await message.channel.awaitMessages(filter, options);
        // if (collected.size === 0) {
        //     throw { code: "NoResponseError" };
        // }
        // const bet = collected.array()[0].content;
        // if (!isAPositiveInteger(bet)) {
        //     throw { code: "InvalidNumberError" };
        // }
        // prediction.bet = bet;

        message.reply("list 2 to 4 options seperated by spaces (e.g. nej ando pinkdoge azuredragon013).");
        collected = await message.channel.awaitMessages(filter, options);
        if (collected.size === 0) {
            throw { code: "NoResponseError" };
        }
        const choices = collected.array()[0].content.split(" ");
        if (choices.length === 1) {
            throw { code: "NotEnoughOptionsError"};
        }
        else if (choices.length > 4) {
            throw { code: "TooManyOptionsError" };
        }
        prediction.options = choices;
        prediction.numOfOptions = choices.length;
        
        let predictionDescription = "";
        prediction.options.forEach((option, index) => {
            predictionDescription += `${reactions[index]}: ${option}\n`;
        });
        prediction.id = Math.floor(Math.random() * 1000000).toString();
        predictionDescription += `\nTo end prediction: ?endpred ${prediction.id} <winning number>`;
        predictionDescription += `\nTo cancel prediction: ?endpred ${prediction.id}`;

        //DM ID to user

        let predictionEmbed = new Discord.MessageEmbed()
            .setTitle(`${prediction.question}`)
            .setDescription(predictionDescription);
        const predEmbed = await message.channel.send(predictionEmbed);

        for (let i = 0; i < prediction.options.length; i++) {
            predEmbed.react(reactions[i]);
        }
        message.reply("?prediction is still a WIP. This is as far as the command goes.");

        for (let i = prediction.options.length; i < 4; i++) {
            prediction.options.push(null);
        }
        await createPrediction(prediction);

        filter = (reaction, user) => {
            return reactions.includes(reaction.emoji.name) && !user.bot
        };    
        options = {
            time: 10000
        };
        collected = await predEmbed.awaitReactions(filter, options);
        //console.log("collected: " + JSON.stringify(collected, null, 2));
    }
    catch (error) {
        if (error.code === "InvalidNumberError") {
            message.reply("must bet at least 1 omopoint. Prediction cancelled.");
        }
        else if (error.code === "NoResponseError") {
            message.reply("no response collected. Prediction cancelled.");
        }
        else if (error.code === "NotEnoughOptionsError") {
            message.reply("must list at least 2 options. Prediction cancelled.");
        }
        else if (error.code === "TooManyOptionsError" ) {
            message.reply("must list at most 4 options. Prediction cancelled.");
        }
        else {
            console.log("prediction error: " + error, null, 2);
            message.reply("i broken - prediction");
        }
    }
};

endPrediction = async (message, id) => {
    try {
        await deletePrediction(id);
        message.reply(`prediction ${id} ended.`);
    }
    catch (error) {
        console.log("error: " + error);
        message.reply("i broken - endprediction");
    }
};

module.exports = {
    prediction,
    endPrediction
};