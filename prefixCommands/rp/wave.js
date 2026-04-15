const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'wave',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **waved at** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **waved at**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};