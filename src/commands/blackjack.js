const Discord = require("discord.js");
const { Deck } = require("../models/Deck");
const { isValidBet } = require("../util");

blackjack = async (message, bet) => {
    try {
        const validBet = await isAValidBet(message.author.id, bet);
        const result = await startBlackjackGame(message);
    }
    catch (error) {
        if (error.code === "NoResponseError") {
            message.reply("no response collected. Blackjack cancelled.");
        }
        else if (error.code === "InvalidAnswerError") {
            message.reply("invalid response. Blackjack cancelled.");
        }
        else {
            console.log("error: " + error);
            message.reply("i broken - blackjack");
        }
    }
};

startBlackjackGame = async message => {
    try {
        let deck = new Deck();
        let player = {
            total: 0,
            cards: []
        };
        let dealer = {
            total: 0,
            cards: []
        };
        dealCards(deck, player, dealer);

        const filter = (msg) => (msg.author.id === message.author.id);
        const options = {
            max: 1,
            time: 10000
        };
        let end = false, collected, answer, card;
        while (!end) {
            let blackjackDescription = "**Dealer's Hand:** \n" +
                `❔\n` +
                `${dealer.cards[1].suit}${dealer.cards[1].rank}\n\n` +
                "**Your Hand:** \n";
            player.cards.forEach(card => {
                blackjackDescription += `${card.suit}${card.rank}\n`;
            })
            blackjackDescription += `=${player.total}` +
                "\n\nhit or stay";
            let blackjackEmbed = new Discord.MessageEmbed()
                .setTitle(`${message.author.username}'s Blackjack Game`)
                .setDescription(blackjackDescription);
            await message.reply(blackjackEmbed);

            collected = await message.channel.awaitMessages(filter, options);
            if (collected.size === 0) {
                return Promise.reject({ code: "NoResponseError" });
            }
            answer = collected.array()[0].content;
            if (answer !== "hit" && answer !== "stay") {
                return Promise.reject({ code: "InvalidAnswerError" });
            }
            
            if (answer === "hit") {
                card = deck.cards.pop();
                if (card.rank === "A") {
                    player.aceCount++;
                }
                player.cards.push(card);
                player.total += card.value;

                if (player.total > 21) {
                    if (player.aceCount > 0) {
                        player.total -= 10;
                        player.aceCount--;
                    }
                    else {
                        message.reply(`you lost! Your total was ${player.total}.`);
                        end = true;
                    }
                }
            }
            else {
                end = true;
            }
        }

        end = false;
        while (!end) {
            // if (dealer)
        }
    }
    catch (error) {
        return Promise.reject(error);
    };

};

dealCards = (deck, player, dealer) => {
    let playerCard, dealerCard;
    for (let i = 0; i < 2; i++) {
        playerCard = deck.cards.pop();
        dealerCard = deck.cards.pop();
        deck.count -= 2;
        player.cards.push(playerCard);
        dealer.cards.push(dealerCard);
    }
    player.total += (player.cards[0].value + player.cards[1].value);
    dealer.total += (dealer.cards[0].value + dealer.cards[1].value);
};

module.exports = {
    blackjack
};