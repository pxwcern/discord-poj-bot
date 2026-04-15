const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'minesweeper',
    execute(message) {
        const outcomes = ['You Won! 🏆', 'You Lost! 💀', 'It\'s a Tie! 🤝', 'Jackpot! 🎁'];
        const res = outcomes[Math.floor(Math.random() * outcomes.length)];
        message.reply({ embeds: [new EmbedBuilder().setTitle('🎮 Game Result').setDescription('Outcome: **' + res + '**').setColor('Gold')] });
    }
};