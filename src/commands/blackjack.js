const Discord = require("discord.js");
const { Deck } = require("../models/Deck");
const { BJResponse } = require("../models/BJResponse");
const { isAValidBet } = require("../util");
const { updatePoints } = require("../database");

blackjack = async (message, bet) => {
    try {
        const validBet = await isAValidBet(message.author.id, bet);
        const result = await blackjackGame(message, validBet);
        if (result.win === "player") {
            message.reply(`you won ${result.earnings} omopoints!`);
        }
        else if (result.win === "tie") {
            message.reply(`it's a tie! Your omopoints have been returned.`);
        }
        else {
            message.reply(`you lost ${Math.abs(result.earnings)} omopoints.`);
        }
        await updatePoints(message.author.id, result.earnings);
    }
    catch (error) {
        if (error.code === "TimedOutError") {
            message.reply("ran out of time. i'm taking ur bet anyways!");
            await updatePoints(message.author.id, error.bet);
        }
        else {
            console.log("error: " + error);
            message.reply("i broken - blackjack");
        }
    }
};

blackjackGame = async (message, validBet) => {
    try {
        let deck = new Deck();
        let player = {
            total: 0,
            cards: [],
            aceCount: 0
        };
        let dealer = {
            total: 0,
            cards: []
        };
        dealCards(deck, player, dealer);

        const filter = (msg) => (msg.author.id === message.author.id);
        const options = {
            max: 1,
            time: 30000
        };
        let username = message.author.username, end = false, collected, card, response, blackjackEmbed;
        while (!end) {
            blackjackEmbed = await displayGame(username, player, dealer, true);
            await message.channel.send(blackjackEmbed);

            let answer = "";
            while (answer !== "hit" && answer !== "stay") {
                message.reply("hit or stay?");
                collected = await message.channel.awaitMessages(filter, options);
                answer = collected.array()[0].content;
            }
            if (answer !== "hit" && answer !== "stay") {
                return Promise.reject({
                    code: "TimedOutError",
                    bet: -validBet
                });
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
                        blackjackEmbed = await displayGame(username, player, dealer, false);
                        await message.channel.send(blackjackEmbed);
                        response = new BJResponse("dealer", -validBet);
                        return response;
                    }
                }
            }
            else {
                end = true;
            }
        }

        while (dealer.total < 17) {
            card = deck.cards.pop();
            dealer.cards.push(card);
            dealer.total += card.value;
            if (card.rank === "A" && dealer.total > 21) {
                dealer.total -= 10;
            }
        }
        blackjackEmbed = await displayGame(username, player, dealer, false);
        await message.channel.send(blackjackEmbed);

        if (dealer.total > 21) {
            response = new BJResponse("player", validBet);
        }
        else if (dealer.total > player.total) {
            response = new BJResponse("dealer", -validBet);
        }
        else if (dealer.total === player.total) {
            response = new BJResponse("tie", 0);
        }
        else {
            response = new BJResponse("player", validBet);
        }
        return response;
    }
    catch (error) {
        return Promise.reject(error);
    };
};

dealCards = (deck, player, dealer) => {
    let playerCard, dealerCard;
    for (let i = 0; i < 2; i++) {
        playerCard = deck.cards.pop();
        if (playerCard.rank === "A") {
            player.aceCount++;
        }
        dealerCard = deck.cards.pop();
        deck.count -= 2;
        player.cards.push(playerCard);
        dealer.cards.push(dealerCard);
    }
    player.total += (player.cards[0].value + player.cards[1].value);
    dealer.total += (dealer.cards[0].value + dealer.cards[1].value);
};

displayGame = async (username, player, dealer, hide) => {
    let blackjackDescription = "**Dealer's Hand:**\n";

    if (hide) {
        blackjackDescription += `❔\n${dealer.cards[1].suit}${dealer.cards[1].rank}\n`;
    }
    else {
        dealer.cards.forEach(card => {
            blackjackDescription += `${card.suit}${card.rank}\n`;
        });
    }

    blackjackDescription += "\n**Your Hand:**\n";
    player.cards.forEach(card => {
        blackjackDescription += `${card.suit}${card.rank}\n`;
    });
    if (!hide) {
        blackjackDescription += `\n**Results:**\nDealer: ${dealer.total}\nYou: ${player.total}`;
    }
    let blackjackEmbed = new Discord.MessageEmbed()
        .setTitle(`Blackjack - ${username}`)
        .setDescription(blackjackDescription);
    return blackjackEmbed;
};

module.exports = {
    blackjack
};