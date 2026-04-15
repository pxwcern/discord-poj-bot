const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'stare',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **stared at** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **stared at**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};