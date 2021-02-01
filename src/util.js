isAPositiveInteger = n => {
    return !isNaN(n) && Number.isInteger(parseFloat(n)) && (parseInt(n) > 0);
};

isValidBet = (availablePoints, bet) => {
    return (bet <= availablePoints) && (bet > 0); 
}

module.exports = {
    isAPositiveInteger
};