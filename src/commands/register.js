const { createUser } = require("../database");

register = async message => {
    try {
        await createUser(message.author.id);
        message.reply("you have successfully registered.");
    }
    catch (error) {
        if (error.code === "ConditionalCheckFailedException") {
            message.reply("you have ALREADY registered.");
        }
        else {
            console.log("register error: " + error);
            message.reply("i broken - register");
        }
    };
};

module.exports = {
    register
};