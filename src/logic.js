const { getUser, redeemDaily } = require("./database");
const { headsOrTailsGame } = require("./games/headsortails");
const { isAPositiveInteger, isValidBet } = require("./util");

daily = async id => {
    try {
        const response = await getUser(id);
        if (response && response.Item) {
            return redeemDaily(id);
        }
        else {
            return Promise.reject({ code: "NotRegisteredError" });
        }
    }
    catch (error) {
        return Promise.reject({ code: "GenericError" });
    };
};

headsOrTails = async (id, call, bet) => {
    try {
        if (isAPositiveInteger(bet) || bet === "all") {
            const response = await getUser(id);

            let availablePoints;
            if (response && response.Item) {
                availablePoints = response.Item.omopoints;

                if (bet === "all") {
                    bet = availablePoints;
                }
                
                if (isValidBet(availablePoints, bet)) {
                    const result = headsOrTailsGame(call, bet);
                    await updatePoints(id, result.earnings);
                    return result;
                }
                else {
                    return Promise.reject({ code: "NotEnoughPointsError" });
                }
            }
            else {
                return Promise.reject({ code: "NotRegisteredError" });
            }
        }
        else {
            return Promise.reject({ code: "InvalidNumberError" });
        }
    }
    catch (error) {
        return Promise.reject({ code: "GenericError" });
    };
}

module.exports = {
    daily,
    headsOrTails
};