module.exports = {
    name: 'roll',
    execute(message, args, client) {
        const max = parseInt(args[0]) || 100;
        const result = Math.floor(Math.random() * max) + 1;
        message.channel.send(`🎲 You rolled a **${result}** (1-${max})`);
    }
};
