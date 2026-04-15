const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'smile',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **smiled at** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **smiled at**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};