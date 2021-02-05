const { daily } = require("./daily");

const instructions = "**\?register:**\tregister\n" +
    "**\?points:**\tcheck ur points\n" +
    "**\?daily:**\tredeem 100 omopoints hourly\n" +
    "**\?heads | ?tails:**\tplay heads or tails\n" +
    "**\?decide:**\task omoster a question\n" +
    "**\?prediction:**\tpoll a question to the server\n" +
    "**\?sacrifice:**\tlet omoster decide a sacrifice\n" +
    "**\?codebase:**\tlink to github";

help = message => {
    message.channel.send(instructions);
};

module.exports = {
    help
};