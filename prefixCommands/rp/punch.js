const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'punch',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **punched** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **punched**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};