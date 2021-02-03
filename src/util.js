isAValidBet = async (id, bet) => {
    try {
        if ((isNaN(bet) && bet !== "all") || (Number.isInteger(parseFloat(bet)) && parseInt(bet) < 1)) {
            return Promise.reject({ code: "InvalidNumberError" });
        }

        const response = await getUser(id);

        if (response && response.Item) {
            const availablePoints = response.Item.omopoints;

            if (bet === "all") {
                bet = availablePoints;
            }

            if (bet > availablePoints) {
                return Promise.reject({ code: "NotEnoughPointsError" });
            }

            return bet;
        }
        else {
            return Promise.reject({ code: "NotRegisteredError" });
        }
    }
    catch (error) {
        console.log("error: " + error);
        return Promise.reject({ code: "GenericError" });
    }
};

module.exports = {
    isAValidBet
};