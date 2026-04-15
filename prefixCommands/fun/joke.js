module.exports = {
    name: 'joke',
    execute(message, args, client) {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "I told my Wi-Fi a joke, but it didn't get a connection.",
            "Why did the developer go broke? Because he used up all his cache.",
            "I would tell you a joke about UDP, but you might not get it.",
            "There are 10 types of people in the world: those who understand binary, and those who don't."
        ];
        message.channel.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }
};
