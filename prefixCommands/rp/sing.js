const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'sing',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **sang for** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **sang for**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};