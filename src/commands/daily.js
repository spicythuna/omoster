const { getUser, redeemDaily } = require("../database");

daily = async message => {
    const id = message.author.id;
    try {
        const user = await getUser(id);
        if (user && user.Item) {
            const daily = await redeemDaily(id);
            message.reply(`daily redeemed! You currently have ${daily.Attributes.omopoints} omopoints.`);
        }
        else {
            message.reply("please ?register for omoster.");
        }
    }
    catch (error) {
        if (error.code === "ConditionalCheckFailedException") {
            message.reply("you've already redeemed it.");
        }
        else {
            console.log("daily error: " + error);
            message.reply("i broken - daily");
        }
    };
};

module.exports = {
    daily
};