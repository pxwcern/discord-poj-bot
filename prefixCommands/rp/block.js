const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'block',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **blocked** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **blocked**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};