const answers = [
    //yes
    "do it you pussy",
    "yes if u hate urself",
    "do it u won't",
    "bet",
    "i asked ando and he said sure",
    "(ﾉ^ヮ^)ﾉ・ﾟ✧Y・ﾟ✧E・ﾟ✧S・ﾟ✧ ",

    //no
    "wtf no",
    "pls no don't do it yamete",
    "that's a hard no from me ur sick in the head you fuck",
    "just go to sleep",
    "sidney said yes so you should definitely not do it",

    //funny
    "uh i dunno but u should take a shot for asking that",
    "ask again when i care",
    "i know the answer but i'm not gonna tell u",
    "why don't u go fuck urself instead"
];

decide = message => {
    const answer = answers[Math.floor(Math.random() * answers.length)];
    message.reply(answer);
};

module.exports = {
    decide
};