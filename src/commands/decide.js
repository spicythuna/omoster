const answers = [
    //yes responses
    "yes",
    "sure why not",
    "yes if u hate urself",
    "YASSSSSSS",
    "i asked ando and he said sure",

    //no responses
    "nah",
    "wtf no",
    "it's a hard no from me sir",
    "no",
    "sidney said yes so it's a definite no",

    //funny responses
    "uh i dunno but u should take a shot for asking that",
    "ask again when i care",
    "i know the answer but i'm not gonna tell u",
    "why don't u go fuck urself instead",
    "kys"
];

decide = message => {
    const answer = answers[Math.floor(Math.random() * answers.length)];
    message.reply(answer);
};

module.exports = {
    decide
};