const { getUser } = require("../database");

points = async message => {
    try {
        const user = await getUser(message.author.id);
        if (user && user.Item) {
            message.reply(`you currently have ${user.Item.omopoints} omopoints.`);
        }
        else {
            message.reply("please ?register for omoster.");
        }
    }
    catch (error) {
        console.log("points error: " + error);
        message.reply("i broken - points");
    };
};

module.exports = {
    points
};